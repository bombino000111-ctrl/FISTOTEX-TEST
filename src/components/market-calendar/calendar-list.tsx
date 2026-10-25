"use client";

import * as React from "react";
import type { Audience, MarketEvent } from "@/types/market-calendar";
import { EventRow } from "@/components/market-calendar/event-row";
import { cn } from "@/lib/utils";

/** "I am a…" — each reader sees the events that touch their money. */
const audiences: Array<{ id: Audience | "all"; label: string; hint: string }> = [
  { id: "all", label: "Everyone", hint: "Every scheduled event" },
  { id: "savers", label: "Saver", hint: "Events that move deposit rates, inflation and your budget" },
  { id: "borrowers", label: "Borrower", hint: "Events that move loan rates and EMIs" },
  { id: "investors", label: "Investor", hint: "Events that move mutual funds and shares over months" },
  { id: "traders", label: "Trader", hint: "Everything that can move prices this week, including expiries" },
];

const monthLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });

/**
 * `today` (IST, YYYY-MM-DD) comes from the server so the countdown in the
 * HTML and after hydration always agree. Past events are dropped.
 */
export function CalendarList({
  events,
  today,
  liveResults,
}: {
  events: MarketEvent[];
  today: string;
  /** False when NSE's results dates couldn't be fetched this time */
  liveResults: boolean;
}) {
  const [who, setWho] = React.useState<Audience | "all">("all");

  const upcoming = React.useMemo(
    () => events.filter((e) => e.nextDate >= today).sort((a, b) => a.nextDate.localeCompare(b.nextDate)),
    [events, today]
  );
  const visible = upcoming.filter((e) => who === "all" || e.audience.includes(who));

  // Group under month headings
  const months: Array<{ label: string; events: MarketEvent[] }> = [];
  for (const e of visible) {
    const label = monthLabel(e.nextDate);
    const last = months[months.length - 1];
    if (last?.label === label) last.events.push(e);
    else months.push({ label, events: [e] });
  }

  const active = audiences.find((a) => a.id === who)!;

  return (
    <div>
      <div className="sticky top-[68px] z-20 -mx-4 mb-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md">
        <div role="group" aria-label="Show events for" className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          <span className="mr-1 shrink-0 text-sm text-muted-foreground">I am a</span>
          {audiences.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setWho(a.id)}
              aria-pressed={who === a.id}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                who === a.id
                  ? "border-transparent bg-accent text-accent-foreground"
                  : "border-rule text-foreground hover:border-accent"
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-2 text-sm text-muted-foreground" aria-live="polite">
        {active.hint}: <span className="font-semibold text-foreground">{visible.length}</span> coming up.
      </p>
      {!liveResults && (
        <p className="mb-8 max-w-prose text-sm text-muted-foreground">
          Company results dates couldn&apos;t be loaded from NSE just now. See them on{" "}
          <a
            href="https://www.nseindia.com/companies-listing/corporate-filings-event-calendar"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            NSE&apos;s event calendar
          </a>
          .
        </p>
      )}

      {months.length > 0 ? (
        <div className="mt-8 max-w-4xl space-y-14">
          {months.map((month) => (
            <section key={month.label} aria-labelledby={`m-${month.label.replace(/\s/g, "-")}`}>
              <h2 id={`m-${month.label.replace(/\s/g, "-")}`} className="font-display mb-8 text-3xl text-foreground">
                {month.label}
              </h2>
              <ol className="[&>li:last-child_article]:border-transparent">
                {month.events.map((event) => (
                  <EventRow key={event.id} event={event} today={today} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <div className="surface mt-8 p-10 text-center">
          <p className="font-display text-2xl text-foreground">Nothing scheduled for this group yet</p>
          <p className="mt-2 text-muted-foreground">Try &ldquo;Everyone&rdquo;, or check back as new dates are confirmed.</p>
        </div>
      )}
    </div>
  );
}
