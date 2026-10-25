import type { CompanyResult } from "@/types/earnings";
import { siteConfig } from "@/config/site";
import { daysBetween } from "@/lib/market-calendar/dates";

/* ────────────────────────────────────────────────────────────────
   Live US quarterly figures from SEC EDGAR's free XBRL API.

   For each company we read revenue, net income and diluted EPS as filed
   in 10-Qs and 10-Ks. Filings give three-month figures for Q1–Q3; the
   fourth quarter is the full year minus the nine-month year-to-date.
   A live result only replaces the hand-checked one when it covers a newer
   quarter, and any gap or error leaves the hand-checked card in place.
   ──────────────────────────────────────────────────────────────── */

// SEC asks automated clients to identify themselves with a contact address
const HEADERS = { "User-Agent": `Fistotex ${siteConfig.contactEmail}`, Accept: "application/json" };
const REVALIDATE = 6 * 60 * 60;

const TAGS = {
  revenue: [
    "Revenues",
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "RevenuesNetOfInterestExpense",
    "SalesRevenueNet",
  ],
  profit: ["NetIncomeLoss"],
  eps: ["EarningsPerShareDiluted", "EarningsPerShareBasic"],
};

interface Fact {
  start?: string;
  end: string;
  val: number;
  form?: string;
}

async function concept(cik: number, tag: string, unit: string): Promise<Fact[]> {
  try {
    const res = await fetch(
      `https://data.sec.gov/api/xbrl/companyconcept/CIK${String(cik).padStart(10, "0")}/us-gaap/${tag}.json`,
      { headers: HEADERS, next: { revalidate: REVALIDATE }, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { units?: Record<string, unknown> };
    // Usually an array of facts, but some filers' concepts come back in another shape
    const facts = data.units?.[unit];
    return Array.isArray(facts) ? (facts as Fact[]) : [];
  } catch {
    return [];
  }
}

/** Quarter-end date → three-month value. */
function quarterSeries(facts: Fact[]): Map<string, number> {
  const q = new Map<string, number>();
  const ytd9 = new Map<string, { start: string; val: number }>();
  const fy = new Map<string, { start: string; val: number }>();

  for (const f of facts) {
    if (!f.start || !/^10-[QK]/.test(f.form ?? "")) continue;
    const len = daysBetween(f.start, f.end);
    if (len >= 80 && len <= 100) q.set(f.end, f.val);
    else if (len >= 260 && len <= 285) ytd9.set(f.end, { start: f.start, val: f.val });
    else if (len >= 350 && len <= 380) fy.set(f.end, { start: f.start, val: f.val });
  }
  // Fourth quarter = full year minus the nine months to the third quarter
  for (const [end, year] of fy) {
    if (q.has(end)) continue;
    for (const [end9, nine] of ytd9) {
      const gap = daysBetween(end9, end);
      if (nine.start === year.start && gap >= 80 && gap <= 100) q.set(end, year.val - nine.val);
    }
  }
  return q;
}

/** The candidate tag whose series reaches the most recent quarter. */
async function bestSeries(cik: number, tags: string[], unit: string) {
  const all = await Promise.all(tags.map((t) => concept(cik, t, unit).then(quarterSeries)));
  let best = new Map<string, number>();
  let bestEnd = "";
  for (const s of all) {
    const latest = [...s.keys()].sort().pop() ?? "";
    if (latest > bestEnd) {
      best = s;
      bestEnd = latest;
    }
  }
  return best;
}

/** The value for the quarter ending about `days` before `end`, if filed. */
function around(series: Map<string, number>, end: string, days: number) {
  for (const [e, v] of series) {
    if (Math.abs(daysBetween(e, end) - days) <= 12) return v;
  }
  return undefined;
}

const pct = (now: number, then?: number) =>
  then === undefined || then === 0 ? NaN : Math.round(((now - then) / Math.abs(then)) * 1000) / 10;

/** A newer quarter for this US company from its SEC filings, or null. */
export async function liveUsResult(base: CompanyResult, today: string): Promise<CompanyResult | null> {
  if (!base.cik) return null;
  const [rev, profit, eps] = await Promise.all([
    bestSeries(base.cik, TAGS.revenue, "USD"),
    bestSeries(base.cik, TAGS.profit, "USD"),
    bestSeries(base.cik, TAGS.eps, "USD/shares"),
  ]);

  // The newest quarter all three figures were filed for
  const end = [...rev.keys()].filter((e) => profit.has(e) && eps.has(e)).sort().pop();
  if (!end || end <= base.periodEnd) return null;

  const r = rev.get(end)!;
  const p = profit.get(end)!;
  const growth = {
    revenueYoY: pct(r, around(rev, end, 364)),
    revenueQoQ: pct(r, around(rev, end, 91)),
    profitYoY: pct(p, around(profit, end, 364)),
    profitQoQ: pct(p, around(profit, end, 91)),
  };
  if (Object.values(growth).some((g) => Number.isNaN(g))) return null;

  const nextIsPast = base.next.kind === "date" && base.next.date <= today;
  return {
    ...base,
    ...growth,
    periodEnd: end,
    quarter: "",
    revenue: Math.round(r / 1e7) / 100,
    netProfit: Math.round(p / 1e7) / 100,
    eps: eps.get(end)!,
    // The hand-written caveat described an older quarter
    profitNote: undefined,
    source: "SEC filings",
    sourceUrl: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${base.cik}&type=10-Q&dateb=&owner=include&count=40`,
    next: nextIsPast ? { kind: "reported" } : base.next,
    live: true,
  };
}
