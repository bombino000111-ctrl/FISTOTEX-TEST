/* ────────────────────────────────────────────────────────────────
   Google Consent Mode v2 defaults.

   This must execute before gtag.js and before the AdSense loader, so it is
   emitted as a plain inline script at the very top of <head> — not via
   next/script, whose strategies all run later.

   Everything starts denied, for every visitor. AdSense then serves
   non-personalised, cookieless ads, and GA4 is not loaded at all (see GA4.tsx)
   until the visitor says yes in the consent banner. A choice saved on an
   earlier visit is replayed here so returning visitors aren't asked again.
   DPDP Act 2023 expects consent to be a clear opt-in, which is why India is
   no longer treated as granted-by-default.
   ──────────────────────────────────────────────────────────────── */

/** localStorage key holding "granted" or "denied". */
export const CONSENT_STORAGE_KEY = "fx-consent";
/** Window event fired whenever the visitor changes their choice. */
export const CONSENT_EVENT = "fx-consent-change";
/** Window event that reopens the banner (the footer's "Manage cookies" link). */
export const CONSENT_OPEN_EVENT = "fx-consent-open";

export const consentInitScript = `
(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  try {
    if (localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'granted') {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted'
      });
    }
  } catch (e) {}

  gtag('set', 'ads_data_redaction', true);
})();
`.trim();
