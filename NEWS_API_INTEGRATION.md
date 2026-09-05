# Fistotex - Real News API Integration Guide

## Current State
The news service (`src/lib/news/news-service.ts`) currently uses **mock data**. To display real financial news, you need to integrate with actual news APIs.

---

## Option 1: RSS Feeds (Recommended - Free, No API Key)

### Supported Indian Financial News RSS Feeds:
```typescript
const RSS_FEEDS = {
  mint: "https://www.livemint.com/rss/markets",
  moneycontrol: "https://www.moneycontrol.com/rss/latestnews.xml",
  economictimes: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
  businessline: "https://www.thehindubusinessline.com/news/feeder/default.rss",
  financialexpress: "https://www.financialexpress.com/market/feed/",
  businessstandard: "https://www.business-standard.com/rss/markets-106.rss",
};
```

### Implementation (Add to `news-service.ts`):
```typescript
import { parseStringPromise } from 'xml2js';

async function fetchRSSFeed(url: string): Promise<NewsArticle[]> {
  const response = await fetch(url, { 
    headers: { 'User-Agent': 'Fistotex/1.0' },
    next: { revalidate: 300 } // Cache for 5 minutes
  });
  const xml = await response.text();
  const result = await parseStringPromise(xml);
  
  return result.rss.channel[0].item.map((item: any) => ({
    title: item.title[0],
    description: item.description?.[0]?.replace(/<[^>]*>/g, '') || '',
    url: item.link[0],
    source: getSourceFromUrl(url),
    publishedAt: new Date(item.pubDate[0]),
    imageUrl: extractImage(item),
  }));
}
```

### Dependencies:
```bash
npm install xml2js
npm install -D @types/xml2js
```

---

## Option 2: NewsAPI.org (Free Tier: 100 requests/day)

### Setup:
1. Sign up at https://newsapi.org/register
2. Get API key
3. Add to `.env.local`: `NEWSAPI_KEY=your_key_here`

### Implementation:
```typescript
const NEWSAPI_URL = 'https://newsapi.org/v2/everything';

async function fetchNewsAPI(): Promise<NewsArticle[]> {
  const params = new URLSearchParams({
    q: 'india stock market OR mutual fund OR finance OR economy',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '20',
    apiKey: process.env.NEWSAPI_KEY!,
  });

  const response = await fetch(`${NEWSAPI_URL}?${params}`, { next: { revalidate: 600 } });
  const data = await response.json();
  
  return data.articles.map((article: any) => ({
    title: article.title,
    description: article.description || '',
    url: article.url,
    source: article.source.name,
    publishedAt: new Date(article.publishedAt),
    imageUrl: article.urlToImage,
  }));
}
```

---

## Option 3: GNews API (Free Tier: 100 requests/day)

### Setup:
1. Sign up at https://gnews.io/
2. Get API key
3. Add to `.env.local`: `GNEWS_API_KEY=your_key_here`

### Implementation:
```typescript
const GNEWS_URL = 'https://gnews.io/api/v4/search';

async function fetchGNews(): Promise<NewsArticle[]> {
  const params = new URLSearchParams({
    q: 'india finance stock market mutual fund',
    lang: 'en',
    country: 'in',
    max: '20',
    apikey: process.env.GNEWS_API_KEY!,
  });

  const response = await fetch(`${GNEWS_URL}?${params}`, { next: { revalidate: 600 } });
  const data = await response.json();
  
  return data.articles.map((article: any) => ({
    title: article.title,
    description: article.description || '',
    url: article.url,
    source: article.source.name,
    publishedAt: new Date(article.publishedAt),
    imageUrl: article.image,
  }));
}
```

---

## Option 4: Financial Modeling Prep (Free Tier: 250 requests/day)

### Setup:
1. Sign up at https://financialmodelingprep.com/developer/docs
2. Get API key
3. Add to `.env.local`: `FMP_API_KEY=your_key_here`

### Implementation:
```typescript
const FMP_URL = 'https://financialmodelingprep.com/api/v3';

async function fetchFMPNews(): Promise<NewsArticle[]> {
  const response = await fetch(
    `${FMP_URL}/stock_news?limit=20&apikey=${process.env.FMP_API_KEY}`,
    { next: { revalidate: 600 } }
  );
  const data = await response.json();
  
  return data.map((article: any) => ({
    title: article.title,
    description: article.text?.substring(0, 300) || '',
    url: article.url,
    source: article.site,
    publishedAt: new Date(article.publishedDate),
    imageUrl: article.image,
  }));
}
```

---

## Recommended Architecture: Multi-Source with Fallback

```typescript
// src/lib/news/news-service.ts

export async function getNewsArticles(filters?: NewsFilters): Promise<NewsArticle[]> {
  const sources = [
    { name: 'rss', fn: fetchAllRSSFeeds, priority: 1 },
    { name: 'newsapi', fn: fetchNewsAPI, priority: 2 },
    { name: 'gnews', fn: fetchGNews, priority: 3 },
    { name: 'fmp', fn: fetchFMPNews, priority: 4 },
  ];

  // Try sources in priority order, merge results, deduplicate
  const allArticles: NewsArticle[] = [];
  
  for (const source of sources) {
    try {
      const articles = await source.fn();
      allArticles.push(...articles);
    } catch (error) {
      console.warn(`News source ${source.name} failed:`, error);
      // Continue to next source
    }
  }

  // Deduplicate by URL
  const unique = Array.from(
    new Map(allArticles.map(a => [a.url, a])).values()
  );

  // Sort by date, apply filters
  return unique
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .filter(applyFilters(filters))
    .slice(0, 50);
}
```

---

## Environment Variables Needed

Add to `.env.local` (local) and Vercel Project Settings (production):

```bash
# Choose ONE or more:
NEWSAPI_KEY=your_newsapi_key
GNEWS_API_KEY=your_gnews_key
FMP_API_KEY=your_fmp_key

# Optional: Custom RSS feed URLs
CUSTOM_RSS_FEEDS=https://example.com/feed1.rss,https://example.com/feed2.rss
```

---

## Deployment Checklist

- [ ] Choose news source(s) based on needs
- [ ] Sign up for API keys (if using Option 2-4)
- [ ] Add environment variables to Vercel
- [ ] Update `news-service.ts` with real implementation
- [ ] Test locally with `npm run dev`
- [ ] Deploy to Vercel
- [ ] Monitor API usage/rate limits
- [ ] Set up cron job to pre-warm cache (optional)

---

## Cost Comparison

| Source | Free Tier | Paid Plans | Best For |
|--------|-----------|------------|----------|
| RSS Feeds | Unlimited | N/A | Zero cost, full control |
| NewsAPI | 100/day | $44/mo | General news |
| GNews | 100/day | $9/mo | Budget-friendly |
| FMP | 250/day | $20/mo | Financial-specific |

---

## Quick Start (RSS Only - No API Keys)

1. Install dependency:
   ```bash
   npm install xml2js
   npm install -D @types/xml2js
   ```

2. Replace `getNewsArticles` in `news-service.ts` with RSS implementation

3. Test: `npm run dev` → visit `/news`

This is the **simplest, free, and most reliable** option for Indian financial news.