import type { CSSProperties } from "react";
import type { NewsArticle } from "@/types/news";
import { publisherSlug, publisherTint } from "@/lib/news/publishers";
import { formatRelativeTime } from "@/lib/utils";

/**
 * Wire dispatch: the scrolling strip of live headlines under the masthead.
 * Pauses on hover/focus and with the Pause control (a styled checkbox, so it
 * works without client JS and on touch screens — WCAG 2.2.2). The marquee is
 * disabled entirely when the reader has asked for reduced motion (see globals.css).
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
          <span aria-hidden="true" className="inline-flex h-2 w-2 rounded-full bg-accent" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">
            Wire <span className="hidden sm:inline">Dispatch</span>
          </span>
        </div>

        <div className="group relative flex-1 overflow-hidden pl-4 [mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]">
          <div
            className="flex w-max animate-marquee group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] [section:has(#ticker-pause:checked)_&]:[animation-play-state:paused]"
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

        <label className="ml-2 flex min-h-10 shrink-0 cursor-pointer items-center border-l border-rule pl-3 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring">
          <input id="ticker-pause" type="checkbox" className="peer sr-only" />
          <span className="peer-checked:hidden">Pause</span>
          <span className="hidden peer-checked:inline">Play</span>
        </label>
      </div>
    </section>
  );
}
