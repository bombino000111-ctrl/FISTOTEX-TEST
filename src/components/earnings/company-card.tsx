import { ArrowUpRight } from "lucide-react";
import type { CompanyResult, NextResults } from "@/types/earnings";
import { Growth } from "@/components/earnings/growth";
import { daysBetween } from "@/lib/market-calendar/dates";

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
      if (d < 0) return { text: `Results out ${day(next.date)} — update pending`, estimated: false };
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
      <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-foreground sm:text-xl">{value}</dd>
      {yoy !== undefined && qoq !== undefined && (
        <dd className="mt-1.5 flex flex-col gap-1">
          <Growth label="YoY" value={yoy} flag={flag} />
          <Growth label="QoQ" value={qoq} flag={flag} />
        </dd>
      )}
    </div>
  );
}

export function CompanyCard({ company, today }: { company: CompanyResult; today: string }) {
  const next = nextLabel(company.next, today);
  const nextDate = company.next.kind === "date" ? company.next.date : undefined;

  return (
    <article className="surface flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-foreground">{company.name}</h3>
        <span className="shrink-0 rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-ink-2">
          {company.quarter}
        </span>
      </div>

      <dl className="mt-4 grid flex-1 content-start grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
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
        <Metric label="EPS" value={perShare(company.eps, company.market)} />
      </dl>

      {company.profitNote && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">*</span> {company.profitNote}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="font-mono font-semibold text-foreground">
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
        <span aria-hidden="true" className="text-border">·</span>
        <a
          href={company.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
        >
          {company.source}
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}
