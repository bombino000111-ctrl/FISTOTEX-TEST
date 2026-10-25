import { ArrowUpRight } from "lucide-react";
import type { MarketEvent } from "@/types/market-calendar";
import { SentimentBadge } from "@/components/market-calendar/sentiment-badge";
import { daysBetween } from "@/lib/market-calendar/dates";

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
  const month = fmt(event.nextDate, { month: "short" });
  const year = event.nextDate.slice(0, 4);
  const days = daysBetween(today, event.nextDate);

  return (
    <li className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-5 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-x-8">
      <time dateTime={event.nextDate} className="pt-1 text-right">
        <span className="font-display tnum block text-4xl leading-none text-foreground sm:text-5xl">{day}</span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {month}
          {year !== today.slice(0, 4) && ` ${year}`}
        </span>
      </time>

      <article className="relative border-l border-rule pb-12 pl-6 sm:pl-8">
        <span aria-hidden="true" className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full border-2 border-background bg-foreground" />
        <p className="text-sm font-semibold text-accent">
          {event.estimated && "About "}
          {event.estimated ? formatCountdown(days).toLowerCase() : formatCountdown(days)}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="font-display text-2xl text-foreground">{event.event}</h3>
          <SentimentBadge sentiment={event.sentiment} />
          {event.estimated && (
            <span
              title="Date not yet officially confirmed"
              className="inline-flex shrink-0 items-center rounded-full border border-dashed border-rule px-2.5 py-0.5 text-sm text-muted-foreground"
            >
              Estimated date
            </span>
          )}
        </div>
        <p className="mt-2 max-w-prose leading-relaxed text-ink-2">{event.note}</p>
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent underline-offset-4 hover:underline"
        >
          Source: {event.source}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </article>
    </li>
  );
}
