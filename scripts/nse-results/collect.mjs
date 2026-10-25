#!/usr/bin/env node
/* ────────────────────────────────────────────────────────────────
   Collect quarterly results for every NSE-listed company.

   Since 2025 listed companies file results through NSE's "Integrated
   Filing (Financials)". This script pages through that feed, reads the
   profit-and-loss lines from each filing's XBRL, and keeps the last few
   quarters per company.

   Output, in the directory given:
     index.json            one summary row per company (for search and lists)
     companies/<SYM>.json  that company's quarters, line by line
     state.json            where the top-up and backfill have reached

   Each run spends a fixed budget of XBRL downloads on:
     1. Top-up: new filings since the last run.
     2. Backfill: older filings, working backwards until about 15 months
        of history exist (enough for year-on-year growth), then stops.

   Deliberately slow (about one request a second) so NSE isn't strained.
   Usage: node collect.mjs <out-dir>
   Env: MAX_FILINGS (default 400), DELAY_MS (default 1100)
   ──────────────────────────────────────────────────────────────── */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const OUT = process.argv[2] ?? "nse-data";
const MAX_FILINGS = Number(process.env.MAX_FILINGS ?? 400);
const DELAY_MS = Number(process.env.DELAY_MS ?? 1100);
const KEEP_QUARTERS = 8;
const HISTORY_DAYS = 460;

const BASE = "https://www.nseindia.com";
const REFERER = `${BASE}/companies-listing/corporate-integrated-filing`;
const LIST = `${BASE}/api/integrated-filing-results?index=equities&period_ended=all&type=Integrated%20Filing-%20Financials`;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MON = { JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06", JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12" };

/** "30-SEP-2026" or "08-Oct-2026 22:07:33" → "2026-09-30" */
function isoDate(s) {
  const m = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})/.exec(s ?? "");
  return m ? `${m[3]}-${MON[m[2].toUpperCase()]}-${m[1].padStart(2, "0")}` : null;
}
/** "dd-mm-yyyy" for the feed's date-range filter */
const dmy = (iso) => iso.split("-").reverse().join("-");
const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const days = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
/** Filenames: keep NSE symbols readable but safe ("M&M" → "M&M", "BAJAJ-AUTO" unchanged) */
const fileFor = (sym) => join(OUT, "companies", `${sym.replace(/[^A-Za-z0-9&-]/g, "_")}.json`);

// ── session ──────────────────────────────────────────────────────
let cookie = "";
async function refreshCookie() {
  const res = await fetch(BASE, { headers: { "User-Agent": UA, Accept: "text/html" } });
  cookie = (res.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
  if (!cookie) throw new Error(`No NSE session cookie (HTTP ${res.status})`);
}

let requests = 0;
async function get(url, { json = false, retries = 2 } = {}) {
  for (let attempt = 0; ; attempt++) {
    await sleep(DELAY_MS);
    requests++;
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: json ? "application/json" : "*/*", Referer: REFERER, Cookie: cookie },
    });
    if (res.ok) return json ? res.json() : res.text();
    if (attempt >= retries) throw new Error(`HTTP ${res.status} for ${url}`);
    // Session cookies expire; get a fresh one and back off before retrying
    await refreshCookie();
    await sleep(3000 * (attempt + 1));
  }
}

// ── XBRL ─────────────────────────────────────────────────────────
function fact(xml, tag) {
  const re = new RegExp(`<in-capmkt:${tag}\\s[^>]*contextRef="OneD"[^>]*>\\s*(-?[0-9.]+)\\s*<`);
  const m = re.exec(xml);
  return m ? Number(m[1]) : undefined;
}
/** First tag present, as { tag, v } */
function first(xml, tags) {
  for (const t of tags) {
    const v = fact(xml, t);
    if (v !== undefined && Number.isFinite(v)) return { tag: t, v };
  }
  return undefined;
}
const crore = (inr) => (inr === undefined ? undefined : Math.round(inr / 1e5) / 100);
const val = (xml, tags) => crore(first(xml, tags)?.v);

/**
 * One quarter's profit and loss, in ₹ crore (EPS in ₹), or null when the
 * filing isn't a three-month result. Field names follow Screener-style
 * quarterly tables so the site can lay them out directly:
 *   sales, exp (total expenses), oi (other income), int (finance costs),
 *   dep, pbt, tax, np (net profit to shareholders), eps
 * Banks file a different template; for them sales is total income and
 * ie (interest expended), opx (operating expenses) and prov (provisions)
 * are recorded instead of exp.
 */
