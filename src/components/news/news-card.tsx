import type * as React from "react";
import Link from "next/link";
import { calculatorsForTopic } from "@/lib/news/topics";
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
  const tools = calculatorsForTopic(article.category);

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

      {tools.length > 0 && (
        // Sits above the headline's full-card link so both stay clickable
        <p className="relative z-20 mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Work out what it means for you:</span>
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/calculators/${tool.id}`}
              className="inline-flex min-h-8 items-center rounded-full border border-rule px-3 font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              {tool.label}
            </Link>
          ))}
        </p>
      )}
    </article>
  );
}
