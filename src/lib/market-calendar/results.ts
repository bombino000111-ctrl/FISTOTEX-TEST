import type { MarketEvent } from "@/types/market-calendar";
import { LARGE_COMPANIES, type ResultsMeeting } from "@/lib/nse";

/**
 * One calendar entry per day on which large companies report, from NSE's
 * live board-meeting list. Smaller companies are left to NSE's own calendar.
 */
export function resultsEvents(meetings: ResultsMeeting[]): MarketEvent[] {
  const byDate = new Map<string, string[]>();
  for (const m of meetings) {
    if (!LARGE_COMPANIES.has(m.symbol)) continue;
    byDate.set(m.date, [...(byDate.get(m.date) ?? []), m.company]);
  }

  return [...byDate.entries()].map(([date, companies]) => ({
    id: `results-${date}`,
    event:
      companies.length <= 3
        ? `Results: ${companies.join(", ")}`
        : `Results from ${companies.length} large companies`,
    nextDate: date,
    kind: "results",
    source: "NSE board meetings calendar",
    sourceUrl: "https://www.nseindia.com/companies-listing/corporate-filings-event-calendar",
    sentiment: "pending",
    note: "Boards meet to approve quarterly results, usually released after market hours.",
    forYou: "If you own these shares, or funds that hold them, results can move their price the next day.",
    audience: ["investors", "traders"],
    companies,
  }));
}
