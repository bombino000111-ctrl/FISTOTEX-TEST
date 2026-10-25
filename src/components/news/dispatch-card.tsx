import type { CSSProperties } from "react";
import type { NewsArticle } from "@/types/news";
import { publisherTint } from "@/lib/news/publishers";
import { formatRelativeTime, cn } from "@/lib/utils";

interface DispatchCardProps {
  article: NewsArticle;
  /** The homepage's lead story: larger headline and the full summary */
  lead?: boolean;
  className?: string;
}

/**
 * A headline on the homepage, credited to its publisher and linking straight
 * to the original. Same voice as the news page's reading list, set on a card.
 */
export function DispatchCard({ article, lead = false, className }: DispatchCardProps) {
  return (
    <article
      style={{ "--tint": publisherTint(article.sourceId) } as CSSProperties}
      className={cn(
        "surface surface-link group relative isolate flex h-full flex-col focus-within:ring-2 focus-within:ring-ring",
        lead ? "p-7 sm:p-10" : "p-6 sm:p-7",
        className
      )}
    >
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--tint-ink)]" />
          {article.source}
        </span>
        <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
      </p>

      <h3
        className={cn(
          "font-display mt-4 text-foreground decoration-1 underline-offset-[6px] group-hover:underline",
          lead ? "max-w-4xl text-3xl leading-tight sm:text-4xl" : "text-2xl leading-snug"
        )}
      >
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none"
        >
          {article.title}
          <span className="sr-only"> (opens {article.source} in a new tab)</span>
        </a>
      </h3>

      {article.summary && (
        <p
          className={cn(
            "mt-3 max-w-prose leading-relaxed text-ink-2",
            lead ? "text-lg" : "line-clamp-3"
          )}
        >
          {article.summary}
        </p>
      )}
    </article>
  );
}
