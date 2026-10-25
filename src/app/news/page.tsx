import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/section";
import { NewsCard } from "@/components/news/news-card";
import { StructuredData } from "@/components/seo/StructuredData";
import { getNews, filterNews } from "@/lib/news/rss";
import { siteConfig } from "@/config/site";
import { cn, formatRelativeTime } from "@/lib/utils";
import { readerNeeds } from "@/lib/news/topics";

export const revalidate = 300;

type SearchParams = Promise<{
  q?: string;
  category?: string;
  source?: string;
  need?: string;
  when?: string;
  page?: string;
}>;

const newsMetadata = pageMetadata({
  title: "Latest Stock Market & Financial News India",
  description:
    "Today's Indian money news from Mint, Economic Times, BusinessLine, Moneycontrol and Business Standard: markets, mutual funds, loans, deposits, tax and the economy.",
  path: "/news",
});

/**
 * The category and source chips are real links, so every combination of
 * ?category, ?source, ?q and ?page is a crawlable URL — 12 categories x 4
 * sources x several pages is hundreds of near-identical pages competing with
 * /news itself and burning crawl budget.
 *
 * So only the clean /news URL is indexable. Filtered and paginated views are
 * noindex,follow: Google still walks them to reach the outbound stories, but
 * keeps just one version of this page in the index. The canonical stays on
 * /news throughout (set by pageMetadata above).
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const isFiltered = Boolean(
    sp.q?.trim() ||
      (sp.category && sp.category !== "all") ||
      (sp.source && sp.source !== "all") ||
      (sp.need && sp.need !== "all") ||
      sp.when ||
      (sp.page && sp.page !== "1")
  );

  if (!isFiltered) return newsMetadata;

  return {
    ...newsMetadata,
    robots: { index: false, follow: true },
  };
}

/** Build a /news URL preserving the other active filters. */
type Filters = { q?: string; category?: string; source?: string; need?: string; when?: string };

