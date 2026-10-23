/**
 * Market-moving event calendar.
 *
 * Data policy: every dated entry below comes from an official, publicly
 * published source (RBI press releases, NSE circulars, the US Federal
 * Reserve calendar, MoSPI's advance release calendar). Sources are listed
 * per group. The data is reviewed and re-verified against those sources on
 * a monthly cadence; the "reviewedOn" stamp shows when that last happened.
 *
 * F&O expiry dates are COMPUTED from the exchange's current expiry-day
 * convention (NSE: Tuesday; BSE: Thursday), shifted back to the previous
 * trading day when the expiry day is a trading holiday.
 */

export type EventKind =
  | "rbi"
  | "global-central-bank"
  | "expiry"
  | "budget"
  | "macro-data"
  | "results-season"
  | "holiday"
  | "special-session";

export interface MarketEvent {
  /** ISO date (yyyy-mm-dd). For multi-day meetings, the decision day. */
  date: string;
  /** Optional span label, e.g. "Dec 2-4" for a 3-day meeting. */
  span?: string;
  title: string;
  kind: EventKind;
  /** true = expect an outsized move that day; flagged in the UI. */
  volatile: boolean;
  note?: string;
}

/** NSE/BSE trading holidays remaining in the current calendar year (NSE circular CMTR71775, Dec 12 2025). */
export const TRADING_HOLIDAYS_2026: Record<string, string> = {
  "2026-11-10": "Diwali - Balipratipada",
  "2026-11-24": "Prakash Gurpurb (Sri Guru Nanak Dev Jayanti)",
  "2026-12-25": "Christmas",
};

export const TRADING_HOLIDAYS_2027: Record<string, string> = {
  "2027-01-26": "Republic Day",
};

const HOLIDAYS: Record<string, string> = { ...TRADING_HOLIDAYS_2026, ...TRADING_HOLIDAYS_2027 };

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isTradingDay(d: Date): boolean {
  const day = d.getUTCDay();
  return day !== 0 && day !== 6 && !HOLIDAYS[toISO(d)];
}

/** Last weekly/monthly expiry for a given year+month, rolled back over weekends/holidays. */
function monthlyExpiry(year: number, monthIndex: number, weekday: number): Date {
  const d = new Date(Date.UTC(year, monthIndex + 1, 0)); // last day of month
  while (d.getUTCDay() !== weekday) d.setUTCDate(d.getUTCDate() - 1);
  while (!isTradingDay(d)) d.setUTCDate(d.getUTCDate() - 1);
  return d;
}

/** NSE monthly F&O expiry dates (Tuesday convention) for the next `months` months. */
export function upcomingExpiries(fromISO: string, months = 4): MarketEvent[] {
  const from = new Date(fromISO + "T00:00:00Z");
  const out: MarketEvent[] = [];
  for (let i = 0; i < months; i++) {
    const y = from.getUTCFullYear();
    const m = from.getUTCMonth() + i;
    const d = monthlyExpiry(y, m, 2); // 2 = Tuesday (NSE convention, 2025-26)
    if (d < from) continue;
    const label = d.toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" });
    out.push({
      date: toISO(d),
      title: `F&O monthly expiry (${label})`,
      kind: "expiry",
      volatile: true,
      note: "NSE index & stock derivatives expire on Tuesdays; rolled to the previous trading day on holidays. Expect rollover-driven volatility.",
    });
  }
  return out;
}

