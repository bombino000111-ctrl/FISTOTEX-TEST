import { ArrowUpRight, Newspaper } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { formatRelativeTime, cn } from "@/lib/utils";

/** Tint per news category so the grid scans at a glance. */
const categoryTint: Record<string, string> = {
  markets: "#10B981",
  stocks: "#06B6D4",
  "mutual-funds": "#8B5CF6",
  "personal-finance": "#F59E0B",
  banking: "#3B82F6",
  economy: "#EF4444",
  business: "#64748B",
  ipo: "#EC4899",
  tax: "#F97316",
  insurance: "#14B8A6",
  cryptocurrency: "#A855F7",
  "global-markets": "#6366F1",
};

interface NewsCardProps {
  article: NewsArticle;
  /** Large lead-story variant */
  featured?: boolean;
  className?: string;
}

export function NewsCard({ article, featured = false, className }: NewsCardProps) {
  const tint = categoryTint[article.category ?? ""] ?? "#10B981";

  return (
    // `relative` scopes the stretched link below to this card only.
    <article
      className={cn(
        "surface surface-link group relative isolate flex h-full flex-col overflow-hidden focus-within:ring-2 focus-within:ring-ring",
        featured && "md:flex-row",
        className
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/9] w-full shrink-0 overflow-hidden",
          featured && "md:aspect-auto md:w-1/2"
        )}
        style={{ background: `${tint}1f` }}
      >
        {article.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Newspaper className="h-10 w-10 opacity-40" style={{ color: tint }} />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center rounded bg-black/75 px-2 py-0.5 text-[11px] font-semibold text-white">
          {article.source}
        </span>
      </div>

      <div className={cn("flex flex-1 flex-col gap-3 p-5", featured && "md:p-7")}>
        {article.category && (
          <span
            className="inline-flex w-fit items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: tint }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: tint }} />
            {article.category.replace(/-/g, " ")}
          </span>
        )}

        <h3
          className={cn(
            "font-display leading-snug text-foreground decoration-1 underline-offset-4 group-hover:underline",
            featured ? "text-xl md:text-2xl" : "text-base"
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
              "flex-1 text-sm leading-relaxed text-muted-foreground",
              featured ? "line-clamp-4" : "line-clamp-3"
            )}
          >
            {article.summary}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <time dateTime={article.publishedAt} className="text-xs text-muted-foreground">
            {formatRelativeTime(article.publishedAt)}
          </time>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
            Read story
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
