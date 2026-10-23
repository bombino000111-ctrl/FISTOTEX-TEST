import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CalendarDays, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/layout/section";
import { pageMetadata } from "@/lib/seo";
import {
  allEvents,
  daysUntil,
  CALENDAR_SOURCES,
  CALENDAR_REVIEWED_ON,
  type EventKind,
  type MarketEvent,
} from "@/lib/toolkit/market-calendar";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Market Calendar - RBI Policy, F&O Expiry, Budget & Event Dates",
  description:
    "Every date that moves the Indian stock market: RBI MPC decisions, F&O expiry days, Union Budget, CPI and GDP releases, Fed meetings, results seasons and trading holidays - with high-volatility days flagged.",
  path: "/toolkit/market-calendar",
});

const KIND_LABEL: Record<EventKind, string> = {
  rbi: "RBI policy",
  "global-central-bank": "US Fed",
  expiry: "F&O expiry",
  budget: "Budget",
  "macro-data": "Macro data",
  "results-season": "Results season",
  holiday: "Holiday",
  "special-session": "Special session",
};

function eventDateLabel(e: MarketEvent): string {
  if (e.span) return e.span;
  return new Date(e.date + "T00:00:00Z").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function weekday(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", {
    weekday: "short",
    timeZone: "UTC",
  });
}

function monthKey(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function MarketCalendarPage() {
  const now = new Date();
  const events = allEvents(now);
  const byMonth = new Map<string, MarketEvent[]>();
  for (const e of events) {
    const k = monthKey(e.date);
    byMonth.set(k, [...(byMonth.get(k) ?? []), e]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Toolkit / Market Calendar"
        title="The dates that move the market"
        description="RBI policy decisions, F&O expiry days, the Union Budget, inflation and GDP prints, Fed meetings, results seasons and trading holidays. Days marked volatile are when indices historically swing the most - size your positions accordingly."
      />

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-10 flex flex-wrap items-center gap-3 rounded-sm border border-rule bg-card px-4 py-3 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
          <span>
            Dates verified against official sources on {CALENDAR_REVIEWED_ON} and re-checked monthly.
            F&O expiry dates are computed from the exchange&rsquo;s Tuesday convention and rolled back over holidays.
          </span>
        </div>

        <div className="space-y-12">
          {[...byMonth.entries()].map(([month, list]) => (
            <div key={month}>
              <h2 className="eyebrow mb-5">{month}</h2>
              <ul className="divide-y divide-rule overflow-hidden rounded-sm border border-rule bg-card">
                {list.map((e) => {
                  const du = daysUntil(e.date, now);
                  return (
                    <li
                      key={`${e.date}-${e.title}`}
                      className={cn(
                        "flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:gap-6",
                        e.volatile && "bg-accent-soft/40"
                      )}
                    >
                      <div className="w-28 shrink-0">
                        <div className="font-mono text-sm font-bold text-foreground">
                          {eventDateLabel(e)}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {e.span ? `decides ${weekday(e.date)}` : weekday(e.date)}
                          {du >= 0 && du <= 7 && (
                            <span className="text-accent"> &middot; {du === 0 ? "today" : `in ${du}d`}</span>
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-foreground">{e.title}</span>
                          <span className="rounded-sm border border-rule px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                            {KIND_LABEL[e.kind]}
                          </span>
                          {e.volatile && (
                            <span className="inline-flex items-center gap-1 rounded-sm bg-accent px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                              Volatile
                            </span>
                          )}
                        </div>
                        {e.note && <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-sm border border-rule bg-muted/50 px-4 py-5 text-sm text-muted-foreground">
          <p className="mb-2 font-semibold text-foreground">Official sources</p>
          <ul className="space-y-1">
            {CALENDAR_SOURCES.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  {s.label}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Track company numbers on the{" "}
            <Link href="/toolkit/results" className="text-accent hover:underline">
              results tracker
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
