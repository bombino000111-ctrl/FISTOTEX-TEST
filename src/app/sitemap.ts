import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { baseUrl } from "@/lib/seo";
import { calculatorIds } from "@/lib/calculators/registry";

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  // lastmod must reflect real content changes, not build time, or search
  // engines learn to ignore it. News is the only page that changes daily.
  const reviewed = new Date(siteConfig.contentReviewed);
  const legalUpdated = new Date("2026-09-26");

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/toolkit/finance-calculator`, lastModified: reviewed, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/toolkit`, lastModified: reviewed, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: reviewed, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: reviewed, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: legalUpdated, changeFrequency: "yearly", priority: 0.3 },
  ];

  const calculatorUrls: MetadataRoute.Sitemap = calculatorIds.map((id) => ({
    url: `${baseUrl}/toolkit/finance-calculator/${id}`,
    lastModified: reviewed,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticPages, ...calculatorUrls];
}
