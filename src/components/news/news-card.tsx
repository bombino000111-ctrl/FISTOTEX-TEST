import type * as React from "react";
import type { NewsArticle } from "@/types/news";
import { publisherTint } from "@/lib/news/publishers";
import { formatRelativeTime, cn } from "@/lib/utils";

interface NewsCardProps {
  article: NewsArticle;
  /** The first story on an unfiltered page: a larger headline and the full summary */
  featured?: boolean;
  className?: string;
}

const topic = (c?: string) => (c ? c.replace(/-/g, " ").replace(/^\w/, (m) => m.toUpperCase()) : null);

/**
 * One headline in the reading list. No thumbnail: the publisher, the time and
 * the headline itself are what a reader scans for, and hotlinked images were
 * slow and not ours to show.
 */
export function NewsCard({ article, featured = false, className }: NewsCardProps) {
  const t = topic(article.category);

  return (
    <article
      style={{ "--tint": publisherTint(article.sourceId) } as React.CSSProperties}
      className={cn("group relative isolate", featured ? "py-10" : "py-7", className)}
    >
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--tint-ink)]" />
          {article.source}
        </span>
        <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
        {t && <span>{t}</span>}
      </p>

      <h3
        className={cn(
          "font-display mt-3 text-foreground decoration-1 underline-offset-[6px] group-hover:underline",
          featured ? "text-3xl leading-tight sm:text-4xl" : "text-2xl leading-snug"
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
            featured ? "text-lg" : "line-clamp-2"
          )}
        >
          {article.summary}
        </p>
      )}
    </article>
  );
}
