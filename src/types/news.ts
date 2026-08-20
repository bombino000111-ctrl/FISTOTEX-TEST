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
