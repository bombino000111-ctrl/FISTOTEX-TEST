export type MarketSentiment = "positive" | "negative" | "pending";

/** Who an event matters to, in plain terms */
export type Audience = "savers" | "borrowers" | "investors" | "traders";

export type EventKind = "rates" | "economy" | "global" | "results" | "expiry" | "policy";

export interface MarketEvent {
  id: string;
  /** Event name, e.g. "RBI Monetary Policy Committee decision" */
  event: string;
  /** Next occurrence, ISO date (YYYY-MM-DD) */
  nextDate: string;
  /** Release time when known, e.g. "4:00 pm IST" */
  time?: string;
  kind: EventKind;
  /** Publisher/authority name, e.g. "Reserve Bank of India" */
  source: string;
  /** Link to the source's official calendar or release page */
  sourceUrl: string;
  sentiment: MarketSentiment;
  /** Why markets watch it */
  note: string;
  /** What it means for an ordinary person, in one plain sentence */
  forYou: string;
  audience: Audience[];
  /** A calculator that helps act on the outcome */
  calculator?: { id: string; label: string };
  /** For results days: the companies reporting */
  companies?: string[];
  /** Date is an estimate, not yet confirmed by the issuer */
  estimated?: boolean;
}
