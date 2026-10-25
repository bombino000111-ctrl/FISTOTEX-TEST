import type { MarketEvent } from "@/types/market-calendar";

/* ────────────────────────────────────────────────────────────────
   Releases that follow a fixed rule, generated rather than typed in,
   so the calendar never runs dry between manual updates.

   Rules follow each issuer's published practice. Where the rule date
   lands on a weekend the release can move, so those occurrences are
   marked as estimated. Exchange holidays aren't modelled.
   ──────────────────────────────────────────────────────────────── */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
/** 0 = Sunday … 6 = Saturday, for a calendar date */
const weekday = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).getUTCDay();
const isWeekend = (y: number, m: number, d: number) => [0, 6].includes(weekday(y, m, d));
const daysIn = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();

/** The nth working day (Mon–Fri) of a month, 1-based. */
function nthWorkingDay(y: number, m: number, n: number) {
  let count = 0;
  for (let d = 1; d <= daysIn(y, m); d++) {
    if (!isWeekend(y, m, d) && ++count === n) return d;
  }
  return 1;
}

function lastWorkingDay(y: number, m: number) {
  for (let d = daysIn(y, m); d > 0; d--) if (!isWeekend(y, m, d)) return d;
  return daysIn(y, m);
}

/** Last given weekday (0–6) of a month. */
function lastWeekday(y: number, m: number, wd: number) {
  for (let d = daysIn(y, m); d > 0; d--) if (weekday(y, m, d) === wd) return d;
  return daysIn(y, m);
}

const prevMonthName = (m: number) => MONTHS[(m + 11) % 12];

interface Rule {
  id: string;
  /** Months (0–11) the rule applies in; all months when omitted */
  months?: number[];
  day: (y: number, m: number) => number;
  /** True when the rule date can move and should be shown as approximate */
  approx?: (y: number, m: number, d: number) => boolean;
  build: (y: number, m: number) => Omit<MarketEvent, "id" | "nextDate" | "estimated">;
}

const MOSPI = { source: "MOSPI release calendar", sourceUrl: "https://www.mospi.gov.in/release-calendar" };

const rules: Rule[] = [
  {
    id: "india-cpi",
    day: () => 12,
    approx: (y, m, d) => isWeekend(y, m, d),
    build: (_y, m) => ({
      event: `India retail inflation (CPI) for ${prevMonthName(m)}`,
      time: "4:00 pm IST",
      kind: "economy",
      ...MOSPI,
      sentiment: "pending",
      note: "The RBI targets this number. A surprise moves bond yields, bank stocks and the odds of a rate change.",
      forYou: "Shows how fast prices are rising. If inflation outpaces your FD or savings rate, your money is losing value.",
      audience: ["savers", "borrowers", "investors", "traders"],
      calculator: { id: "inflation", label: "Inflation calculator" },
    }),
  },
  {
    id: "india-iip",
    day: () => 28,
    approx: (y, m, d) => isWeekend(y, m, d),
    build: (_y, m) => ({
      event: `India industrial output (IIP) for ${prevMonthName(m)}`,
      time: "4:00 pm IST",
      kind: "economy",
      ...MOSPI,
      sentiment: "pending",
      note: "Factory, mining and power output; an early read on manufacturing ahead of GDP.",
      forYou: "A gauge of how busy factories are. Mostly matters if you invest in manufacturing or infrastructure stocks.",
      audience: ["investors", "traders"],
    }),
  },
  {
    id: "india-gdp",
    months: [1, 4, 7, 10],
    day: (y, m) => lastWorkingDay(y, m),
    build: (y, m) => {
      const quarter = { 1: "Oct–Dec", 4: "Jan–Mar", 7: "Apr–Jun", 10: "Jul–Sep" }[m as 1 | 4 | 7 | 10];
      return {
        event: `India GDP growth for ${quarter} ${m === 1 ? y - 1 : y}`,
        time: "4:00 pm IST",
        kind: "economy",
        ...MOSPI,
        sentiment: "pending",
        note: "The headline measure of how fast the economy is growing; it shapes foreign investor flows and RBI policy.",
        forYou: "Strong growth usually means steadier jobs and incomes; weak growth can bring lower interest rates.",
        audience: ["savers", "borrowers", "investors", "traders"],
      };
    },
  },
  {
    id: "india-gst",
    day: () => 1,
    approx: () => true,
    build: (_y, m) => ({
      event: `GST collections for ${prevMonthName(m)}`,
      kind: "economy",
      source: "GST Council / Ministry of Finance",
      sourceUrl: "https://www.gst.gov.in/",
      sentiment: "pending",
      note: "A monthly proxy for spending across the economy. The release day has varied since 2024.",
      forYou: "A quick read on whether people and businesses are spending more. Rarely moves your own money directly.",
      audience: ["investors"],
    }),
  },
  {
    id: "india-pmi-manufacturing",
    day: (y, m) => nthWorkingDay(y, m, 1),
    build: (_y, m) => ({
      event: `HSBC India Manufacturing PMI for ${prevMonthName(m)}`,
      time: "10:30 am IST",
      kind: "economy",
      source: "S&P Global PMI release calendar",
      sourceUrl: "https://www.pmi.spglobal.com/Public/ReleaseCalendar",
      sentiment: "pending",
      note: "A survey of factory purchasing managers; above 50 means activity is expanding.",
      forYou: "An early, monthly signal of business conditions. Useful context if you follow the stock market.",
      audience: ["investors", "traders"],
    }),
  },
  {
    id: "india-pmi-services",
    day: (y, m) => nthWorkingDay(y, m, 3),
    build: (_y, m) => ({
      event: `HSBC India Services PMI for ${prevMonthName(m)}`,
      time: "10:30 am IST",
      kind: "economy",
      source: "S&P Global PMI release calendar",
      sourceUrl: "https://www.pmi.spglobal.com/Public/ReleaseCalendar",
      sentiment: "pending",
      note: "Services are over half of India's economy; this survey tracks whether they are growing.",
      forYou: "A monthly pulse on the part of the economy most jobs are in.",
      audience: ["investors", "traders"],
    }),
  },
  {
    id: "nifty-monthly-expiry",
    // NSE moved index derivatives expiry to Tuesday from September 2025
    day: (y, m) => lastWeekday(y, m, 2),
    build: () => ({
      event: "Nifty monthly F&O expiry",
      time: "Market close, 3:30 pm IST",
      kind: "expiry",
      source: "NSE",
      sourceUrl: "https://www.nseindia.com/",
      sentiment: "pending",
      note: "Monthly futures and options contracts settle, which can make the last hours of trading choppy.",
      forYou: "Only matters if you trade futures or options. Long-term investors can ignore it.",
      audience: ["traders"],
    }),
  },
];

/** Every rule's occurrences from `today` through the next `monthsAhead` months. */
export function recurringEvents(today: string, monthsAhead = 4): MarketEvent[] {
  const [ty, tm] = today.split("-").map(Number);
  const out: MarketEvent[] = [];
  for (let k = 0; k <= monthsAhead; k++) {
    const y = ty + Math.floor((tm - 1 + k) / 12);
    const m = (tm - 1 + k) % 12;
    for (const rule of rules) {
      if (rule.months && !rule.months.includes(m)) continue;
      const d = rule.day(y, m);
      const date = iso(y, m, d);
      if (date < today) continue;
      out.push({
        id: `${rule.id}-${date}`,
        nextDate: date,
        estimated: rule.approx?.(y, m, d) || undefined,
        ...rule.build(y, m),
      });
    }
  }
  return out;
}
