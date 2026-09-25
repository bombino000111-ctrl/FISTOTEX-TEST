/**
 * Site Configuration
 * Centralized configuration for Fistotex
 */

export const siteConfig = {
  name: "Fistotex",
  description:
    "Your trusted financial companion. Expert financial news, powerful calculators, and smart money tools for informed decisions.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.fistotex.com",
  ogImage: "/og-image.png",
  contactEmail: process.env.CONTACT_EMAIL || "contact@fistotex.com",
  ownerName: process.env.SITE_OWNER_NAME || "Fistotex",
  businessAddress: process.env.BUSINESS_ADDRESS || "",

  // GA4 Configuration
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",

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
      defaultRate: 7.1,
    },
    nps: {
      defaultAnnuityPercentage: 40,
      defaultAnnuityRate: 6,
    },
  },

  // News settings
  news: {
    cacheRevalidation: 300,
    itemsPerPage: 9,
    maxArticles: 60,
    sources: [
      {
        id: "economic-times",
        name: "Economic Times",
        url: "https://economictimes.indiatimes.com",
        rssUrl: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
        enabled: true,
      },
      {
        id: "mint",
        name: "Mint",
        url: "https://www.livemint.com",
        rssUrl: "https://www.livemint.com/rss/markets",
        enabled: true,
      },
      {
        id: "moneycontrol",
        name: "Moneycontrol",
        url: "https://www.moneycontrol.com",
        rssUrl: "https://www.moneycontrol.com/rss/latestnews.xml",
        fallbackRssUrl:
          "https://news.google.com/rss/search?q=site%3Amoneycontrol.com%20(stock%20OR%20market%20OR%20Nifty%20OR%20Sensex)&hl=en-IN&gl=IN&ceid=IN%3Aen",
        enabled: true,
      },
      {
        id: "business-standard",
        name: "Business Standard",
        url: "https://www.business-standard.com",
        rssUrl: "https://www.business-standard.com/rss/markets-106.rss",
        fallbackRssUrl:
          "https://news.google.com/rss/search?q=site%3Abusiness-standard.com%20(stock%20OR%20market%20OR%20Nifty%20OR%20Sensex)&hl=en-IN&gl=IN&ceid=IN%3Aen",
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
