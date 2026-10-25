import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/StructuredData";
import { EarningsList } from "@/components/earnings/earnings-list";
import { companyResults, EARNINGS_AS_OF } from "@/lib/earnings/companies";
import { todayInIndia } from "@/lib/market-calendar/dates";
import { liveUsResult } from "@/lib/earnings/sec";
import { upcomingResultsMeetings } from "@/lib/nse";
import type { CompanyResult } from "@/types/earnings";
import { siteConfig } from "@/config/site";

// Re-render hourly so "results due" labels stay current
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Quarterly Results: India & US Companies",
  description:
    "Latest quarterly results for TCS, Reliance, HDFC Bank, Infosys, Apple, Microsoft, Nvidia and more: revenue, net profit and EPS with year-on-year and quarter-on-quarter growth, sources and next results dates.",
  path: "/earnings",
});

/**
 * Hand-checked results, upgraded where a live source has something newer:
 * US figures from SEC filings, Indian results dates from NSE.
 */
async function currentResults(today: string): Promise<CompanyResult[]> {
  const meetings = await upcomingResultsMeetings(today);
  const nextBySymbol = new Map(meetings.map((m) => [m.symbol, m.date]));

  const out: CompanyResult[] = [];
  // One company at a time: SEC limits clients to a few requests a second
  for (const c of companyResults) {
    if (c.market === "US") {
      out.push((await liveUsResult(c, today)) ?? c);
      continue;
    }
    const date = c.symbol ? nextBySymbol.get(c.symbol) : undefined;
    out.push(date ? { ...c, next: { kind: "date", date } } : c);
  }
  return out;
}

export default async function EarningsPage() {
  const today = todayInIndia();
  const companies = await currentResults(today);

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
        title="Quarterly results"
        description="How India's and America's biggest companies did in their latest quarter: what they sold, what they kept as profit, how that compares with a year ago, and when they report next."
        crumbs={[{ name: "Earnings" }]}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <p className="max-w-prose leading-relaxed text-ink-2">
              US figures update automatically from companies&apos; SEC filings. Indian figures are checked
              by hand against each company&apos;s own results release (last checked {EARNINGS_AS_OF}), and
              their next results dates come live from NSE. Each card says which applies and links to its
              source.
            </p>

            <details className="group rounded-[var(--radius)] border border-border bg-card p-5 open:pb-6">
              <summary className="cursor-pointer list-none font-semibold text-foreground">
                <span className="underline-offset-4 group-hover:underline">How to read these numbers</span>
              </summary>
              <dl className="mt-4 space-y-3 text-sm leading-relaxed">
                <div>
                  <dt className="font-semibold text-foreground">Revenue</dt>
                  <dd className="text-ink-2">
                    Money earned from selling products or services. Banks show interest or total income
                    instead.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Net profit</dt>
                  <dd className="text-ink-2">What&apos;s left after every cost and tax is paid.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Earnings per share (EPS)</dt>
                  <dd className="text-ink-2">Net profit divided by the number of shares: one share&apos;s slice of the profit.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">vs last year</dt>
                  <dd className="text-ink-2">
                    Compared with the same three months a year earlier, which removes seasonal swings.
                    &ldquo;vs last quarter&rdquo; compares with the three months just before.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">₹ crore</dt>
                  <dd className="text-ink-2">₹1 crore is ₹100 lakh, or ₹10 million. ₹73,188 crore is about ₹7.3 lakh crore.</dd>
                </div>
              </dl>
            </details>
          </div>

          <EarningsList companies={companies} today={today} checkedOn={EARNINGS_AS_OF} />

          <p className="mt-12 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Indian figures are consolidated, in ₹ crore; US figures are in US$ billion. For banks, revenue
            is shown as net interest income (NII) or total income, as each bank reports it. On
            hand-checked cards growth is as the company reported it; on live US cards it&apos;s worked out
            from the filed figures. Dates marked &ldquo;Estimated&rdquo; are not yet confirmed. This is
            information, not investment advice.
          </p>
        </div>
      </section>
    </div>
  );
}
