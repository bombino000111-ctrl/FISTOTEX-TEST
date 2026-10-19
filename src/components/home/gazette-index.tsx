import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, TrendingUp } from "lucide-react";
import {
  calculators,
  calculatorPath,
  categories,
  type CalculatorDef,
} from "@/lib/calculators/registry";

/**
 * The four desks a new visitor reaches for first. Given featured 2x2 bento
 * modules so a first-time visitor sees the four calculators they're most
 * likely to want before the denser directory around them.
 */
const popularIds = ["sip", "emi", "fd", "lumpsum"];

/**
 * A couple of calculators with enough editorial weight — comparison logic,
 * a longer-horizon decision — to earn a taller 1x2 module instead of
 * competing for attention at the same size as every other entry. Picked for
 * rhythm, not randomly: one investment-side comparison, one retirement-side
 * planning tool.
 */
const tallIds = ["mutual-fund", "retirement"];

/** Print order for the whole directory grid. Featured and tall modules are
 * interleaved with compact ones so the dense auto-flow fills gaps with
 * varied silhouettes rather than clumping all the big blocks together. */
const printOrder = [
  "sip",
  "emi",
  "mutual-fund",
  "cagr",
  "xirr",
  "fd",
  "lumpsum",
  "loan",
  "retirement",
  "rd",
  "ppf",
  "nps",
  "bond",
  "inflation",
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

/** A featured 2x2 bento module for one of the four calculators most readers
 * want first. */
function FeaturedTile({ calc }: { calc: CalculatorDef }) {
  const Icon = calc.icon;
  const category = categories.find((c) => c.id === calc.category);
  const tint = category?.tint ?? "#0A5C36";
  const stamp = stamps[calc.id];

  return (
    <Link
      href={calculatorPath(calc.id)}
      className="bento-featured surface surface-link group flex flex-col justify-between gap-4 p-6"
      style={{ "--tint": tint } as CSSProperties}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="icon-tile h-12 w-12 shrink-0">
          <Icon className="h-6 w-6" />
        </span>
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
          <TrendingUp className="h-3 w-3" aria-hidden="true" />
          Most used
        </div>
      </div>

      <div>
        {stamp && <span className="stamp mb-2 inline-flex">{stamp}</span>}
        <h3 className="font-display text-xl font-bold text-foreground transition-colors group-hover:text-[var(--tint-ink)] sm:text-2xl">
          {shortName(calc.name)}
        </h3>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-2">{calc.tagline}</p>
      </div>

      <p className="tint-text mt-auto flex items-center gap-1.5 border-t border-border pt-3 font-mono text-[11px] font-semibold">
        Calculate {shortName(calc.name)}
        <ArrowRight
          aria-hidden="true"
          className="h-[13px] w-[13px] transition-transform group-hover:translate-x-0.5"
        />
      </p>
    </Link>
  );
}

/** A taller 1x2 bento module for calculators with enough to say to earn the
 * extra vertical room. */
function TallTile({ calc }: { calc: CalculatorDef }) {
  const Icon = calc.icon;
  const category = categories.find((c) => c.id === calc.category);
  const tint = category?.tint ?? "#0A5C36";
  const stamp = stamps[calc.id];

  return (
    <Link
      href={calculatorPath(calc.id)}
      className="bento-tall surface surface-link group flex flex-col justify-between gap-3 p-5"
      style={{ "--tint": tint } as CSSProperties}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="icon-tile h-10 w-10 shrink-0">
          <Icon className="h-5 w-5" />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[var(--tint-ink)]"
        />
      </div>

      <div className="flex-1">
        <p className="tint-text text-[11px] font-bold uppercase tracking-wider">
          {category?.name}
        </p>
        <h3 className="font-display mt-1 text-lg font-bold text-foreground transition-colors group-hover:text-[var(--tint-ink)]">
          {shortName(calc.name)}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{calc.tagline}</p>
      </div>

      {stamp && <span className="stamp self-start">{stamp}</span>}
    </Link>
  );
}

/** A self-contained 1x1 bento module for the remaining calculators. */
function CompactTile({ calc }: { calc: CalculatorDef }) {
  const Icon = calc.icon;
  const category = categories.find((c) => c.id === calc.category);
  const tint = category?.tint ?? "#0A5C36";
  const stamp = stamps[calc.id];

  return (
    <Link
      href={calculatorPath(calc.id)}
      className="bento-compact surface surface-link group flex flex-col gap-2 p-4"
      style={{ "--tint": tint } as CSSProperties}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="icon-tile h-8 w-8 shrink-0">
          <Icon className="h-4 w-4" />
        </span>
        <ArrowRight
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[var(--tint-ink)]"
        />
      </div>

      <div>
        <h4 className="font-display text-sm font-bold text-foreground transition-colors group-hover:text-[var(--tint-ink)]">
          {shortName(calc.name)}
        </h4>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-2">{calc.tagline}</p>
      </div>

      {stamp && <span className="stamp mt-auto self-start">{stamp}</span>}
    </Link>
  );
}

export function GazetteIndex() {
  const byId = new Map(calculators.map((c) => [c.id, c] as const));

  const tiles = printOrder
    .map((id) => byId.get(id))
    .filter((c): c is CalculatorDef => Boolean(c));

  return (
    <div className="bento-grid">
      {tiles.map((calc) => {
        if (popularIds.includes(calc.id)) {
          return <FeaturedTile key={calc.id} calc={calc} />;
        }
        if (tallIds.includes(calc.id)) {
          return <TallTile key={calc.id} calc={calc} />;
        }
        return <CompactTile key={calc.id} calc={calc} />;
      })}
    </div>
  );
}
