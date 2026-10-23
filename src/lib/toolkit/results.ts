/**
 * Quarterly results data for the Nifty 50.
 *
 * Source: Yahoo Finance's public fundamentals-timeseries endpoint, which
 * carries company-reported quarterly revenue and net income for NSE stocks.
 * Fetched server-side with a 6-hour cache; symbols that fail are skipped and
 * counted. Numbers should always be cross-checked against the exchange
 * filing - the page links each row to the company's NSE page.
 */

const YAHOO_BASE = "https://query1.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries";
const FETCH_OPTS = {
  headers: { "User-Agent": "Mozilla/5.0 (compatible; Fistotex/1.0)" },
  next: { revalidate: 21600 }, // 6 hours
} as const;

export interface QuarterPoint {
  asOfDate: string; // yyyy-mm-dd
  value: number; // INR
}

export interface CompanyResults {
  symbol: string;
  name: string;
  quarterLabel: string; // e.g. "Q2 FY27 (Sep 2026)"
  revenue: number | null;
  pat: number | null;
  revenueQoQ: number | null; // %
  revenueYoY: number | null; // %
  patQoQ: number | null;
  patYoY: number | null;
  /** Expected deadline for the next results declaration (quarter end + 45 days, SEBI LODR Reg 33). */
  nextExpectedBy: string;
}

interface TimeseriesEntry {
  asOfDate: string;
  reportedValue?: { raw?: number };
}

function pct(now: number | undefined, then: number | undefined): number | null {
  if (now == null || then == null || then === 0) return null;
  return ((now - then) / Math.abs(then)) * 100;
}

function quarterLabel(asOfDate: string): string {
  const [y, m] = asOfDate.split("-").map(Number);
  // Indian fiscal quarters: Q1 Apr-Jun (ends Jun), Q2 Jul-Sep, Q3 Oct-Dec, Q4 Jan-Mar
  const map: Record<number, { q: string; fy: (y: number) => number; mon: string }> = {
    3: { q: "Q4", fy: (y) => y, mon: "Mar" },
    6: { q: "Q1", fy: (y) => y + 1, mon: "Jun" },
    9: { q: "Q2", fy: (y) => y + 1, mon: "Sep" },
    12: { q: "Q3", fy: (y) => y + 1, mon: "Dec" },
  };
  const f = map[m];
  if (!f) return asOfDate;
  return `${f.q} FY${String(f.fy(y)).slice(2)} (${f.mon} ${y})`;
}

/** Next declaration deadline: quarter end + 45 days. */
function nextExpectedBy(asOfDate: string): string {
  const d = new Date(asOfDate + "T00:00:00Z");
  // next quarter end
  const m = d.getUTCMonth();
  const nextEnd = new Date(Date.UTC(d.getUTCFullYear(), m + 4, 0)); // end of month +3
  nextEnd.setUTCDate(nextEnd.getUTCDate() + 45);
  return nextEnd.toISOString().slice(0, 10);
}

function toPoints(entries: TimeseriesEntry[] | undefined): QuarterPoint[] {
  return (entries ?? [])
    .filter((e) => e.reportedValue?.raw != null)
    .map((e) => ({ asOfDate: e.asOfDate, value: e.reportedValue!.raw! }))
    .sort((a, b) => a.asOfDate.localeCompare(b.asOfDate));
}

async function fetchOne(symbol: string, name: string): Promise<CompanyResults | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const p1 = now - 3 * 366 * 86400;
    const url = `${YAHOO_BASE}/${encodeURIComponent(symbol)}?type=quarterlyTotalRevenue,quarterlyNetIncome&period1=${p1}&period2=${now + 86400}`;
    const res = await fetch(url, FETCH_OPTS);
    if (!res.ok) return null;
    const json = await res.json();
    const results: { meta?: { type?: string[] }; timestamp?: number[]; [k: string]: unknown }[] =
      json?.timeseries?.result ?? [];
    let revenue: QuarterPoint[] = [];
    let pat: QuarterPoint[] = [];
    for (const r of results) {
      const t = r.meta?.type?.[0];
      if (t === "quarterlyTotalRevenue") revenue = toPoints(r["quarterlyTotalRevenue"] as TimeseriesEntry[]);
      if (t === "quarterlyNetIncome") pat = toPoints(r["quarterlyNetIncome"] as TimeseriesEntry[]);
    }
    if (revenue.length === 0 && pat.length === 0) return null;
    const latest = (revenue.at(-1) ?? pat.at(-1))!;
    const r0 = revenue.at(-1)?.value, r1 = revenue.at(-2)?.value, r4 = revenue.at(-5)?.value;
    const p0 = pat.at(-1)?.value, p1v = pat.at(-2)?.value, p4 = pat.at(-5)?.value;
    return {
      symbol,
      name,
      quarterLabel: quarterLabel(latest.asOfDate),
      revenue: r0 ?? null,
      pat: p0 ?? null,
      revenueQoQ: pct(r0, r1),
      revenueYoY: pct(r0, r4),
      patQoQ: pct(p0, p1v),
      patYoY: pct(p0, p4),
      nextExpectedBy: nextExpectedBy(latest.asOfDate),
    };
  } catch {
    return null;
  }
}

export async function getNiftyResults(
  list: { symbol: string; name: string }[]
): Promise<{ rows: CompanyResults[]; failed: number }> {
  // Batches of 10 to stay friendly to the upstream endpoint.
  const rows: CompanyResults[] = [];
  let failed = 0;
  for (let i = 0; i < list.length; i += 10) {
    const batch = await Promise.all(list.slice(i, i + 10).map((c) => fetchOne(c.symbol, c.name)));
    for (const r of batch) {
      if (r) rows.push(r);
      else failed++;
    }
  }
  // Most recent quarter first, then biggest revenue.
  rows.sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));
  return { rows, failed };
}

/** Compact INR formatting: 1.94 lakh crore -> "1.94L Cr". */
export function formatINRCrore(value: number | null): string {
  if (value == null) return "-";
  const crore = value / 1e7;
  if (Math.abs(crore) >= 100000) return `${(crore / 100000).toFixed(2)}L Cr`;
  if (Math.abs(crore) >= 1000) return `${(crore / 1000).toFixed(1)}k Cr`;
  return `${crore.toFixed(0)} Cr`;
}

export function formatPct(v: number | null): string {
  if (v == null) return "-";
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
}

export function nseQuoteUrl(symbol: string): string {
  return `https://www.nseindia.com/get-quotes/equity?symbol=${encodeURIComponent(symbol.replace(".NS", ""))}`;
}
