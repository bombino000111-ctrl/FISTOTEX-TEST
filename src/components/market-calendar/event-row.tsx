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

export function EventRow({ event, today }: { event: MarketEvent; today: string }) {
  const day = fmt(event.nextDate, { day: "2-digit" });
  const month = fmt(event.nextDate, { month: "short" }).toUpperCase();
  const year = event.nextDate.slice(0, 4);
  const days = daysBetween(today, event.nextDate);

  return (
    <article className="surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
      <time
        dateTime={event.nextDate}
        className="flex shrink-0 flex-col items-center justify-center rounded-sm border border-border bg-muted px-4 py-2 font-mono sm:w-20"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{month}</span>
        <span className="text-2xl font-bold leading-tight text-foreground">{day}</span>
        {year !== today.slice(0, 4) && <span className="text-[10px] text-muted-foreground">{year}</span>}
      </time>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-base text-foreground sm:text-lg">{event.event}</h3>
          <SentimentBadge sentiment={event.sentiment} />
          {event.estimated && (
            <span
              title="Date not yet officially confirmed"
              className="inline-flex shrink-0 items-center rounded-full border border-dashed border-rule px-2.5 py-1 text-xs font-semibold text-muted-foreground"
            >
              Estimated date
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{event.note}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="font-mono font-semibold text-foreground">
            {event.estimated && "~"}
            {formatCountdown(days)}
          </span>
          <span aria-hidden="true" className="text-border">·</span>
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
          >
            {event.source}
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
