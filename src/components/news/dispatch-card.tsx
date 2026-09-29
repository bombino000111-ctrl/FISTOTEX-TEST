import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { publisherTint } from "@/lib/news/publishers";
import { formatRelativeTime, cn } from "@/lib/utils";

interface DispatchCardProps {
  article: NewsArticle;
  /** The front page's lead story: heavier rule, larger headline, full summary. */
  lead?: boolean;
  className?: string;
}

/**
 * A syndicated dispatch as a broadsheet prints it — no thumbnail, no
 * rewriting, publisher and filing time in the slug line, and the headline
 * itself linking straight to the original.
 */
export function DispatchCard({ article, lead = false, className }: DispatchCardProps) {
  return (
    <article
      style={{ "--tint": publisherTint(article.sourceId) } as CSSProperties}
      className={cn(
        "group relative isolate flex h-full flex-col justify-between transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-sm",
        lead ? "surface-lead p-6 sm:p-8" : "surface border-rule p-6",
        className
      )}
    >
      <div>
        {/* Slug line */}
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-border font-mono text-xs",
            lead ? "mb-4 pb-3" : "mb-3 pb-3"
          )}
        >
          <span className="tint-text inline-flex items-center gap-1.5 font-bold uppercase">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
            {article.source}
          </span>
          <span className="uppercase text-muted-foreground">
            {article.category && <>{article.category.replace(/-/g, " ")} · </>}
            <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
          </span>
        </div>

        <h3
          className={cn(
            "font-display font-bold leading-tight text-foreground transition-colors group-hover:text-[var(--tint-ink)]",
            lead ? "mb-4 max-w-4xl text-2xl sm:text-3xl lg:text-4xl" : "mb-3 text-xl leading-snug"
          )}
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none"
          >
            {article.title}
          </a>
        </h3>

        {article.summary && (
          <p
            className={cn(
              "leading-relaxed text-ink-2",
              lead ? "mb-6 max-w-4xl text-sm sm:text-base" : "mb-4 line-clamp-4 text-xs sm:text-sm"
            )}
          >
            {article.summary}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
        <span className="uppercase">Dispatch · syndicated, unedited</span>
        <span className="tint-text inline-flex items-center gap-1 font-bold group-hover:underline">
          {lead ? `Read original on ${article.source}` : article.source}
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  );
}
