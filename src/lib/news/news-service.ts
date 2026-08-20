import type { NewsArticle, NewsFilters, FetchNewsOptions } from "@/types/news";
import { siteConfig } from "@/config/site";

/**
 * Mock news data for development when no API is configured
 * This should only be used in development mode
 */
const mockNewsArticles: NewsArticle[] = [
  {
    id: "mock-1",
    title: "Sensex Surges 500 Points to Record High on Strong Q4 Earnings",
    summary: "Indian stock markets hit new peaks as banking and IT stocks lead the rally amid positive earnings reports.",
    url: "https://www.livemint.com/market/example-sensex-record",
    source: "Mint",
    sourceId: "mint",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    category: "markets",
  },
  {
    id: "mock-2",
    title: "RBI Holds Repo Rate Steady at 6.5% in Latest Monetary Policy",
    summary: "The Reserve Bank of India maintains its stance on inflation control while supporting economic growth.",
    url: "https://www.moneycontrol.com/news/business/economy/example-rbi-policy",
    source: "Moneycontrol",
    sourceId: "moneycontrol",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    category: "economy",
  },
  {
    id: "mock-3",
    title: "Top Mutual Funds Report Double-Digit Returns in FY2026",
    summary: "Equity mutual funds deliver strong performance driven by mid-cap and small-cap segments.",
    url: "https://economictimes.indiatimes.com/mf/example-mutual-funds",
    source: "Economic Times",
    sourceId: "economic-times",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    category: "mutual-funds",
  },
  {
    id: "mock-4",
    title: "New Tax Regime vs Old: Which One Saves You More in 2026?",
    summary: "A comprehensive comparison of both tax regimes to help you make an informed decision.",
    url: "https://www.livemint.com/money/tax/example-tax-regime",
    source: "Mint",
    sourceId: "mint",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    category: "tax",
  },
  {
    id: "mock-5",
    title: "Digital Banking Adoption Reaches 80% Among Urban Indians",
    summary: "Mobile banking and UPI transactions continue to grow exponentially across the country.",
    url: "https://www.moneycontrol.com/news/business/banks/example-digital-banking",
    source: "Moneycontrol",
    sourceId: "moneycontrol",
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    category: "banking",
  },
];

/**
 * Fetch news articles with optional filters
 * Uses mock data in development if no API key is configured
 */
export async function fetchNews(options: FetchNewsOptions = {}): Promise<{
  articles: NewsArticle[];
  total: number;
  hasMore: boolean;
  lastUpdated: string;
}> {
  const { filters = {}, limit = siteConfig.news.itemsPerPage } = options;
  
  // Check if we have a NEWS_API_KEY configured
  const apiKey = process.env.NEWS_API_KEY;
  
  try {
    if (apiKey) {
      // Use real API when key is available
      // This is a placeholder for actual API integration
      const response = await fetchNewsFromAPI(apiKey, filters, limit);
      return response;
    } else {
      // Use mock data for development
      console.log("Using mock news data. Configure NEWS_API_KEY for real data.");
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let filteredArticles = [...mockNewsArticles];
      
      // Apply category filter
      if (filters.category) {
        filteredArticles = filteredArticles.filter(
          (article) => article.category === filters.category
        );
      }
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredArticles = filteredArticles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchTerm) ||
            article.summary.toLowerCase().includes(searchTerm)
        );
      }
      
      return {
        articles: filteredArticles.slice(0, limit),
        total: filteredArticles.length,
        hasMore: filteredArticles.length > limit,
        lastUpdated: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    
    // Return mock data as fallback even on error
    return {
      articles: mockNewsArticles.slice(0, limit),
      total: mockNewsArticles.length,
      hasMore: false,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Placeholder for real API integration
 * Implement actual API calls here when you have API keys
 */
async function fetchNewsFromAPI(
  apiKey: string,
  filters: NewsFilters,
  limit: number
): Promise<{
  articles: NewsArticle[];
  total: number;
  hasMore: boolean;
  lastUpdated: string;
}> {
  // Example implementation using a news API
  // Replace with your actual API endpoint
  
  const params = new URLSearchParams({
    apiKey,
    pageSize: limit.toString(),
    ...(filters.category && { category: filters.category }),
    ...(filters.search && { q: filters.search }),
  });
  
  const response = await fetch(`https://api.example-news.com/v1/articles?${params}`);
  
  if (!response.ok) {
    throw new Error(`News API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    articles: data.articles.map((article: any) => ({
      id: article.id || article.url,
      title: article.title,
      summary: article.description || article.content?.substring(0, 200) || "",
      url: article.url,
      source: article.source?.name || "Unknown",
      sourceId: article.source?.id || "unknown",
      publishedAt: article.publishedAt,
      category: article.category,
      imageUrl: article.urlToImage,
      author: article.author,
    })),
    total: data.totalResults,
    hasMore: data.articles.length >= limit,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get featured news articles
 */
export async function getFeaturedNews(limit: number = 5): Promise<NewsArticle[]> {
  const result = await fetchNews({ limit });
  return result.articles.slice(0, limit);
}

/**
 * Get news by category
 */
export async function getNewsByCategory(category: string, limit: number = 10): Promise<NewsArticle[]> {
  const result = await fetchNews({
    filters: { category },
    limit,
  });
  return result.articles;
}

/**
 * Search news articles
 */
export async function searchNews(query: string, limit: number = 20): Promise<NewsArticle[]> {
  const result = await fetchNews({
    filters: { search: query },
    limit,
  });
  return result.articles;
}
