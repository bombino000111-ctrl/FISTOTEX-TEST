"use client";

import React from "react";

export function GA4Provider({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}

// Analytics event tracking utilities
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export type GA4EventParams = {
  [key: string]: string | number | boolean | undefined;
};

export function trackEvent(eventName: string, params?: GA4EventParams) {
  if (typeof window === "undefined" || !window.gtag) {
    if (process.env.NODE_ENV === "development") {
      console.log(`GA4 Event (dev): ${eventName}`, params);
    }
    return;
  }

  window.gtag("event", eventName, params);
}

// Predefined event tracking functions
export const analytics = {
  // Calculator events
  calculatorView: (calculatorId: string, calculatorName: string) =>
    trackEvent("calculator_view", {
      calculator_id: calculatorId,
      calculator_name: calculatorName,
    }),

  calculatorCalculate: (calculatorId: string, calculatorName: string, inputs: Record<string, number>) =>
    trackEvent("calculator_calculate", {
      calculator_id: calculatorId,
      calculator_name: calculatorName,
      ...inputs,
    }),

  calculatorShare: (calculatorId: string, method: "copy" | "twitter" | "facebook" | "linkedin") =>
    trackEvent("calculator_share", {
      calculator_id: calculatorId,
      share_method: method,
    }),

  // News events
  newsView: (articleId: string, title: string, source: string, category: string) =>
    trackEvent("news_view", {
      article_id: articleId,
      article_title: title,
      source,
      category,
    }),

  newsClick: (articleId: string, title: string, source: string, externalUrl: string) =>
    trackEvent("news_click", {
      article_id: articleId,
      article_title: title,
      source,
      external_url: externalUrl,
    }),

  newsSearch: (query: string, resultsCount: number) =>
    trackEvent("news_search", {
      search_term: query,
      results_count: resultsCount,
    }),

  newsCategoryFilter: (category: string) =>
    trackEvent("news_category_filter", {
      category,
    }),

  // Navigation events
  navClick: (linkText: string, linkUrl: string, location: "header" | "footer" | "mobile_menu" | "cta") =>
    trackEvent("nav_click", {
      link_text: linkText,
      link_url: linkUrl,
      location,
    }),

  // CTA events
  ctaClick: (ctaText: string, ctaUrl: string, page: string) =>
    trackEvent("cta_click", {
      cta_text: ctaText,
      cta_url: ctaUrl,
      page,
    }),

  // Form events
  formStart: (formName: string) =>
    trackEvent("form_start", {
      form_name: formName,
    }),

  formSubmit: (formName: string, success: boolean) =>
    trackEvent("form_submit", {
      form_name: formName,
      success,
    }),

  // Search events
  siteSearch: (query: string, resultsCount: number) =>
    trackEvent("site_search", {
      search_term: query,
      results_count: resultsCount,
    }),

  // Error events
  error: (errorMessage: string, errorLocation: string, fatal: boolean = false) =>
    trackEvent("exception", {
      description: errorMessage,
      fatal,
      location: errorLocation,
    }),

  // Engagement events
  scrollDepth: (depth: 25 | 50 | 75 | 100) =>
    trackEvent("scroll", {
      percent_scrolled: depth,
    }),

  timeOnPage: (seconds: number, page: string) =>
    trackEvent("time_on_page", {
      engagement_time_msec: seconds * 1000,
      page,
    }),

  // File download
  fileDownload: (fileName: string, fileUrl: string, fileType: string) =>
    trackEvent("file_download", {
      file_name: fileName,
      file_url: fileUrl,
      file_type: fileType,
    }),

  // External link click
  externalLinkClick: (url: string, linkText: string) =>
    trackEvent("external_link_click", {
      external_url: url,
      link_text: linkText,
    }),
};

// Hook for tracking page views manually (if needed)
export function usePageViewTracking() {
  // This hook needs usePathname and useSearchParams from next/navigation
  // Import them where this hook is used
}