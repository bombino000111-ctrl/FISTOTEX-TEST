import type { NewsArticle, NewsFilters } from "@/types/news";
import { siteConfig } from "@/config/site";

/* ────────────────────────────────────────────────────────────────
   A small, dependency-free RSS/Atom reader.

   Deliberately not using an XML library: the shapes we need from news
   feeds are narrow and stable, and this keeps the Vercel build free of
   extra parse dependencies.
   ──────────────────────────────────────────────────────────────── */

const USER_AGENT = "Mozilla/5.0 (compatible; FistotexBot/1.0; +https://www.fistotex.com)";

const REVALIDATE = siteConfig.news.cacheRevalidation;

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ldquo: "\u201C",
  rdquo: "\u201D",
  lsquo: "\u2018",
  rsquo: "\u2019",
  mdash: "\u2014",
  ndash: "\u2013",
  hellip: "\u2026",
  rupee: "\u20B9",
};

function decodeEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[String(name).toLowerCase()] ?? m);
}

function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, " ");
}

/** Convert a raw feed fragment into readable plain text. */
function clean(input: string): string {
  let out = input;
  out = out.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  // Some feeds double-encode (e.g. "&amp;nbsp;"), so decode until stable
  for (let i = 0; i < 3; i++) {
    const next = decodeEntities(out);
    if (next === out) break;
    out = next;
  }
  out = stripTags(out);
  out = out.replace(/\s+/g, " ").trim();
  return out;
}

/** First matching <tag>…</tag> inside a block. */
function pick(block: string, tags: string[]): string {
  for (const tag of tags) {
    const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i");
    const m = block.match(re);
    if (m && m[1]) {
      const value = clean(m[1]);
      if (value) return value;
    }
  }
  return "";
}

/** Read an attribute from the first matching tag, e.g. <media:content url="…"> */
function pickAttr(block: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "i");
  const m = block.match(re);
  return m ? m[1].trim() : "";
}

function extractImage(block: string, rawDescription: string): string | undefined {
  const candidates = [
    pickAttr(block, "media:content", "url"),
    pickAttr(block, "media:thumbnail", "url"),
    pickAttr(block, "enclosure", "url"),
    pickAttr(block, "itunes:image", "href"),
  ];
  for (const c of candidates) {
    if (c && /^https?:\/\//i.test(c)) return c;
  }
  const img = rawDescription.match(/<img[^>]*\ssrc=["']([^"']+)["']/i);
  if (img && /^https?:\/\//i.test(img[1])) return img[1];
  return undefined;
}

const CATEGORY_RULES: Array<{ id: string; words: string[] }> = [
  { id: "ipo", words: ["ipo", "initial public offer", "listing", "grey market"] },
  { id: "mutual-funds", words: ["mutual fund", "sip", " nav ", "amfi", "fund house"] },
  { id: "tax", words: ["tax", "tds", "gst", "itr", "80c"] },
  { id: "insurance", words: ["insurance", "policyholder", "premium", "lic "] },
  { id: "banking", words: ["bank", "rbi", "repo rate", "npa", "deposit"] },
  { id: "cryptocurrency", words: ["crypto", "bitcoin", "ethereum", "blockchain"] },
  { id: "global-markets", words: ["wall street", "nasdaq", "dow ", "global market", "federal reserve"] },
  { id: "economy", words: ["economy", "gdp", "inflation", "cpi", "fiscal", "rupee", "trade deficit"] },
  { id: "personal-finance", words: ["personal finance", "savings", "budget", "retirement", "nps", "ppf"] },
  { id: "stocks", words: ["stock", "share", "nifty", "sensex", "equity", "scrip", "bse", "nse"] },
  { id: "markets", words: ["market", "rally", "index", "benchmark"] },
  { id: "business", words: ["company", "earnings", "quarterly", "revenue", "merger", "acquisition"] },
];

function categorise(title: string, summary: string): string {
  const haystack = ` ${`${title} ${summary}`.toLowerCase()} `;
  for (const rule of CATEGORY_RULES) {
    if (rule.words.some((w) => haystack.includes(w))) return rule.id;
  }
  return "markets";
}

/** Stable id derived from the article URL. */
function hashId(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return `n${(h >>> 0).toString(36)}`;
}

function normaliseUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "output"].forEach((p) =>
      u.searchParams.delete(p)
    );
    return u.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

async function fetchFeed(source: {
  id: string;
  name: string;
}, feedUrl?: string): Promise<NewsArticle[]> {
  if (!feedUrl) return [];

  const res = await fetch(feedUrl, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(9000),
  });

  if (!res.ok) throw new Error(`${source.name}: HTTP ${res.status}`);

  const xml = await res.text();
  const blocks = [
    ...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi),
    ...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi),
  ].map((m) => m[1]);

  const articles: NewsArticle[] = [];

  // Google News appends " - Publisher" to titles; drop it since we show the source
  const escapedName = source.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const suffix = new RegExp(`\\s+[-–|]\\s+${escapedName}\\s*$`, "i");

  for (const block of blocks) {
    const title = pick(block, ["title"]).replace(suffix, "");
    if (!title) continue;

    let link = pick(block, ["link"]);
    if (!link) link = pickAttr(block, "link", "href");
    if (!link || !/^https?:\/\//i.test(link)) continue;

    const rawDescription =
      block.match(/<description(?:\s[^>]*)?>([\s\S]*?)<\/description>/i)?.[1] ??
      block.match(/<summary(?:\s[^>]*)?>([\s\S]*?)<\/summary>/i)?.[1] ??
      block.match(/<content:encoded(?:\s[^>]*)?>([\s\S]*?)<\/content:encoded>/i)?.[1] ??
      "";

    let summary = clean(rawDescription).replace(suffix, "").slice(0, 320);
    // Aggregator descriptions often just repeat the headline — hide those
    if (summary.toLowerCase().startsWith(title.toLowerCase().slice(0, 40))) summary = "";

    const dateRaw = pick(block, ["pubDate", "published", "updated", "dc:date"]);
    const parsed = dateRaw ? new Date(dateRaw) : new Date();
    const publishedAt = Number.isNaN(parsed.getTime())
      ? new Date().toISOString()
      : parsed.toISOString();

    const url = normaliseUrl(link);

    articles.push({
      id: hashId(url),
      title,
      summary,
      url,
      source: source.name,
      sourceId: source.id,
      publishedAt,
      category: categorise(title, summary),
      imageUrl: extractImage(block, rawDescription),
    });
  }

  return articles;
}

