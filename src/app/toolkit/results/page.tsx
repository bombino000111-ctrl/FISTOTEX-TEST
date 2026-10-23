import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/section";
import { pageMetadata } from "@/lib/seo";
import { NIFTY50, NIFTY50_REVIEWED_ON } from "@/lib/toolkit/nifty50";
import {
  getNiftyResults,
  formatINRCrore,
  formatPct,
  nseQuoteUrl,
} from "@/lib/toolkit/results";
import { cn } from "@/lib/utils";

export const revalidate = 21600; // 6 hours

export const metadata: Metadata = pageMetadata({
  title: "Results Tracker - Nifty 50 Quarterly Results, QoQ & YoY",
  description:
    "Latest quarterly results for every Nifty 50 company: revenue and profit with quarter-on-quarter and year-on-year growth, plus the deadline for the next declaration under SEBI rules.",
  path: "/toolkit/results",
});

function Growth({ v }: { v: number | null }) {
  if (v == null) return <span className="text-muted-foreground">-</span>;
  const up = v >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs font-bold",
        up ? "text-accent" : "text-destructive"
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {formatPct(v)}
    </span>
  );
}

export default async function ResultsPage() {
  const { rows, failed } = await getNiftyResults(NIFTY50);
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(r.quarterLabel, (counts.get(r.quarterLabel) ?? 0) + 1);
  const latestQuarter =
    [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "latest quarter";

  return (
    <>
      <PageHeader
        eyebrow="Toolkit / Results"
        title="Nifty 50 results tracker"
        description={`Latest declared quarter for every Nifty 50 company, with quarter-on-quarter and year-on-year growth in revenue and profit. "Expected by" is the SEBI LODR deadline: companies must declare within 45 days of quarter end.`}
      />

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span>
            Latest quarter on file: <strong className="text-foreground">{latestQuarter}</strong>
          </span>
          <span aria-hidden="true">&middot;</span>
          <span>
            {rows.length} of {NIFTY50.length} companies loaded
            {failed > 0 && ` (${failed} temporarily unavailable)`}
          </span>
          <span aria-hidden="true">&middot;</span>
          <span>Refreshes every 6 hours</span>
        </div>

        <div className="overflow-x-auto rounded-sm border border-rule bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-rule text-left font-mono text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Quarter</th>
                <th className="px-4 py-3 text-right">Revenue</th>
                <th className="px-4 py-3 text-right">QoQ</th>
                <th className="px-4 py-3 text-right">YoY</th>
                <th className="px-4 py-3 text-right">Net profit</th>
                <th className="px-4 py-3 text-right">QoQ</th>
                <th className="px-4 py-3 text-right">YoY</th>
                <th className="px-4 py-3 text-right">Next expected by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {rows.map((r) => (
                <tr key={r.symbol} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <a
                      href={nseQuoteUrl(r.symbol)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-accent"
                    >
                      {r.name}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                    </a>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      {r.symbol.replace(".NS", "")}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.quarterLabel}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                    {formatINRCrore(r.revenue)}
                  </td>
                  <td className="px-4 py-3 text-right"><Growth v={r.revenueQoQ} /></td>
                  <td className="px-4 py-3 text-right"><Growth v={r.revenueYoY} /></td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                    {formatINRCrore(r.pat)}
                  </td>
                  <td className="px-4 py-3 text-right"><Growth v={r.patQoQ} /></td>
                  <td className="px-4 py-3 text-right"><Growth v={r.patYoY} /></td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                    {new Date(r.nextExpectedBy + "T00:00:00Z").toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-sm border border-rule bg-muted/50 px-4 py-5 text-sm text-muted-foreground">
          <p className="mb-1 font-semibold text-foreground">Sources and accuracy</p>
          <p>
            Figures are company-reported quarterly numbers aggregated from public Yahoo Finance feeds,
            cached for 6 hours. Always verify against the official filing before acting: each company
            name links to its NSE quote page, and filings live on NSE/BSE and the company&rsquo;s investor
            relations page. Constituent list reviewed {NIFTY50_REVIEWED_ON}. Exact per-company
            declaration dates are announced a few days ahead to the exchanges; where no date is
            announced yet we show the 45-day SEBI deadline instead. See also the{" "}
            <Link href="/toolkit/market-calendar" className="text-accent hover:underline">
              market calendar
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
