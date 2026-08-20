/**
 * Site Configuration
 * Centralized configuration for FinanceHub
 */

export const siteConfig = {
  name: "FinanceHub",
  description: "Smarter Financial Decisions Start Here - Stay informed with the latest financial news and use powerful calculators to plan your money with confidence.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  contactEmail: process.env.CONTACT_EMAIL || "contact@example.com",
  ownerName: process.env.SITE_OWNER_NAME || "FinanceHub",
  businessAddress: process.env.BUSINESS_ADDRESS || "",
  
  // Currency settings
  currency: "INR" as const,
  currencySymbol: "₹",
  locale: "en-IN" as const,
  
  // Calculator defaults
  calculators: {
    sip: {
      defaultMonthlyInvestment: 5000,
      defaultAnnualReturn: 12,
      defaultYears: 10,
    },
    lumpsum: {
      defaultInvestment: 100000,
      defaultAnnualReturn: 12,
      defaultYears: 10,
    },
    ppf: {
      defaultAnnualInvestment: 50000,
      defaultYears: 15,
      defaultRate: 7.1, // Configurable - subject to government notification
    },
    nps: {
      defaultAnnuityPercentage: 40,
      defaultAnnuityRate: 6,
    },
  },
  
  // News settings
  news: {
    cacheRevalidation: 300, // 5 minutes
    itemsPerPage: 20,
    sources: [
      {
        id: "mint",
        name: "Mint",
        url: "https://www.livemint.com",
        rssUrl: "https://www.livemint.com/rss/feed",
        enabled: true,
      },
      {
        id: "moneycontrol",
        name: "Moneycontrol",
        url: "https://www.moneycontrol.com",
        rssUrl: "https://www.moneycontrol.com/rss/",
        enabled: true,
      },
      {
        id: "economic-times",
        name: "Economic Times",
        url: "https://economictimes.indiatimes.com",
        rssUrl: "https://economictimes.indiatimes.com/rssfeedstopstories.cms",
        enabled: true,
      },
    ],
    categories: [
      { id: "markets", name: "Markets" },
      { id: "stocks", name: "Stocks" },
      { id: "mutual-funds", name: "Mutual Funds" },
      { id: "personal-finance", name: "Personal Finance" },
      { id: "banking", name: "Banking" },
      { id: "economy", name: "Economy" },
      { id: "business", name: "Business" },
      { id: "ipo", name: "IPO" },
      { id: "tax", name: "Tax" },
      { id: "insurance", name: "Insurance" },
      { id: "cryptocurrency", name: "Cryptocurrency" },
      { id: "global-markets", name: "Global Markets" },
    ],
  },
  
  // Social links (placeholders)
  social: {
    twitter: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  },
};

export type SiteConfig = typeof siteConfig;
