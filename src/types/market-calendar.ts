export type MarketSentiment = "positive" | "negative" | "pending";

export interface MarketEvent {
  id: string;
  /** Event name, e.g. "RBI Monetary Policy Committee decision" */
  event: string;
  /** Next occurrence, ISO date (YYYY-MM-DD) */
  nextDate: string;
  /** Publisher/authority name, e.g. "Reserve Bank of India" */
  source: string;
  /** Link to the source's official calendar or release page */
  sourceUrl: string;
  sentiment: MarketSentiment;
  /** One-line note on why this moves Indian markets */
  note: string;
  /** Date is an estimate, not yet confirmed by the issuer */
  estimated?: boolean;
}
