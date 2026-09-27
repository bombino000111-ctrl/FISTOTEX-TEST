import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/seo";

/**
 * AI search and assistant crawlers are explicitly welcome: being readable by
 * them is what gets Fistotex cited in ChatGPT, Perplexity, Claude, Gemini and
 * Google AI Overviews. To opt out of one, change its rule to `disallow: "/"`.
 */
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Crawlers must be able to fetch /_next/ CSS & JS to render pages, so
      // only private endpoints are blocked.
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: aiCrawlers, allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
