/* ────────────────────────────────────────────────────────────────
   Google Consent Mode v2 defaults.

   This must execute before gtag.js and before the AdSense loader, so it is
   emitted as a plain inline script at the very top of <head> — not via
   next/script, whose strategies all run later.

   Why the defaults are region-scoped: a blanket `denied` would switch off GA4
   and personalised ads for every visitor, including the Indian audience this
   site is built for, and nothing would ever grant them back. So consent is
   denied only where the law requires an opt-in, and Google's certified consent
   message (enabled in AdSense → Privacy & messaging) flips those to `granted`
   when an EEA/UK/CH visitor accepts. Everyone else is granted by default.
   ──────────────────────────────────────────────────────────────── */

/** EEA + UK + Switzerland: the region where ads need prior opt-in consent. */
const consentRequiredRegions = [
  // EU member states
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE",
  // Remaining EEA
  "IS", "LI", "NO",
  // UK and Switzerland
  "GB", "CH",
];

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
    region: ${JSON.stringify(consentRequiredRegions)},
    wait_for_update: 500
  });

  gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  });

  gtag('set', 'url_passthrough', true);
  gtag('set', 'ads_data_redaction', true);
})();
`.trim();