function parseFiling(xml, xbrlUrl) {
  const start = /<in-capmkt:DateOfStartOfReportingPeriod[^>]*contextRef="OneD"[^>]*>([0-9-]+)</.exec(xml)?.[1];
  const end = /<in-capmkt:DateOfEndOfReportingPeriod[^>]*contextRef="OneD"[^>]*>([0-9-]+)</.exec(xml)?.[1];
  if (!start || !end) return null;
  const len = days(start, end);
  if (len < 80 || len > 100) return null;

  const bank = /_BANKING_/.test(xbrlUrl);
  const kind = bank ? "bank" : /_NBFC_/.test(xbrlUrl) ? "nbfc" : /INSURANCE/i.test(xbrlUrl) ? "insurance" : "company";

  const sales = bank
    ? first(xml, ["Income", "TotalIncome", "InterestEarned"])
    : first(xml, ["RevenueFromOperations", "TotalRevenueFromOperations", "Income", "TotalIncome"]);
  const np = first(xml, [
    "ProfitOrLossAttributableToOwnersOfParent",
    "ProfitLossAttributableToOwnersOfParent",
    "ProfitLossAfterTaxesMinorityInterestAndShareOfProfitLossOfAssociates",
    "ProfitLossForPeriod",
    "ProfitLossForThePeriod",
  ]);
  if (!sales || !np) return null;

  const eps = first(xml, [
    "BasicEarningsLossPerShareFromContinuingAndDiscontinuedOperations",
    "BasicEarningsLossPerShareFromContinuingOperations",
    "BasicEarningsPerShareAfterExtraordinaryItems",
  ]);

  const q = {
    end,
    kind,
    // "rev" = revenue from operations, "inc" = total income (banks, some financials)
    sl: sales.tag.startsWith("Revenue") || sales.tag === "TotalRevenueFromOperations" ? "rev" : "inc",
    sales: crore(sales.v),
    oi: bank ? val(xml, ["OtherIncome"]) : val(xml, ["OtherIncome"]),
    int: bank ? val(xml, ["InterestExpended"]) : val(xml, ["FinanceCosts"]),
    dep: val(xml, ["DepreciationDepletionAndAmortisationExpense"]),
    pbt: val(xml, ["ProfitBeforeTax", "ProfitLossFromOrdinaryActivitiesBeforeTax", "ProfitLossBeforeTax"]),
    tax: val(xml, ["TaxExpense"]),
    np: crore(np.v),
    eps: eps ? Math.round(eps.v * 100) / 100 : undefined,
  };
  if (bank) {
    q.opx = val(xml, ["OperatingExpenses"]);
    q.prov = val(xml, ["ProvisionsOtherThanTaxAndContingencies"]);
  } else {
    q.exp = val(xml, ["Expenses", "TotalExpenses"]);
  }
  // Drop absent fields to keep files small
  for (const k of Object.keys(q)) if (q[k] === undefined) delete q[k];
  return q;
}

// ── store ────────────────────────────────────────────────────────
mkdirSync(join(OUT, "companies"), { recursive: true });
const readJson = (f, fallback) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8") || "null") ?? fallback : fallback);

const state = readJson(join(OUT, "state.json"), {});
const companies = {};
for (const f of readdirSync(join(OUT, "companies"))) {
  if (!f.endsWith(".json")) continue;
  const c = readJson(join(OUT, "companies", f), null);
  if (c?.symbol) companies[c.symbol] = c;
}
const changed = new Set();

/** Should this filing replace what we hold for that company and quarter? */
function wanted(row) {
  const end = isoDate(row.qe_Date);
  const held = companies[row.symbol]?.quarters?.find((q) => q.end === end);
  if (!held) return true;
  const consolidated = row.consolidated === "Consolidated";
  if (held.basis === "S" && consolidated) return true; // prefer consolidated
  if ((held.basis === "C") !== consolidated) return false;
  return Number(row.seq_Id) > Number(held.seq ?? 0); // a later revision
}

