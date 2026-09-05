"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Loader2, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { NewsCard } from "@/components/news/news-card";
import { fetchNews } from "@/lib/news/news-service";
import { siteConfig } from "@/config/site";
import { analytics } from "@/lib/analytics";

const categories = [
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
];

const sources = [
  { id: "mint", name: "Mint" },
  { id: "moneycontrol", name: "Moneycontrol" },
  { id: "economic-times", name: "Economic Times" },
];

function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-80 animate-pulse">
          <CardContent className="p-0">
            <div className="aspect-video bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-8 bg-muted rounded w-full" />
              <div className="h-8 bg-muted rounded w-full" />
              <div className="h-8 bg-muted rounded w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface NewsContentProps {
  articles: any[];
  searchParams: any;
}

function NewsContent({ articles, searchParams }: NewsContentProps) {
  const { page = "1", category = "all", source = "all", search = "" } = searchParams;
  const currentPage = parseInt(page);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">
              Latest Financial News
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay informed with real-time updates from India's most trusted financial publications.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <form className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
            <div className="md:flex-1">
              <label htmlFor="search" className="sr-only">Search news</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  name="search"
                  placeholder="Search news articles..."
                  value={search || ""}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={category} onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                if (e.target.value === "all") params.delete("category");
                else params.set("category", e.target.value);
                params.delete("page");
                window.location.search = params.toString();
              }}>
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>

              <Select value={source} onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                if (e.target.value === "all") params.delete("source");
                else params.set("source", e.target.value);
                params.delete("page");
                window.location.search = params.toString();
              }}>
                <option value="all">All Sources</option>
                {sources.map((src) => (
                  <option key={src.id} value={src.id}>{src.name}</option>
                ))}
              </Select>

              <Button type="submit" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
             
              {(category !== "all" || source !== "all" || search) && (
                <Button type="button" variant="outline" onClick={() => window.location.href = "/news"} className="gap-2">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {paginatedArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No articles found.</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.set("page", String(currentPage - 1));
                      window.location.search = params.toString();
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <span className="px-4 text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.set("page", String(currentPage + 1));
                      window.location.search = params.toString();
                    }}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default function NewsClient({ searchParams }: { searchParams: any }) {
  return (
    <Suspense fallback={<NewsSkeleton />}>
      <NewsContent articles={[]} searchParams={searchParams} />
    </Suspense>
  );
}