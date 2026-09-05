import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Latest Financial News",
  description: "Stay updated with the latest financial news from trusted Indian sources. Markets, stocks, mutual funds, personal finance, and more.",
  openGraph: {
    title: "Latest Financial News | Fistotex",
    description: "Stay updated with the latest financial news from trusted Indian sources.",
    type: "website",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
};

import { StructuredData } from "@/components/seo/StructuredData";
import NewsClient from "./news-client";

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string; source?: string; search?: string }> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData type="WebPage" data={{ 
        title: "Latest Financial News", 
        description: "Stay updated with the latest financial news from trusted Indian sources." 
      }} />
      <StructuredData type="WebSite" />
      <NewsClient searchParams={resolvedSearchParams} />
    </div>
  );
}