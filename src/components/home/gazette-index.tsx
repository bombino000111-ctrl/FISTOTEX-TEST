import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import {
  calculators,
  calculatorPath,
  categories,
  type CalculatorDef,
  type CategoryId,
} from "@/lib/calculators/registry";

/**
 * The four desks a new visitor reaches for first. Surfaced above the full
 * directory so the homepage doesn't present all 14 tools with equal weight —
 * most readers only ever need one of these four.
 */
const popularIds = ["sip", "emi", "fd", "lumpsum"];

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
  /** Plural noun for the count line, e.g. "5 calculators". */
  unit: string;
}> = [
  {
    no: "01",
    title: "Investing & growth",
    tint: "#0B6E4F",
    categories: ["investment"],
    unit: "calculators",
  },
  {
    no: "02",
    title: "Loans & borrowing",
    tint: "#34507F",
    categories: ["loans"],
    unit: "calculators",
  },
  {
    no: "03",
    title: "Safe savings",
    tint: "#A2560B",
    categories: ["savings"],
    unit: "calculators",
  },
  {
    no: "04",
    title: "Retirement & planning",
    tint: "#7A3E6C",
    categories: ["retirement", "fixed-income", "planning"],
    unit: "calculators",
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
        {/* Tagline trimmed to one line — the stamp + name already tell most
            readers what this does. It stays clamped on hover so the column
            never jumps under the pointer. */}
        <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-ink-2">
          {calc.tagline}
        </p>
      </div>

      <p className="tint-text mt-3 border-t border-border pt-2 font-mono text-[11px] font-semibold">
        Calculate {shortName(calc.name)} →
      </p>
    </Link>
  );
}

/** A promoted card for one of the four calculators most readers want first. */
function PopularCard({ calc }: { calc: CalculatorDef }) {
  const category = categories.find((c) => c.id === calc.category);
  const tint = category?.tint ?? "#0A5C36";
  const stamp = stamps[calc.id];

  return (
    <Link
      href={calculatorPath(calc.id)}
      className="surface surface-link group flex flex-col gap-2 p-5"
      style={{ "--tint": tint } as CSSProperties}
    >
      <div className="flex items-center justify-between gap-2">
        {stamp ? <span className="stamp">{stamp}</span> : <span />}
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[var(--tint-ink)]"
        />
      </div>
      <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-[var(--tint-ink)]">
        {shortName(calc.name)}
      </h3>
      <p className="line-clamp-2 text-xs leading-relaxed text-ink-2">{calc.tagline}</p>
    </Link>
  );
}

export function GazetteIndex() {
  const popular = popularIds
    .map((id) => calculators.find((c) => c.id === id))
    .filter((c): c is CalculatorDef => Boolean(c));

  return (
    <div className="space-y-10">
      {/* Most-used desk — promoted above the full directory so a first-time
          visitor sees the four calculators they're most likely to want
          before the dense category listing below. */}
      {popular.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" aria-hidden="true" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
              Most used by readers
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((calc) => (
              <PopularCard key={calc.id} calc={calc} />
            ))}
          </div>
        </div>
      )}

      {/* Full directory, by desk */}
      <div>
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Browse the full directory
        </p>
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
      </div>
    </div>
  );
}
