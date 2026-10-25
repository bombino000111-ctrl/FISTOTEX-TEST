/* ────────────────────────────────────────────────────────────────
   News by what the reader needs, not by newsroom desk.

   A saver, a borrower, an investor and a trader care about different
   stories. Each "need" is a group of topics (the categories assigned in
   rss.ts), and each topic points at the calculators that turn the story
   into the reader's own numbers.
   ──────────────────────────────────────────────────────────────── */

export interface ReaderNeed {
  id: string;
  label: string;
  /** One line under the filter explaining who it's for */
  hint: string;
  topics: string[];
}

export const readerNeeds: ReaderNeed[] = [
  {
    id: "saving",
    label: "Saving & tax",
    hint: "Deposits, small savings schemes, tax and insurance",
    topics: ["banking", "personal-finance", "tax", "insurance"],
  },
  {
    id: "borrowing",
    label: "Loans & EMIs",
    hint: "Home, car and personal loans, rates and EMIs",
    topics: ["loans", "banking"],
  },
  {
    id: "investing",
    label: "Investing",
    hint: "Mutual funds, SIPs, IPOs and the long-term market picture",
    topics: ["mutual-funds", "ipo", "stocks", "markets", "economy"],
  },
  {
    id: "trading",
    label: "Trading",
    hint: "Stocks, indices and global markets, day to day",
    topics: ["stocks", "markets", "global-markets", "ipo"],
  },
];

export function needTopics(id: string): string[] | null {
  return readerNeeds.find((n) => n.id === id)?.topics ?? null;
}

/** Calculators that answer "what does this mean for me?" for a topic. */
const topicCalculators: Record<string, Array<{ id: string; label: string }>> = {
  banking: [
    { id: "fd", label: "FD calculator" },
    { id: "rd", label: "RD calculator" },
  ],
  loans: [
    { id: "emi", label: "EMI calculator" },
    { id: "loan", label: "Loan eligibility" },
  ],
  "mutual-funds": [
    { id: "sip", label: "SIP calculator" },
    { id: "xirr", label: "XIRR calculator" },
  ],
  tax: [
    { id: "ppf", label: "PPF calculator" },
    { id: "nps", label: "NPS calculator" },
  ],
  "personal-finance": [
    { id: "retirement", label: "Retirement calculator" },
    { id: "ppf", label: "PPF calculator" },
  ],
  insurance: [{ id: "retirement", label: "Retirement calculator" }],
  economy: [
    { id: "inflation", label: "Inflation calculator" },
    { id: "fd", label: "FD calculator" },
  ],
  stocks: [{ id: "cagr", label: "CAGR calculator" }],
  markets: [
    { id: "sip", label: "SIP calculator" },
    { id: "lumpsum", label: "Lumpsum calculator" },
  ],
  ipo: [{ id: "cagr", label: "CAGR calculator" }],
  "global-markets": [{ id: "cagr", label: "CAGR calculator" }],
  business: [{ id: "cagr", label: "CAGR calculator" }],
};

export function calculatorsForTopic(topic?: string) {
  return topicCalculators[topic ?? ""] ?? [];
}
