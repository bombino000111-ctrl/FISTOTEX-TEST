"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { useConsent } from "@/components/ads/consent-banner";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/** Loads gtag.js only after the visitor allows analytics in the consent banner. */
export function GA4() {
  const gaId = siteConfig.gaId;
  const consent = useConsent();

  if (!gaId || consent !== "granted") return null;

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
            gtag('config', '${gaId}', {
              send_page_view: false,
              page_location: location.origin + location.pathname
            });
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
 * Sends a GA4 page_view on every client-side route change, once analytics
 * consent is given.
 *
 * Only the path is reported — never the query string or hash — so values a
 * visitor types into a calculator can't reach Google through the page URL.
 */
export function GA4PageView() {
  const pathname = usePathname();
  const consent = useConsent();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const gaId = siteConfig.gaId;
    if (!gaId || consent !== "granted") return;

    const url = pathname;
    if (lastPath.current === url) return;
    lastPath.current = url;

    // gtag may not be ready on first paint; retry briefly.
    let attempts = 0;
    const send = () => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_path: url,
          page_title: document.title,
          page_location: window.location.origin + pathname,
        });
        return;
      }
      if (attempts++ < 20) setTimeout(send, 150);
    };
    send();
  }, [pathname, consent]);

  return null;
}
