import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  return {
    rules: [
      {
        // Crawlers must be able to fetch /_next/ CSS & JS to render pages, and
        // /sitemap.xml itself — so only private endpoints are blocked.
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Opt out of AI model-training crawlers. Remove an entry to allow it.
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
