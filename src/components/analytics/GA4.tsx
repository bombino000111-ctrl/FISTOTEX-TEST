"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { siteConfig } from "@/config/site";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function GA4() {
  const gaId = siteConfig.gaId;

  if (!gaId) {
    if (process.env.NODE_ENV === "development") {
      console.log("GA4: No Measurement ID configured. Set NEXT_PUBLIC_GA_ID to enable.");
    }
    return null;
  }

  return (
    <>
      {/* Google Tag Manager / GA4 Script - loads early */}
      <Script
        id="ga4-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              send_page_view: false
            });
          `,
        }}
      />
      {/* External GA4 script */}
      <Script
        id="ga4-external"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
    </>
  );
}

export function GA4PageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = siteConfig.gaId;

  useEffect(() => {
    if (!gaId || !window.gtag) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    
    window.gtag("event", "page_view", {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams, gaId]);

  return null;
}