"use client";

import * as React from "react";
import type { MarketEvent, MarketSentiment } from "@/types/market-calendar";
import { EventRow } from "@/components/market-calendar/event-row";
import { sentimentMeta, type TaggedSentiment } from "@/components/market-calendar/sentiment-badge";
import { cn } from "@/lib/utils";

const sentiments: TaggedSentiment[] = ["positive", "negative"];

/**
 * `today` (IST, YYYY-MM-DD) comes from the server so the countdown in the
 * HTML and after hydration always agree. Past events are dropped.
 */
export function CalendarList({ events, today }: { events: MarketEvent[]; today: string }) {
  const [filter, setFilter] = React.useState<MarketSentiment | "all">("all");

  const upcoming = React.useMemo(
    () => events.filter((e) => e.nextDate >= today).sort((a, b) => a.nextDate.localeCompare(b.nextDate)),
    [events, today]
  );
  const visible = upcoming.filter((e) => filter === "all" || e.sentiment === filter);

  // Hide chips with no events rather than offering a dead end
  const counts = sentiments
    .map((id) => ({ id, label: sentimentMeta[id].label, count: upcoming.filter((e) => e.sentiment === id).length }))
    .filter((c) => c.count > 0);
  const filters = [{ id: "all" as const, label: "All events", count: upcoming.length }, ...counts];

  return (
    <div>
      {filters.length > 1 && (
        <div className="no-scrollbar sticky top-[68px] z-20 -mx-4 mb-10 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md">
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "border-transparent bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                )}
              >
                {f.label}
                <span className="ml-1.5 opacity-60">{f.count}</span>
              </button>
            );
          })}
        </div>
      )}

      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-semibold text-foreground">{visible.length}</span> of{" "}
        {upcoming.length} upcoming events
      </p>

      {visible.length > 0 ? (
        <ol className="max-w-4xl [&>li:last-child_article]:border-transparent">
          {visible.map((event) => (
            <EventRow key={event.id} event={event} today={today} />
          ))}
        </ol>
      ) : (
        <div className="surface p-10 text-center">
          <p className="font-display text-2xl text-foreground">No events scheduled yet</p>
          <p className="mt-2 text-muted-foreground">New dates are added as each authority confirms them.</p>
        </div>
      )}
    </div>
  );
}
