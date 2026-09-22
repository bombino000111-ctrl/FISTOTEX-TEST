import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Rss, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/section";
import { NewsCard } from "@/components/news/news-card";
import { StructuredData } from "@/components/seo/StructuredData";
import { getNews, filterNews } from "@/lib/news/rss";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Latest Financial News",
  description:
    "Stay updated with the latest financial news from trusted Indian sources. Markets, stocks, mutual funds, personal finance and more.",
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, "")}/news` },
  openGraph: {
    title: "Latest Financial News | Fistotex",
    description: "Stay updated with the latest financial news from trusted Indian sources.",
    type: "website",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
};

type SearchParams = Promise<{
  q?: string;
  category?: string;
  source?: string;
  page?: string;
}>;

/** Build a /news URL preserving the other active filters. */
function buildHref(
  current: { q?: string; category?: string; source?: string },
  overrides: { q?: string; category?: string; source?: string; page?: number }
) {
  const params = new URLSearchParams();
  const q = overrides.q !== undefined ? overrides.q : current.q;
  const category = overrides.category !== undefined ? overrides.category : current.category;
  const source = overrides.source !== undefined ? overrides.source : current.source;

  if (q) params.set("q", q);
  if (category && category !== "all") params.set("category", category);
  if (source && source !== "all") params.set("source", source);
  if (overrides.page && overrides.page > 1) params.set("page", String(overrides.page));

  const qs = params.toString();
  return qs ? `/news?${qs}` : "/news";
}

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const category = sp.category || "all";
  const source = sp.source || "all";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const { articles, sources, lastUpdated, unavailable } = await getNews();
  const filtered = filterNews(articles, { category, source, search: q });

  const perPage = siteConfig.news.itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const activeSources = sources.filter((s) => s.count > 0);
  const hasFilters = Boolean(q) || category !== "all" || source !== "all";
  const current = { q, category: sp.category || "", source: sp.source || "" };

  const updatedLabel = new Date(lastUpdated).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="flex flex-col">
      <StructuredData
        type="WebPage"
        data={{
          title: "Latest Financial News",
          description: "Latest financial news from trusted Indian sources.",
          url: `${siteConfig.url.replace(/\/$/, "")}/news`,
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          items: [
            { name: "Home", url: "/" },
            { name: "News", url: "/news" },
          ],
        }}
      />

      <PageHeader
        eyebrow="Financial news"
        title="Financial News, Without the Noise"
        description="Headlines curated from India's leading financial publications. Every story links to its original source."
        crumbs={[{ name: "News" }]}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Rss className="h-4 w-4 text-accent" />
            {activeSources.length} source{activeSources.length === 1 ? "" : "s"} live
          </span>
          <span aria-hidden="true" className="text-border">·</span>
          <span>{articles.length} stories</span>
          <span aria-hidden="true" className="text-border">·</span>
          <span>Updated {updatedLabel} IST</span>
        </div>
      </PageHeader>

      {/* Filters */}
      <section className="border-b border-border bg-background py-6">
        <div className="container mx-auto space-y-5 px-4">
          <form action="/news" method="get" className="flex flex-col gap-3 sm:flex-row">
            {category !== "all" && <input type="hidden" name="category" value={category} />}
            {source !== "all" && <input type="hidden" name="source" value={source} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <label htmlFor="q" className="sr-only">
                Search news
              </label>
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Search headlines, e.g. RBI, SIP, Nifty…"
                className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Search
            </button>
            {hasFilters && (
              <Link
                href="/news"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Clear
              </Link>
            )}
          </form>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref(current, { category: "all", page: 1 })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                category === "all"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              All topics
            </Link>
            {siteConfig.news.categories.map((c) => (
              <Link
                key={c.id}
                href={buildHref(current, { category: c.id, page: 1 })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  category === c.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Source chips */}
          {activeSources.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">Sources</span>
              <Link
                href={buildHref(current, { source: "all", page: 1 })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  source === "all"
                    ? "border-primary text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </Link>
              {activeSources.map((s) => (
                <Link
                  key={s.id}
                  href={buildHref(current, { source: s.id, page: 1 })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    source === s.id
                      ? "border-primary text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.name}
                  <span className="ml-1.5 text-muted-foreground">{s.count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {unavailable.length > 0 && (
            <div className="mb-8 flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">
                {unavailable.length} source{unavailable.length === 1 ? "" : "s"} couldn&apos;t be
                reached right now ({unavailable.join(", ")}). Showing everything else.
              </p>
            </div>
          )}

          {slice.length === 0 ? (
            <div className="mx-auto max-w-lg py-16 text-center">
              <h2 className="text-xl font-semibold text-foreground">No stories to show</h2>
              <p className="mt-3 text-muted-foreground">
                {hasFilters
                  ? "No headlines match your search or filters. Try a broader search, or clear the filters."
                  : "We couldn't reach any news sources just now. Please try again in a few minutes."}
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                {hasFilters && (
                  <Link
                    href="/news"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
                  >
                    Clear filters
                  </Link>
                )}
                <Link
                  href="/toolkit/finance-calculator"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border px-5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Browse calculators
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {slice.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row"
                >
                  <p className="text-sm text-muted-foreground">
                    Page {safePage} of {totalPages} · {filtered.length} stories
                  </p>
                  <div className="flex items-center gap-2">
                    {safePage > 1 ? (
                      <Link
                        href={buildHref(current, { page: safePage - 1 })}
                        className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Link>
                    ) : (
                      <span className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm text-muted-foreground opacity-50">
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </span>
                    )}

                    {safePage < totalPages ? (
                      <Link
                        href={buildHref(current, { page: safePage + 1 })}
                        className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm text-muted-foreground opacity-50">
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </nav>
              )}
            </>
          )}

          {/* Source attribution */}
          {activeSources.length > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <p className="eyebrow mb-3">Story sources</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {activeSources.map((s) => (
                  <span key={s.id} className="text-muted-foreground">
                    {s.name} <span className="text-xs">({s.count})</span>
                  </span>
                ))}
              </div>
              <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
                Headlines and summaries are the property of their respective publishers and are shown
                here with attribution and a direct link to the original article. Fistotex does not
                claim ownership of third-party content.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