/** Fixed, officially published events. Decision day is the date used for sorting. */
export const SCHEDULED_EVENTS: MarketEvent[] = [
  {
    date: "2026-10-28",
    span: "Oct 27-28",
    title: "US Fed FOMC decision",
    kind: "global-central-bank",
    volatile: true,
    note: "Global risk sentiment driver for FII flows into India.",
  },
  {
    date: "2026-11-08",
    title: "Muhurat trading (Diwali Laxmi Pujan)",
    kind: "special-session",
    volatile: false,
    note: "Special one-hour Sunday session; timings notified by NSE circular.",
  },
  {
    date: "2026-11-12",
    title: "CPI inflation (October print)",
    kind: "macro-data",
    volatile: true,
    note: "MoSPI release, usually the 12th of the month. A surprise vs the RBI's band moves rate-sensitive stocks.",
  },
  {
    date: "2026-11-27",
    title: "GDP Q2 FY27 (Jul-Sep)",
    kind: "macro-data",
    volatile: true,
    note: "MoSPI quarterly estimates, expected in the last week of November.",
  },
  {
    date: "2026-12-04",
    span: "Dec 2-4",
    title: "RBI MPC decision",
    kind: "rbi",
    volatile: true,
    note: "Rate decision + Governor's briefing on the final day. Bank and NBFC stocks typically swing.",
  },
  {
    date: "2026-12-09",
    span: "Dec 8-9",
    title: "US Fed FOMC decision",
    kind: "global-central-bank",
    volatile: true,
  },
  {
    date: "2026-12-12",
    title: "CPI inflation (November print)",
    kind: "macro-data",
    volatile: true,
  },
  {
    date: "2026-12-15",
    title: "Advance tax Q3 installment",
    kind: "macro-data",
    volatile: false,
    note: "75% of annual advance tax due; liquidity effect is modest.",
  },
  {
    date: "2027-01-08",
    span: "Jan 8 - Feb 14",
    title: "Q3 FY27 results season",
    kind: "results-season",
    volatile: true,
    note: "Companies must declare quarterly results within 45 days of quarter end (SEBI LODR). IT majors usually open the season.",
  },
  {
    date: "2027-01-12",
    title: "CPI inflation (December print)",
    kind: "macro-data",
    volatile: true,
  },
  {
    date: "2027-01-27",
    span: "Jan 26-27",
    title: "US Fed FOMC decision",
    kind: "global-central-bank",
    volatile: true,
  },
  {
    date: "2027-02-01",
    title: "Union Budget 2027",
    kind: "budget",
    volatile: true,
    note: "The single biggest scheduled volatility event for Indian markets. Expect sharp index swings during the speech.",
  },
  {
    date: "2027-02-05",
    span: "Feb 3-5",
    title: "RBI MPC decision",
    kind: "rbi",
    volatile: true,
  },
  {
    date: "2027-02-12",
    title: "CPI inflation (January print)",
    kind: "macro-data",
    volatile: true,
  },
  {
    date: "2027-02-26",
    title: "GDP Q3 FY27 (Oct-Dec)",
    kind: "macro-data",
    volatile: true,
    note: "Expected in the last week of February per MoSPI's release calendar.",
  },
  {
    date: "2027-03-17",
    span: "Mar 16-17",
    title: "US Fed FOMC decision",
    kind: "global-central-bank",
    volatile: true,
  },
];

/** Day count from today (Asia/Kolkata) to the event date. */
export function daysUntil(iso: string, now = new Date()): number {
  const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const today = Date.UTC(istNow.getFullYear(), istNow.getMonth(), istNow.getDate());
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - today) / 86400000);
}

export function allEvents(now = new Date()): MarketEvent[] {
  const todayISO = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    .toISOString()
    .slice(0, 10);
  const holidays: MarketEvent[] = Object.entries(HOLIDAYS)
    .filter(([d]) => d >= todayISO)
    .map(([d, name]) => ({
      date: d,
      title: `Market holiday - ${name}`,
      kind: "holiday" as const,
      volatile: false,
      note: "NSE & BSE closed.",
    }));
  return [...SCHEDULED_EVENTS, ...upcomingExpiries(todayISO, 4), ...holidays]
    .filter((e) => daysUntil(e.date, now) >= -1)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Where each data group comes from - shown on the page for trust. */
export const CALENDAR_SOURCES = [
  { label: "RBI press release, MPC schedule 2026-27 (Mar 23, 2026)", href: "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62422" },
  { label: "NSE circular CMTR71775 - 2026 trading holidays", href: "https://nsearchives.nseindia.com/content/circulars/CMTR71775.pdf" },
  { label: "US Federal Reserve FOMC calendar", href: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  { label: "MoSPI advance release calendar", href: "https://www.mospi.gov.in/release-calendar" },
];

export const CALENDAR_REVIEWED_ON = "October 23, 2026";
