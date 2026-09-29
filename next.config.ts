import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.livemint.com" },
      { protocol: "https", hostname: "images.livemint.com" },
      { protocol: "https", hostname: "www.moneycontrol.com" },
      { protocol: "https", hostname: "images.moneycontrol.com" },
      { protocol: "https", hostname: "img.moneycontrol.com" },
      { protocol: "https", hostname: "economictimes.indiatimes.com" },
      { protocol: "https", hostname: "img.etimg.com" },
      { protocol: "https", hostname: "www.business-standard.com" },
      { protocol: "https", hostname: "bsmedia.business-standard.com" },
      { protocol: "https", hostname: "www.thehindubusinessline.com" },
      { protocol: "https", hostname: "www.thehindu.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
      { protocol: "https", hostname: "*.amazonaws.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  compress: true,

  async headers() {
    const longCache = "public, max-age=3600, s-maxage=86400";
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // Tells browsers to reach this domain over HTTPS only, so the
          // http:// -> https:// redirect never has to run a second time.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/sitemap.xml", headers: [{ key: "Cache-Control", value: longCache }] },
      { source: "/robots.txt", headers: [{ key: "Cache-Control", value: longCache }] },
      { source: "/manifest.webmanifest", headers: [{ key: "Cache-Control", value: longCache }] },
    ];
  },

  async redirects() {
    /*
      Every rule below lands on its FINAL destination in one hop. Chaining
      (/calculator -> /toolkit/finance-calculator -> /calculators) would leak
      link equity at each step and slow every crawl, so the two pre-existing
      legacy prefixes were retargeted straight at /calculators rather than left
      pointing at the retired /toolkit path.

      Specific /:id rules come BEFORE the bare-path rules, or a bare rule would
      swallow them.
    */
    return [
      // 2026-09 restructure: the calculators moved up from /toolkit/finance-calculator.
      {
        source: "/toolkit/finance-calculator/:id",
        destination: "/calculators/:id",
        permanent: true,
      },
      { source: "/toolkit/finance-calculator", destination: "/calculators", permanent: true },
      // /toolkit only duplicated the calculator index, so it folds into the hub.
      { source: "/toolkit", destination: "/calculators", permanent: true },

      // Legacy prefixes that predate the restructure.
      {
        source: "/finance-calculator/:id",
        destination: "/calculators/:id",
        permanent: true,
      },
      { source: "/finance-calculator", destination: "/calculators", permanent: true },
      {
        source: "/calculator/:id",
        destination: "/calculators/:id",
        permanent: true,
      },
      { source: "/calculator", destination: "/calculators", permanent: true },
    ];
  },
};

export default nextConfig;
