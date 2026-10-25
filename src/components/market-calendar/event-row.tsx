"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarPlus } from "lucide-react";
import type { MarketEvent } from "@/types/market-calendar";
import { SentimentBadge } from "@/components/market-calendar/sentiment-badge";
import { daysBetween } from "@/lib/market-calendar/dates";
import { downloadIcs } from "@/lib/market-calendar/ics";

// Event dates are calendar days, so format them in UTC: parsing "2026-11-12"
// gives UTC midnight, and a local-time format would shift it a day west of UTC.
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { ...opts, timeZone: "UTC" });

function formatCountdown(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

/**
 * One stop on the timeline: the date set large in the left gutter, the event
 * beside it, and the rule running down to the next event.
 */
export function EventRow({ event, today }: { event: MarketEvent; today: string }) {
  const day = fmt(event.nextDate, { day: "numeric" });
  const weekday = fmt(event.nextDate, { weekday: "short" });
  const days = daysBetween(today, event.nextDate);
  const countdown = formatCountdown(days);

  return (
    <li className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-5 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-x-8">
      <time dateTime={event.nextDate} className="pt-1 text-right">
        <span className="font-display tnum block text-4xl leading-none text-foreground sm:text-5xl">{day}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{weekday}</span>
      </time>

      <article className="relative border-l border-rule pb-12 pl-6 sm:pl-8">
        <span aria-hidden="true" className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent" />
        <p className="text-sm font-semibold text-accent">
          {event.estimated ? `About ${countdown.toLowerCase()}` : countdown}
          {event.time && <span className="font-normal text-muted-foreground">, {event.time}</span>}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="font-display text-2xl text-foreground">{event.event}</h3>
          <SentimentBadge sentiment={event.sentiment} />
          {event.estimated && (
            <span
              title="Date not yet officially confirmed"
              className="inline-flex shrink-0 items-center rounded-full border border-dashed border-rule px-2.5 py-0.5 text-sm text-muted-foreground"
            >
              Date may change
            </span>
          )}
        </div>

        {event.companies && event.companies.length > 3 && (
          <p className="mt-2 max-w-prose text-ink-2">{event.companies.join(", ")}</p>
        )}

        <p className="mt-3 max-w-prose leading-relaxed text-foreground">
          <span className="font-semibold">What it means for you: </span>
          {event.forYou}
        </p>
        <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted-foreground">{event.note}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <button
            type="button"
            onClick={() => downloadIcs(event)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-rule px-3.5 font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Add to calendar
          </button>
          {event.calculator && (
            <Link
              href={`/calculators/${event.calculator.id}`}
              className="font-semibold text-accent underline-offset-4 hover:underline"
            >
              Open the {event.calculator.label}
            </Link>
          )}
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Source: {event.source}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </article>
    </li>
  );
}
