import type { CSSProperties } from "react";
import type { NewsArticle } from "@/types/news";
import { publisherSlug, publisherTint } from "@/lib/news/publishers";
import { formatRelativeTime } from "@/lib/utils";

/**
 * Wire dispatch: the scrolling strip of live headlines under the masthead.
 * Pauses on hover/focus; the marquee animation is disabled entirely when the
 * reader has asked for reduced motion (see globals.css).
 */
export function HeadlineTicker({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;
  const items = articles.slice(0, 12);

  return (
    <section
      id="market-wire"
      aria-label="Live market wire"
      className="scroll-mt-28 border-y-2 border-rule bg-muted"
    >
      <div className="container mx-auto flex items-center px-4">
        {/* Live indicator */}
        <div className="z-10 flex shrink-0 items-center gap-2 border-r border-rule bg-muted py-2.5 pr-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
            Wire <span className="hidden sm:inline">Dispatch</span>
          </span>
        </div>

        <div className="group relative flex-1 overflow-hidden pl-4 [mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]">
          <div
            className="flex w-max animate-marquee group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]"
            style={{ "--marquee-duration": `${items.length * 7}s` } as CSSProperties}
          >
            {/* Two copies make the loop seamless; the second is hidden from assistive tech */}
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1 ? true : undefined}>
                {items.map((a) => (
                  <li key={`${copy}-${a.id}`} className="flex items-center">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      tabIndex={copy === 1 ? -1 : undefined}
                      style={{ "--tint": publisherTint(a.sourceId) } as CSSProperties}
                      className="group/item flex items-center gap-2 whitespace-nowrap py-2.5 pr-8 text-xs"
                    >
                      <span className="stamp">{publisherSlug(a.sourceId, a.source)}</span>
                      <span className="font-medium text-foreground transition-colors group-hover/item:text-accent">
                        {a.title}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        · {formatRelativeTime(a.publishedAt)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