/** Try the publisher feed first, then a source-filtered Google News RSS feed.
 * Some publishers return HTTP 403 to server-side requests even though their
 * public RSS feed works in a browser. The fallback keeps attribution intact
 * while avoiding HTML scraping and preserving direct source filtering.
 */
async function fetchSource(source: {
  id: string;
  name: string;
  rssUrl?: string;
  fallbackRssUrl?: string;
}): Promise<NewsArticle[]> {
  const feedUrls = [source.rssUrl, source.fallbackRssUrl].filter(
    (url): url is string => Boolean(url)
  );
  let lastError: unknown;

  for (const feedUrl of feedUrls) {
    try {
      const articles = await fetchFeed(source, feedUrl);
      if (articles.length > 0) return articles;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`${source.name}: no articles returned`);
}

export interface NewsResult {
  articles: NewsArticle[];
  sources: Array<{ id: string; name: string; count: number }>;
  lastUpdated: string;
  /** Feeds that could not be reached, surfaced honestly rather than faked. */
  unavailable: string[];
}

/** Fetch and merge every enabled feed. One failing source never breaks the page. */
export async function getNews(): Promise<NewsResult> {
  const sources = siteConfig.news.sources.filter((s) => s.enabled);
  const settled = await Promise.allSettled(sources.map((s) => fetchSource(s)));

  const articles: NewsArticle[] = [];
  const unavailable: string[] = [];
  const counts = new Map<string, number>();

  settled.forEach((result, i) => {
    const source = sources[i];
    if (result.status === "fulfilled" && result.value.length > 0) {
      counts.set(source.id, result.value.length);
      articles.push(...result.value);
    } else {
      unavailable.push(source.name);
    }
  });

  // De-duplicate by URL
  const unique = new Map<string, NewsArticle>();
  for (const article of articles) {
    if (!unique.has(article.url)) unique.set(article.url, article);
  }

  const merged = Array.from(unique.values())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, siteConfig.news.maxArticles);

  return {
    articles: merged,
    sources: sources.map((s) => ({ id: s.id, name: s.name, count: counts.get(s.id) ?? 0 })),
    lastUpdated: new Date().toISOString(),
    unavailable,
  };
}

/** Apply search / category / source filters. */
export function filterNews(articles: NewsArticle[], filters: NewsFilters = {}): NewsArticle[] {
  let out = articles;

  if (filters.category && filters.category !== "all") {
    out = out.filter((a) => a.category === filters.category);
  }

  if (filters.source && filters.source !== "all") {
    out = out.filter((a) => a.sourceId === filters.source);
  }

  if (filters.search) {
    const term = filters.search.toLowerCase().trim();
    out = out.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.summary.toLowerCase().includes(term) ||
        a.source.toLowerCase().includes(term)
    );
  }

  return out;
}

export async function getFeaturedNews(limit = 4): Promise<NewsArticle[]> {
  const { articles } = await getNews();
  return articles.slice(0, limit);
}