function buildHref(current: Filters, overrides: Filters & { page?: number }) {
  const params = new URLSearchParams();
  const pick = (k: keyof Filters) => (overrides[k] !== undefined ? overrides[k] : current[k]);
  const q = pick("q");
  const need = pick("need");
  const category = pick("category");
  const source = pick("source");
  const when = pick("when");

  if (q) params.set("q", q);
  if (need && need !== "all") params.set("need", need);
  if (category && category !== "all") params.set("category", category);
  if (source && source !== "all") params.set("source", source);
  if (when && when !== "any") params.set("when", when);
  if (overrides.page && overrides.page > 1) params.set("page", String(overrides.page));

  const qs = params.toString();
  return qs ? `/news?${qs}` : "/news";
}

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const category = sp.category || "all";
  const source = sp.source || "all";
  const need = readerNeeds.some((n) => n.id === sp.need) ? (sp.need as string) : "all";
  const when = sp.when === "today" || sp.when === "week" ? sp.when : "any";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const { articles, sources, lastUpdated, unavailable } = await getNews();
  const filtered = filterNews(articles, { category, source, search: q, need, when });

  const hasFilters = Boolean(q) || category !== "all" || source !== "all" || need !== "all" || when !== "any";

  // Unfiltered page 1 opens with a full-width lead story, so it carries one
  // extra article to keep the grid rows even.
  const perPage = siteConfig.news.itemsPerPage;
  const firstPage = hasFilters ? perPage : perPage + 1;
  const totalPages = Math.max(1, 1 + Math.ceil(Math.max(0, filtered.length - firstPage) / perPage));
  const safePage = Math.min(page, totalPages);
  const start = safePage === 1 ? 0 : firstPage + (safePage - 2) * perPage;
  const slice = filtered.slice(start, safePage === 1 ? firstPage : start + perPage);

  const activeSources = sources.filter((s) => s.count > 0);
  const current: Filters = { q, category: sp.category || "", source: sp.source || "", need, when };
  const activeNeed = readerNeeds.find((n) => n.id === need);

  const newestLabel = formatRelativeTime(lastUpdated);

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
        title="Market news"
        description="Today's headlines from India's leading financial publishers. Every story opens on the publisher's own site."
        crumbs={[{ name: "News" }]}
      >
        <p className="text-sm text-muted-foreground">
          {articles.length} stories from {activeSources.length}{" "}
          {activeSources.length === 1 ? "publisher" : "publishers"}. Newest story {newestLabel}.
        </p>
      </PageHeader>

      {/* Filters */}
      <section aria-label="Search and filter" className="sticky top-[68px] z-30 border-b border-border bg-background/95 py-5 backdrop-blur-md">
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
                className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
            </div>
            <button
              type="submit"
              className="btn-brand h-11 px-6 text-sm"
            >
              Search
            </button>
            {hasFilters && (
              <Link
                href="/news"
                className="btn-ghost h-11 px-5 text-sm"
              >
                Clear
              </Link>
            )}
          </form>

          {/* News for me: grouped by what the reader needs */}
          <div>
            <div role="group" aria-label="Show news for" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
              {[{ id: "all", label: "Everything" }, ...readerNeeds].map((n) => (
                <Link
                  key={n.id}
                  href={buildHref(current, { need: n.id, category: "all", page: 1 })}
                  aria-current={need === n.id ? "true" : undefined}
                  className={cn(
                    "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                    need === n.id
                      ? "border-transparent bg-accent text-accent-foreground"
                      : "border-rule text-foreground hover:border-accent"
                  )}
                >
                  {n.label}
                </Link>
              ))}
              <span aria-hidden="true" className="mx-1 hidden w-px self-stretch bg-border md:block" />
              {[
                { id: "any", label: "Any time" },
                { id: "today", label: "Today" },
                { id: "week", label: "This week" },
              ].map((w) => (
                <Link
                  key={w.id}
                  href={buildHref(current, { when: w.id, page: 1 })}
                  aria-current={when === w.id ? "true" : undefined}
                  className={cn(
                    "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                    when === w.id
                      ? "border-accent bg-accent-soft text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {w.label}
                </Link>
              ))}
            </div>
            {activeNeed && <p className="mt-2 text-sm text-muted-foreground">{activeNeed.hint}.</p>}
          </div>

          {/* Category chips */}
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
            <Link
              href={buildHref(current, { category: "all", page: 1 })}
              className={cn(
                "inline-flex min-h-9 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                category === "all"
                  ? "border-transparent bg-foreground text-background"
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
                  "inline-flex min-h-9 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                  category === c.id
                    ? "border-transparent bg-foreground text-background"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Source chips */}
          {activeSources.length > 1 && (
            <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
              <span className="shrink-0 text-sm font-medium text-muted-foreground">Publisher</span>
              <Link
                href={buildHref(current, { source: "all", page: 1 })}
                className={cn(
                  "inline-flex min-h-9 shrink-0 items-center rounded-full border px-3.5 text-sm font-medium transition-colors",
                  source === "all"
                    ? "border-accent bg-accent-soft text-foreground"
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
                    "inline-flex min-h-9 shrink-0 items-center rounded-full border px-3.5 text-sm font-medium transition-colors",
                    source === s.id
                      ? "border-accent bg-accent-soft text-foreground"
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
            <div className="mx-auto mb-8 flex max-w-3xl items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">
                {unavailable.length} source{unavailable.length === 1 ? "" : "s"} couldn&apos;t be
                reached right now ({unavailable.join(", ")}). Showing everything else.
              </p>
            </div>
          )}

          {slice.length === 0 ? (
            <div className="mx-auto max-w-lg py-16 text-center">
              <h2 className="font-display text-3xl text-foreground">No stories to show</h2>
              <p className="mt-3 text-muted-foreground">
                {hasFilters
                  ? "No headlines match your search or filters. Try a broader search, or clear the filters."
                  : "None of the publishers' feeds responded just now. They're checked again on your next visit."}
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                {hasFilters && (
                  <Link
                    href="/news"
                    className="btn-brand h-10 px-5 text-sm"
                  >
                    Clear filters
                  </Link>
                )}
                <Link
                  href="/calculators"
                  className="btn-ghost h-10 px-5 text-sm"
                >
                  Browse calculators
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ol className="mx-auto max-w-3xl divide-y divide-border border-b border-border">
                {slice.map((article, i) => (
                  <li key={article.id}>
                    <NewsCard article={article} featured={i === 0 && safePage === 1 && !hasFilters} />
                  </li>
                ))}
              </ol>

              {totalPages > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-4 sm:flex-row"
                >
                  <p className="text-sm text-muted-foreground">
                    Page {safePage} of {totalPages}, {filtered.length} stories
                  </p>
                  <div className="flex items-center gap-2">
                    {safePage > 1 ? (
                      <Link
                        href={buildHref(current, { page: safePage - 1 })}
                        className="btn-ghost h-10 gap-1 px-4 text-sm"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Link>
                    ) : (
                      <span className="inline-flex h-10 items-center gap-1 rounded-full border border-border px-4 text-sm text-muted-foreground opacity-50">
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </span>
                    )}

                    {safePage < totalPages ? (
                      <Link
                        href={buildHref(current, { page: safePage + 1 })}
                        className="btn-ghost h-10 gap-1 px-4 text-sm"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span className="inline-flex h-10 items-center gap-1 rounded-full border border-border px-4 text-sm text-muted-foreground opacity-50">
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
            <div className="mx-auto mt-16 max-w-3xl">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Where these stories come from</h2>
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
