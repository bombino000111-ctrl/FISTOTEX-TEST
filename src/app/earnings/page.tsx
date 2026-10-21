import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/StructuredData";
import { EarningsList } from "@/components/earnings/earnings-list";
import { companyResults, EARNINGS_AS_OF } from "@/lib/earnings/companies";
import { todayInIndia } from "@/lib/market-calendar/dates";
import { siteConfig } from "@/config/site";

// Re-render hourly so "results due" labels stay current
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Earnings Results — Indian & US Companies, YoY and QoQ Growth",
  description:
    "Latest quarterly results for TCS, Reliance, HDFC Bank, Infosys, Apple, Microsoft, Nvidia and more: revenue, net profit and EPS with year-on-year and quarter-on-quarter growth, sources and next results dates.",
  path: "/earnings",
});

export default function EarningsPage() {
  const today = todayInIndia();

  return (
    <div className="flex flex-col">
      <StructuredData
        type="WebPage"
        data={{
          title: "Earnings Results",
          description: "Latest quarterly results of major Indian and US companies with YoY and QoQ growth.",
          url: `${siteConfig.url.replace(/\/$/, "")}/earnings`,
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          items: [{ name: "Home", url: "/" }, { name: "Earnings" }],
        }}
      />

      <PageHeader
        eyebrow="Earnings"
        title={
          <>
            Quarterly results, <span className="text-accent">India &amp; US</span>
          </>
        }
        description="Revenue, net profit and EPS for the latest reported quarter of the biggest listed companies — with year-on-year and quarter-on-quarter growth, the source, and when the next results are due."
        crumbs={[{ name: "Earnings" }]}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="mb-6 inline-flex items-center gap-2 rounded-sm border border-border bg-muted px-3 py-1.5 text-xs text-ink-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            As of {EARNINGS_AS_OF}. Figures from company filings, releases and financial news reports — each linked to its source.
          </p>

          <EarningsList companies={companyResults} today={today} />

          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Indian figures are consolidated, in ₹ crore; US figures are in US$ billion. For banks, revenue
            is shown as net interest income (NII) or total income, as each bank reports it. Growth rates
            are as reported by the company for the quarter shown. Dates marked &ldquo;Estimated&rdquo; are
            not yet officially confirmed. This is information, not investment advice.
          </p>
        </div>
      </section>
    </div>
  );
}