function store(row, q) {
  const symbol = row.symbol;
  const c = (companies[symbol] ??= { symbol, name: "", quarters: [] });
  c.name = (row.smName || row.cmName || c.name).replace(/\s+(Limited|Ltd\.?)$/i, "").trim();
  const entry = {
    ...q,
    basis: row.consolidated === "Consolidated" ? "C" : "S",
    filed: isoDate(row.broadcast_Date),
    seq: row.seq_Id,
    xbrl: row.xbrl,
    ...(row.ixbrl ? { html: row.ixbrl } : {}),
  };
  c.quarters = [entry, ...c.quarters.filter((x) => x.end !== q.end)]
    .sort((a, b) => b.end.localeCompare(a.end))
    .slice(0, KEEP_QUARTERS);
  changed.add(symbol);
}

let budget = MAX_FILINGS;
let stored = 0;
let skipped = 0;

async function processRows(rows) {
  for (const row of rows) {
    if (budget <= 0) return false;
    if (!row.symbol || !row.xbrl || !/\.xml$/i.test(row.xbrl) || !wanted(row)) continue;
    budget--;
    try {
      const q = parseFiling(await get(row.xbrl), row.xbrl);
      if (q) {
        store(row, q);
        stored++;
      } else skipped++;
    } catch (e) {
      skipped++;
      console.warn(`skip ${row.symbol}: ${e.message}`);
    }
  }
  return budget > 0;
}

/** Walk one date window newest-first, page by page. False if the budget ran out. */
async function walk(fromIso, toIso) {
  for (let page = 1; ; page++) {
    const res = await get(`${LIST}&from_date=${dmy(fromIso)}&to_date=${dmy(toIso)}&page=${page}&size=100`, { json: true });
    const rows = res?.data ?? [];
    if (rows.length === 0) return true;
    if (!(await processRows(rows))) return false;
    if (rows.length < 100) return true;
  }
}

/** Growth in percent, or undefined when there's nothing comparable. */
const growth = (now, then) =>
  now === undefined || then === undefined || then === 0 ? undefined : Math.round(((now - then) / Math.abs(then)) * 1000) / 10;

/** The summary row the site lists and searches. */
function summary(c) {
  const [latest] = c.quarters;
  const yearAgo = c.quarters.find((q) => Math.abs(days(q.end, latest.end) - 365) <= 15);
  const prev = c.quarters.find((q) => Math.abs(days(q.end, latest.end) - 91) <= 15);
  return {
    symbol: c.symbol,
    name: c.name,
    kind: latest.kind,
    end: latest.end,
    filed: latest.filed,
    sales: latest.sales,
    np: latest.np,
    eps: latest.eps,
    salesYoY: growth(latest.sales, yearAgo?.sales),
    npYoY: growth(latest.np, yearAgo?.np),
    salesQoQ: growth(latest.sales, prev?.sales),
    npQoQ: growth(latest.np, prev?.np),
  };
}

async function main() {
  await refreshCookie();
  const today = new Date().toISOString().slice(0, 10);

  // 1. Top-up: everything filed since a couple of days before the last run
  const since = state.lastRun ? addDays(state.lastRun, -2) : addDays(today, -7);
  const caughtUp = await walk(since, today);
  if (!state.backfillBefore) state.backfillBefore = since;
  // Only move the top-up mark forward once every new filing has been read
  if (caughtUp) state.lastRun = today;

  // 2. Backfill older filings a week at a time until enough history exists
  const floor = addDays(today, -HISTORY_DAYS);
  while (budget > 0 && state.backfillBefore > floor) {
    const to = addDays(state.backfillBefore, -1);
    const from = addDays(to, -6);
    if (!(await walk(from, to))) break; // budget ran out mid-window; resume here next run
    state.backfillBefore = from;
  }
  state.backfillDone = state.backfillBefore <= floor;
  state.updatedAt = new Date().toISOString();

  for (const sym of changed) writeFileSync(fileFor(sym), JSON.stringify(companies[sym]));
  const index = Object.values(companies)
    .filter((c) => c.quarters.length)
    .map(summary)
    .sort((a, b) => a.name.localeCompare(b.name));
  writeFileSync(
    join(OUT, "index.json"),
    JSON.stringify({ source: "NSE Integrated Filing (Financials)", updatedAt: state.updatedAt, companies: index })
  );
  writeFileSync(join(OUT, "state.json"), JSON.stringify(state, null, 2));

  console.log(
    `stored ${stored}, skipped ${skipped}, requests ${requests}, companies ${index.length}, ` +
      `backfill ${state.backfillDone ? "done" : `back to ${state.backfillBefore}`}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
