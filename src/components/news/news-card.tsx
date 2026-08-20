import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NewsArticle } from "@/types/news";
import { formatRelativeTime } from "@/lib/utils";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="group relative flex flex-col h-full rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col gap-3 flex-1">
        {/* Source & Category */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
            {article.source}
          </span>
          {article.category && (
            <span className="text-xs text-muted-foreground capitalize">
              {article.category.replace(/-/g, " ")}
            </span>
          )}
        </div>

        {/* Headline */}
        <h3 className="font-semibold text-primary line-clamp-2 group-hover:text-primary/80 transition-colors">
          {article.title}
        </h3>

        {/* Summary */}
        {article.summary && (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {article.summary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-2 mt-auto">
          <time className="text-xs text-muted-foreground">
            {formatRelativeTime(article.publishedAt)}
          </time>
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Read More
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
