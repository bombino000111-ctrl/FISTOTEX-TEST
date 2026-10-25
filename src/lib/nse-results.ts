/* ────────────────────────────────────────────────────────────────
   Quarterly results for every NSE-listed company.

   Collected every few hours by .github/workflows/nse-results.yml (NSE
   blocks Vercel's servers, but not GitHub's) into the repo's `nse-data`
   branch, and read here over raw.githubusercontent.com with an hourly
   cache. Everything fails soft: callers get null/empty and show a calm
   "not available yet" state.

   Figures are ₹ crore except EPS (₹). Field names follow the Screener-style
   quarterly table; see scripts/nse-results/collect.mjs for how each is read.
   ──────────────────────────────────────────────────────────────── */

const DATA_BASE = "https://raw.githubusercontent.com/bombino000111-ctrl/FISTOTEX-TEST/nse-data";
const REVALIDATE = 60 * 60;

export type CompanyKind = "company" | "bank" | "nbfc" | "insurance";

export interface NseQuarter {
  /** Last day of the quarter, YYYY-MM-DD */
  end: string;
  kind: CompanyKind;
  /** "rev" = revenue from operations; "inc" = total income (banks, some financials) */
  sl: "rev" | "inc";
  sales: number;
  /** Total expenses including interest and depreciation (non-banks) */
  exp?: number;
  /** Other income */
  oi?: number;
  /** Finance costs; for banks, interest expended */
  int?: number;
  dep?: number;
  pbt?: number;
  tax?: number;
  /** Net profit attributable to shareholders */
  np: number;
  eps?: number;
  /** Banks only: operating expenses and provisions */
  opx?: number;
  prov?: number;
  /** C = consolidated, S = standalone */
  basis: "C" | "S";
  /** Date filed with NSE */
  filed: string;
  /** Machine-readable filing and its human-readable version */
  xbrl: string;
  html?: string;
}

export interface NseCompany {
  symbol: string;
  name: string;
  /** Newest first, up to eight quarters */
  quarters: NseQuarter[];
}

export interface NseSummary {
  symbol: string;
  name: string;
  kind: CompanyKind;
  end: string;
  filed: string;
  sales: number;
  np: number;
  eps?: number;
  salesYoY?: number;
  npYoY?: number;
  salesQoQ?: number;
  npQoQ?: number;
}

export interface NseIndex {
  source: string;
  updatedAt: string;
  companies: NseSummary[];
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${DATA_BASE}/${path}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Summary rows for every company with results on file, or null if the data isn't reachable. */
export function getNseIndex(): Promise<NseIndex | null> {
  return getJson<NseIndex>("index.json");
}

/** One company's quarters, or null if we have nothing for that symbol. */
export function getNseCompany(symbol: string): Promise<NseCompany | null> {
  const file = symbol.toUpperCase().replace(/[^A-Z0-9&-]/g, "_");
  return getJson<NseCompany>(`companies/${encodeURIComponent(file)}.json`);
}
