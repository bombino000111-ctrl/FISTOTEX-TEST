import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      // News source images
      {
        protocol: "https",
        hostname: "www.livemint.com",
      },
      {
        protocol: "https",
        hostname: "images.livemint.com",
      },
      {
        protocol: "https",
        hostname: "www.moneycontrol.com",
      },
      {
        protocol: "https",
        hostname: "images.moneycontrol.com",
      },
      {
        protocol: "https",
        hostname: "img.moneycontrol.com",
      },
      {
        protocol: "https",
        hostname: "economictimes.indiatimes.com",
      },
      {
        protocol: "https",
        hostname: "img.etimg.com",
      },
      // Generic CDN patterns
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Redirect old FinanceHub paths if any
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

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Output configuration for Vercel
  output: "standalone",
};

export default nextConfig;
