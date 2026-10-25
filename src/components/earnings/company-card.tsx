import { ArrowUpRight } from "lucide-react";
import type { CompanyResult, NextResults } from "@/types/earnings";
import { Growth } from "@/components/earnings/growth";
import { daysBetween } from "@/lib/market-calendar/dates";
import { quarterMonths } from "@/lib/earnings/period";

// Values arrive as ₹ crore (India) or US$ billion (US)
function money(value: number, market: CompanyResult["market"]) {
  return market === "IN"
    ? `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })} cr`
    : `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}B`;
}

function perShare(value: number, market: CompanyResult["market"]) {
  return `${market === "IN" ? "₹" : "$"}${value.toFixed(2)}`;
}

// Calendar days: format in UTC so the date never shifts
const day = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });

function nextLabel(next: NextResults, today: string): { text: string; estimated: boolean } {
  switch (next.kind) {
    case "reported":
      return { text: "Latest quarter reported", estimated: false };
    case "tba":
      return { text: "Next results: date TBA", estimated: false };
    case "approx":
      return { text: `Next results: ${next.label}`, estimated: true };
    case "date": {
      const d = daysBetween(today, next.date);
      if (d === 0) return { text: "Results due today", estimated: !!next.estimated };
      if (d < 0) return { text: `Results out ${day(next.date)}, figures being updated`, estimated: false };
      return { text: `Next results: ${day(next.date)}`, estimated: !!next.estimated };
    }
  }
}

function Metric({
  label,
  value,
  yoy,
  qoq,
  flag,
}: {
  label: string;
  value: string;
  yoy?: number;
  qoq?: number;
  flag?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-display mt-1 text-2xl tabular-nums text-foreground">{value}</dd>
      {yoy !== undefined && qoq !== undefined && (
        <dd className="mt-1.5 flex flex-col gap-1">
          <Growth label="YoY" value={yoy} flag={flag} />
          <Growth label="QoQ" value={qoq} flag={flag} />
        </dd>
      )}
    </div>
  );
}

export function CompanyCard({
  company,
  today,
  checkedOn,
}: {
  company: CompanyResult;
  today: string;
  checkedOn: string;
}) {
  const next = nextLabel(company.next, today);
  const nextDate = company.next.kind === "date" ? company.next.date : undefined;

  return (
    <article className="surface flex flex-col p-6 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-display text-2xl text-foreground">{company.name}</h3>
        <span className="shrink-0 text-sm text-muted-foreground">
          {quarterMonths(company.periodEnd)}
          {company.quarter && ` (${company.quarter})`}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {company.live ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-growth-ink">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-growth" />
            Updated automatically from SEC filings
          </span>
        ) : (
          <>Checked by hand on {checkedOn}</>
        )}
      </p>

      <dl className="mt-6 grid flex-1 content-start grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
        <Metric
          label={company.revenueLabel}
          value={money(company.revenue, company.market)}
          yoy={company.revenueYoY}
          qoq={company.revenueQoQ}
        />
        <Metric
          label="Net profit"
          value={money(company.netProfit, company.market)}
          yoy={company.profitYoY}
          qoq={company.profitQoQ}
          flag={!!company.profitNote}
        />
        <Metric label="Earnings per share" value={perShare(company.eps, company.market)} />
      </dl>

      {company.profitNote && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">*</span> {company.profitNote}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {nextDate ? <time dateTime={nextDate}>{next.text}</time> : next.text}
        </span>
        {next.estimated && (
          <span
            title="Date not yet officially confirmed"
            className="inline-flex items-center rounded-full border border-dashed border-rule px-2 py-0.5 font-semibold"
          >
            Estimated
          </span>
        )}
        <a
          href={company.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="ml-auto inline-flex items-center gap-1 font-semibold text-accent underline-offset-4 hover:underline"
        >
          Source: {company.source}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
