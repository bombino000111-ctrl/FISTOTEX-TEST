import type { CSSProperties } from "react";
import { Radio } from "lucide-react";
import type { NewsArticle } from "@/types/news";

/** Scrolling strip of live headlines. Pauses on hover/focus; static when motion is reduced. */
export function HeadlineTicker({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;
  const items = articles.slice(0, 12);

  return (
    <div className="relative border-y border-border bg-card">
      <div className="flex items-stretch">
        <div className="relative z-10 flex shrink-0 items-center gap-2 bg-panel px-4 text-xs font-bold uppercase tracking-wider text-white">
          <span className="relative flex h-2 w-2">
            
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3FB68B]" />
          </span>
          <Radio className="hidden h-3.5 w-3.5 sm:block" />
          Live
        </div>
        <div className="group relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
          <div
            className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
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
                      className="flex items-center gap-2 whitespace-nowrap px-5 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wide text-accent">{a.source}</span>
                      {a.title}
                    </a>
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-border" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
