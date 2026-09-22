"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function GA4() {
  const gaId = siteConfig.gaId;

  if (!gaId) return null;

  return (
    <>
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { send_page_view: false });
          `,
        }}
      />
      <Script
        id="ga4-lib"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
    </>
  );
}

/**
 * Sends a GA4 page_view on every client-side route change.
 *
 * Reads the query string from window instead of useSearchParams so pages
 * are not forced into dynamic rendering — keeps everything static and fast.
 */
export function GA4PageView() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const gaId = siteConfig.gaId;
    if (!gaId) return;

    const url = pathname + (window.location.search || "");
    if (lastPath.current === url) return;
    lastPath.current = url;

    // gtag may not be ready on first paint; retry briefly.
    let attempts = 0;
    const send = () => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_path: url,
          page_title: document.title,
          page_location: window.location.href,
        });
        return;
      }
      if (attempts++ < 20) setTimeout(send, 150);
    };
    send();
  }, [pathname]);

  return null;
}
