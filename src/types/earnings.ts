export type EarningsMarket = "IN" | "US";

/** When the next quarterly results are due */
export type NextResults =
  | { kind: "date"; date: string; estimated?: boolean }
  /** Only a rough window is known, e.g. "Late Nov" — always an estimate */
  | { kind: "approx"; label: string }
  /** The newest quarter is already reported; the next date isn't set yet */
  | { kind: "reported" }
  | { kind: "tba" };

export interface CompanyResult {
  id: string;
  name: string;
  market: EarningsMarket;
  /** Quarter the figures cover, e.g. "Q2 FY27" */
  quarter: string;
  /** Last day of that quarter (YYYY-MM-DD) */
  periodEnd: string;
  /** NSE symbol, for live results dates (India) */
  symbol?: string;
  /** SEC company identifier, for live figures (US) */
  cik?: number;
  /** True when the figures came live from SEC filings rather than the hand-checked list */
  live?: boolean;
  /** Banks report net interest income or total income instead of revenue */
  revenueLabel: "Revenue" | "NII" | "Total income";
  /** ₹ crore for India, US$ billion for the US */
  revenue: number;
  netProfit: number;
  /** Per share, in ₹ or US$ */
  eps: number;
  /** Growth in percent, as reported */
  revenueYoY: number;
  revenueQoQ: number;
  profitYoY: number;
  profitQoQ: number;
  /** Shown under the card when profit growth needs a caveat */
  profitNote?: string;
  source: string;
  sourceUrl: string;
  next: NextResults;
}
