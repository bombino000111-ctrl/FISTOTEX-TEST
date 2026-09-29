"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Wallet } from "lucide-react";
import { calculateSIP } from "@/lib/calculators";
import { formatCurrency, formatCompactCurrency } from "@/lib/utils";

const RETURN_RATE = 12;

/** Smoothly tween a number towards its target for a lively readout. */
function useTweened(target: number, ms = 450) {
  const [value, setValue] = React.useState(target);
  const from = React.useRef(target);

  React.useEffect(() => {
    const start = performance.now();
    const initial = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = initial + (target - initial) * eased;
      from.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}

/**
 * The blotter: a working SIP ledger that sits in the masthead spine.
 * Deliberately physical — ruled box, slated dark readout, a split bar that
 * shows capital against compounded growth rather than an abstract curve.
 */
export function HeroCalculator() {
  const [monthly, setMonthly] = React.useState(10000);
  const [years, setYears] = React.useState(15);

  const result = calculateSIP({ monthlyInvestment: monthly, annualReturn: RETURN_RATE, years });
  const shown = useTweened(result.futureValue);

  const gainPct =
    result.futureValue > 0 ? Math.round((result.estimatedReturns / result.futureValue) * 100) : 0;
  const principalPct = 100 - gainPct;

  const pctMonthly = ((monthly - 1000) / (100000 - 1000)) * 100;
  const pctYears = ((years - 1) / (30 - 1)) * 100;

  return (
    <div className="surface-lead p-6 shadow-[0_4px_20px_-4px_rgb(0_0_0/0.06)] sm:p-7">
      {/* Blotter header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
        <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          Physical SIP Blotter
        </span>
        <span className="rounded-sm border border-accent/20 bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-bold text-accent">
          {RETURN_RATE.toFixed(1)}% P.A. COMPOUND
        </span>
      </div>

      {/* Slated readout */}
      <div className="ledger my-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-wider text-panel-accent">
              Projected maturity corpus ({years} {years === 1 ? "yr" : "yrs"})
            </p>
            <p
              className="font-display tnum mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              aria-live="polite"
            >
              {formatCurrency(shown)}
            </p>
          </div>
          <Wallet aria-hidden="true" className="h-6 w-6 shrink-0 text-panel-accent/60" />
        </div>

        {/* Compounding ladder */}
        <div className="mt-4 border-t border-panel-rule pt-3">
          <div className="mb-1.5 flex flex-wrap justify-between gap-x-3 gap-y-1 font-mono text-[11px] text-white/70">
            <span>
              Capital:{" "}
              <strong className="tnum font-semibold text-white">
                {formatCompactCurrency(result.totalInvested)}
              </strong>
            </span>
            <span className="tnum font-bold text-panel-accent">
              Gains: {gainPct}% ({formatCompactCurrency(result.estimatedReturns)})
            </span>
          </div>

          <div
            className="flex h-3 w-full overflow-hidden rounded-sm bg-white/10"
            role="img"
            aria-label={`${principalPct}% principal invested, ${gainPct}% compounded growth`}
          >
            <div
              className="h-full bg-amber-warm transition-[width] duration-500"
              style={{ width: `${principalPct}%` }}
            />
            <div
              className="h-full bg-accent transition-[width] duration-500"
              style={{ width: `${gainPct}%` }}
            />
          </div>

          <div className="mt-1 flex justify-between font-mono text-[10px] text-white/55">
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true" className="inline-block h-2 w-2 bg-amber-warm" />
              Principal invested
            </span>
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true" className="inline-block h-2 w-2 bg-accent" />
              Compounded growth
            </span>
          </div>
        </div>
      </div>

      {/* Tactile controls */}
      <div className="space-y-4 pt-1">
        <div>
          <div className="mb-1 flex items-center justify-between font-mono text-xs font-medium text-foreground">
            <label htmlFor="hero-monthly">MONTHLY COMMITMENT</label>
            <span className="tnum text-sm font-bold text-accent">{formatCurrency(monthly)} / mo</span>
          </div>
          <input
            id="hero-monthly"
            type="range"
            min={1000}
            max={100000}
            step={1000}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="range"
            style={{ "--pct": `${pctMonthly}%` } as React.CSSProperties}
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>₹1,000</span>
            <span>₹50,000</span>
            <span>₹1,00,000</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between font-mono text-xs font-medium text-foreground">
            <label htmlFor="hero-years">INVESTMENT HORIZON</label>
            <span className="tnum text-sm font-bold text-accent">
              {years} {years === 1 ? "Year" : "Years"}
            </span>
          </div>
          <input
            id="hero-years"
            type="range"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="range"
            style={{ "--pct": `${pctYears}%` } as React.CSSProperties}
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>1 Year</span>
            <span>15 Years</span>
            <span>30 Years</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <Link
          href={`/calculators/sip?monthlyInvestment=${monthly}&years=${years}`}
          className="btn-ghost w-full bg-muted px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide"
        >
          Open full mathematical breakdown
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
