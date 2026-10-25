export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  sourceId: string;
  publishedAt: string;
  category?: string;
  imageUrl?: string;
  author?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl?: string;
  fallbackRssUrl?: string;
  /** More feeds from the same publisher (e.g. its personal-finance section), merged in */
  extraRssUrls?: string[];
  enabled: boolean;
}

export interface NewsCategory {
  id: string;
  name: string;
}

export interface NewsFilters {
  category?: string;
  source?: string;
  search?: string;
  /** A reader-need grouping of topics, e.g. "saving" (see news/topics.ts) */
  need?: string;
  /** "today" = last 24 hours, "week" = last 7 days */
  when?: string;
  page?: number;
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface FetchNewsOptions {
  filters?: NewsFilters;
  limit?: number;
  revalidate?: number;
}
