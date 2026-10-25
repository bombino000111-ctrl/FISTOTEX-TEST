/* ────────────────────────────────────────────────────────────────
   Live results dates from NSE's corporate event calendar.

   NSE has no official public API: its website calls this endpoint, which
   only answers after a visit to the homepage sets a session cookie, and it
   may refuse cloud servers entirely. So everything here fails soft —
   callers get an empty list and fall back to hand-checked data.
   ──────────────────────────────────────────────────────────────── */

const BASE = "https://www.nseindia.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const REVALIDATE = 6 * 60 * 60;

/** Large, widely held companies (Nifty 50 constituents) worth listing for everyone. */
export const LARGE_COMPANIES = new Set([
  "ADANIENT", "ADANIPORTS", "APOLLOHOSP", "ASIANPAINT", "AXISBANK", "BAJAJ-AUTO", "BAJFINANCE",
  "BAJAJFINSV", "BEL", "BHARTIARTL", "CIPLA", "COALINDIA", "DRREDDY", "EICHERMOT", "ETERNAL",
  "GRASIM", "HCLTECH", "HDFCBANK", "HDFCLIFE", "HINDALCO", "HINDUNILVR", "ICICIBANK", "INDIGO",
  "INFY", "ITC", "JIOFIN", "JSWSTEEL", "KOTAKBANK", "LT", "M&M", "MARUTI", "MAXHEALTH",
  "NESTLEIND", "NTPC", "ONGC", "POWERGRID", "RELIANCE", "SBILIFE", "SBIN", "SHRIRAMFIN",
  "SUNPHARMA", "TATACONSUM", "TMPV", "TATAMOTORS", "TATASTEEL", "TCS", "TECHM", "TITAN",
  "TRENT", "ULTRACEMCO", "WIPRO",
]);

export interface ResultsMeeting {
  symbol: string;
  company: string;
  /** YYYY-MM-DD */
  date: string;
}

const MONTHS: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

/** "26-Oct-2026" → "2026-10-26" */
function parseNseDate(s: string): string | null {
  const m = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/.exec(s.trim());
  if (!m || !MONTHS[m[2]]) return null;
  return `${m[3]}-${MONTHS[m[2]]}-${m[1].padStart(2, "0")}`;
}

/** Tidy NSE's legal names for display: "Infosys Limited" → "Infosys". */
export function shortCompanyName(name: string) {
  return name.replace(/\s+(Limited|Ltd\.?)$/i, "").trim();
}

async function sessionCookie(): Promise<string | null> {
  const res = await fetch(BASE, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(8000),
  });
  const cookies = res.headers.getSetCookie?.() ?? [];
  if (!res.ok || cookies.length === 0) return null;
  return cookies.map((c) => c.split(";")[0]).join("; ");
}

/**
 * Upcoming board meetings that will consider financial results, from today
 * on. Empty when NSE can't be reached.
 */
export async function upcomingResultsMeetings(today: string): Promise<ResultsMeeting[]> {
  try {
    const cookie = await sessionCookie();
    if (!cookie) return [];
    const res = await fetch(`${BASE}/api/event-calendar`, {
      headers: {
        "User-Agent": UA,
        Accept: "application/json",
        Referer: `${BASE}/companies-listing/corporate-filings-event-calendar`,
        Cookie: cookie,
      },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok || !res.headers.get("content-type")?.includes("json")) return [];
    const rows = (await res.json()) as Array<{ symbol?: string; company?: string; purpose?: string; date?: string }>;
    if (!Array.isArray(rows)) return [];

    const seen = new Set<string>();
    const out: ResultsMeeting[] = [];
    for (const r of rows) {
      if (!r.symbol || !r.company || !r.date || !/financial results/i.test(r.purpose ?? "")) continue;
      const date = parseNseDate(r.date);
      if (!date || date < today || seen.has(r.symbol)) continue;
      seen.add(r.symbol);
      out.push({ symbol: r.symbol, company: shortCompanyName(r.company), date });
    }
    return out.sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}
