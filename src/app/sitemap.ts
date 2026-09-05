import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const calculatorPages = [
  "sip",
  "lumpsum",
  "mutual-fund",
  "cagr",
  "xirr",
  "emi",
  "loan",
  "fd",
  "rd",
  "ppf",
  "nps",
  "retirement",
  "bond",
  "inflation",
];

const newsCategories = [
  "markets",
  "stocks",
  "mutual-funds",
  "personal-finance",
  "banking",
  "economy",
  "business",
  "ipo",
  "tax",
  "insurance",
  "cryptocurrency",
  "global-markets",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/toolkit`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/toolkit/finance-calculator`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  const calculatorUrls = calculatorPages.map((calc) => ({
    url: `${baseUrl}/toolkit/finance-calculator/${calc}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryUrls = newsCategories.map((cat) => ({
    url: `${baseUrl}/news/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...calculatorUrls, ...categoryUrls];
}