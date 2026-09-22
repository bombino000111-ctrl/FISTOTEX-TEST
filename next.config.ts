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
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
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
    return [
      {
        source: "/finance-calculator/:path*",
        destination: "/toolkit/finance-calculator/:path*",
        permanent: true,
      },
      {
        source: "/calculator/:path*",
        destination: "/toolkit/finance-calculator/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
