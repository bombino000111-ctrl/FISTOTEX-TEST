"use client";

import * as React from "react";
import Link from "next/link";
import { CONSENT_EVENT, CONSENT_OPEN_EVENT, CONSENT_STORAGE_KEY } from "@/components/ads/consent";

export type ConsentChoice = "granted" | "denied" | null;

function readChoice(): ConsentChoice {
  try {
    const v = localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    // Storage blocked (private mode, strict settings): treat as undecided
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The visitor's saved choice. "unset" on the server, so nothing consent-gated renders in static HTML. */
export function useConsent(): ConsentChoice | "unset" {
  return React.useSyncExternalStore(subscribe, readChoice, () => "unset");
}

export function saveConsent(choice: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Not persisted; the choice still applies for this page view
  }
  window.gtag?.("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Opens the banner again — used by the footer's "Manage cookies" link. */
export function openConsentBanner() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/**
 * A quiet card in the corner, not a wall. Calculators work the same either way;
 * the choice only decides whether Google Analytics loads and whether ads may
 * be personalised.
 */
export function ConsentBanner() {
  const choice = useConsent();
  const [reopened, setReopened] = React.useState(false);

  React.useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  if (choice === "unset" || (choice !== null && !reopened)) return null;

  const decide = (c: "granted" | "denied") => {
    saveConsent(c);
    setReopened(false);
  };

  return (
    <section
      role="region"
      aria-label="Cookie choices"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-md border border-border bg-card p-5 shadow-lg sm:left-auto sm:right-6 sm:mx-0"
    >
      <p className="font-display text-lg font-semibold text-foreground">Your numbers stay with you</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">
        Every calculation runs in your browser and is never sent to us. To keep Fistotex free we
        show ads, and we&apos;d like to use Google Analytics to see which tools help. May we use
        cookies for analytics and personalised ads?{" "}
        <Link href="/privacy-policy" className="font-medium text-accent underline-offset-2 hover:underline">
          Details
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => decide("granted")} className="btn-brand min-h-10 px-4 text-sm">
          Allow
        </button>
        <button type="button" onClick={() => decide("denied")} className="btn-ghost min-h-10 px-4 text-sm">
          No thanks
        </button>
      </div>
    </section>
  );
}

/** Footer control for changing the cookie choice at any time. */
export function ManageCookiesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentBanner} className={className}>
      Manage cookies
    </button>
  );
}
