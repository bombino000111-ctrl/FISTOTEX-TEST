"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdFormat = "in-article" | "display";

interface AdUnitProps {
  /**
   * Which configured slot to render. "in-article" is the fluid unit that sits
   * between content sections; "display" is the responsive rectangle.
   */
  format?: AdFormat;
  /** Overrides the slot ID from siteConfig (rarely needed). */
  slot?: string;
  className?: string;
  /**
   * Reserved height in px before the ad paints. Reserving space is what keeps
   * ads from shifting the page and wrecking CLS, which Google measures as a
   * ranking signal — so this is never left to the ad's natural height.
   */
  minHeight?: number;
}

/**
 * One AdSense ad unit.
 *
 * Renders nothing at all when: AdSense is switched off, the slot ID has not
 * been created yet in the dashboard, or the current path is on the exclusion
 * list (see siteConfig.adsense.excludedPaths). That means dropping this
 * component onto a page is always safe — it is inert until a real slot exists.
 */
export function AdUnit({
  format = "display",
  slot,
  className,
  minHeight = 280,
}: AdUnitProps) {
  const pathname = usePathname();
  const insRef = useRef<HTMLModElement | null>(null);
  // AdSense must be told about each <ins> exactly once. React can mount a
  // component twice in development (StrictMode), so the push is guarded.
  const pushed = useRef(false);

  const { clientId, enabled, slots, excludedPaths } = siteConfig.adsense;
  const slotId = slot ?? (format === "in-article" ? slots.inArticle : slots.display);

  const excluded = excludedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const active = enabled && Boolean(clientId) && Boolean(slotId) && !excluded;

  useEffect(() => {
    if (!active || pushed.current) return;
    // The <ins> needs a non-zero width before AdSense will fill it; a hidden
    // parent (e.g. a collapsed tab) would otherwise burn the slot permanently.
    if (!insRef.current || insRef.current.offsetWidth === 0) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // A blocked or failed ad request must never break the page.
    }
  }, [active, pathname]);

  if (!active) return null;

  return (
    <aside
      // Ads are advertising, not editorial: labelling them is required to stay
      // clear of AdSense's rules on ads that could be mistaken for content.
      aria-label="Advertisement"
      className={className}
      style={{ minHeight }}
    >
      <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
        Advertisement
      </p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        {...(format === "in-article"
          ? { "data-ad-format": "fluid", "data-ad-layout": "in-article" }
          : { "data-ad-format": "auto", "data-full-width-responsive": "true" })}
      />
    </aside>
  );
}
