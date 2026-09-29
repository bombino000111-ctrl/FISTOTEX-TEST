import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  calculators,
  calculatorPath,
  type CalculatorDef,
  type CategoryId,
} from "@/lib/calculators/registry";

/**
 * The gazette's desks. The registry groups calculators into six categories
 * for browsing; the front page prints them as four editorial desks, which is
 * how a reader actually thinks about the decision in front of them.
 */
const desks: Array<{
  no: string;
  title: string;
  tint: string;
  /** Registry categories filed under this desk, in print order. */
  categories: CategoryId[];
  /** Plural noun for the count line, e.g. "5 Verified Instruments". */
  unit: string;
}> = [
  {
    no: "01",
    title: "Wealth Compounding & Capital Market Investments",
    tint: "#0A5C36",
    categories: ["investment"],
    unit: "Verified Instruments",
  },
  {
    no: "02",
    title: "Borrowing, Eligibility & Amortisation Schedules",
    tint: "#1B365D",
    categories: ["loans"],
    unit: "Loan Engines",
  },
  {
    no: "03",
    title: "Sovereign Guaranteed & Small Savings Schemes",
    tint: "#8C3A00",
    categories: ["savings"],
    unit: "Statutory Schemes",
  },
  {
    no: "04",
    title: "Retirement, Pension Architecture & Purchasing Power",
    tint: "#4B2354",
    categories: ["retirement", "fixed-income", "planning"],
    unit: "Planning Models",
  },
];

/**
 * The statutory or methodological tag stamped on each entry — what makes this
 * calculator different from a generic one. Falls back to nothing if a new
 * calculator is added to the registry before it gets a stamp.
 */
const stamps: Record<string, string> = {
  sip: "Monthly compound",
  lumpsum: "One-time",
  "mutual-fund": "SIP vs lumpsum",
  cagr: "Smoothed growth",
  xirr: "Annualised return",
  emi: "Reducing balance",
  loan: "Eligibility",
  fd: "Quarterly compound",
  rd: "Post office & bank",
  ppf: "Section 80C (EEE)",
  nps: "PFRDA regulated",
  retirement: "Corpus target",
  bond: "YTM & coupons",
  inflation: "CPI adjusted",
};

/** "SIP Calculator" → "SIP", so the foot line reads "Calculate SIP →". */
function shortName(name: string) {
  return name.replace(/\s*Calculator$/, "");
}

function Entry({ calc }: { calc: CalculatorDef }) {
  const stamp = stamps[calc.id];

  return (
    <Link href={calculatorPath(calc.id)} className="gazette-entry group">
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          {stamp ? <span className="stamp">{stamp}</span> : <span />}
          <ArrowRight
            aria-hidden="true"
            className="h-[15px] w-[15px] shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[var(--tint-ink)]"
          />
        </div>

        <h4 className="font-display text-base font-bold text-foreground transition-colors group-hover:text-[var(--tint-ink)]">
          {calc.name}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-ink-2">{calc.tagline}</p>
      </div>

      <p className="tint-text mt-3 border-t border-border pt-2 font-mono text-[11px] font-semibold">
        Calculate {shortName(calc.name)} →
      </p>
    </Link>
  );
}

export function GazetteIndex() {
  return (
    <div className="surface-lead grid grid-cols-1 divide-y divide-rule overflow-hidden md:grid-cols-2 md:divide-x lg:grid-cols-4 lg:divide-y-0">
      {desks.map((desk) => {
        const entries = desk.categories.flatMap((cat) =>
          calculators.filter((c) => c.category === cat)
        );
        if (entries.length === 0) return null;

        return (
          <div
            key={desk.no}
            className="gazette-col"
            style={{ "--tint": desk.tint } as CSSProperties}
          >
            <div className="gazette-head">
              <div className="flex items-center justify-between gap-2">
                <span className="tint-text font-mono text-xs font-bold">[{desk.no}]</span>
                <span className="font-mono text-[11px] uppercase text-muted-foreground">
                  {entries.length} {desk.unit}
                </span>
              </div>
              <h3 className="font-display text-base font-bold leading-snug text-foreground">
                {desk.title}
              </h3>
            </div>

            <div className="divide-y divide-border">
              {entries.map((calc) => (
                <Entry key={calc.id} calc={calc} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
