import { ArrowUpRight } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { formatRelativeTime } from "@/lib/utils";

interface NewsCardProps {
  article: NewsArticle;
  /** Compact variant used in the home page strip */
  compact?: boolean;
}

export function NewsCard({ article, compact = false }: NewsCardProps) {
  return (
    <article className="surface surface-link group flex h-full flex-col overflow-hidden">
      {article.imageUrl && !compact && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
            {article.source}
          </span>
          {article.category && (
            <span className="text-xs capitalize text-muted-foreground">
              {article.category.replace(/-/g, " ")}
            </span>
          )}
        </div>

        <h3 className="font-semibold leading-snug text-foreground transition-colors group-hover:text-foreground/80">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="after:absolute after:inset-0"
          >
            {article.title}
          </a>
        </h3>

        {article.summary && (
          <p className={`flex-1 text-sm leading-relaxed text-muted-foreground ${compact ? "line-clamp-3" : "line-clamp-3"}`}>
            {article.summary}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <time dateTime={article.publishedAt} className="text-xs text-muted-foreground">
            {formatRelativeTime(article.publishedAt)}
          </time>
          <span className="relative z-10 inline-flex items-center gap-1 text-xs font-medium text-foreground">
            Read at source
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
