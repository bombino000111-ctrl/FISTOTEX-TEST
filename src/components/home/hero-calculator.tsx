"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
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

export function HeroCalculator() {
  const [monthly, setMonthly] = React.useState(10000);
  const [years, setYears] = React.useState(15);

  const result = calculateSIP({ monthlyInvestment: monthly, annualReturn: RETURN_RATE, years });
  const shown = useTweened(result.futureValue);
  const gainShare = result.futureValue > 0 ? result.estimatedReturns / result.futureValue : 0;

  // Mini bar series: value at each tenth of the horizon
  const bars = Array.from({ length: 10 }, (_, i) => {
    const y = ((i + 1) / 10) * years;
    return calculateSIP({ monthlyInvestment: monthly, annualReturn: RETURN_RATE, years: y }).futureValue;
  });
  const peak = Math.max(...bars, 1);

  const pctMonthly = ((monthly - 500) / (100000 - 500)) * 100;
  const pctYears = ((years - 1) / (40 - 1)) * 100;

  return (
    <div className="relative">
      <div className="surface p-6 shadow-[0_12px_32px_-18px_rgb(0_0_0/0.3)] md:p-7">
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <Calculator className="h-4 w-4 text-accent" />
            Quick SIP estimate
          </p>
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
            @ {RETURN_RATE}% p.a.
          </span>
        </div>

        <div className="mt-5 rounded-lg bg-panel p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7FD6B2]">
            Estimated value in {years} years
          </p>
          <p className="tnum mt-1 text-4xl font-bold tracking-tight" aria-live="polite">
            {formatCurrency(shown)}
          </p>
          <p className="mt-1 text-sm text-white/60">
            You invest {formatCompactCurrency(result.totalInvested)} · gains{" "}
            <span className="font-semibold text-[#7FD6B2]">{Math.round(gainShare * 100)}%</span> of the total
          </p>

          <div className="mt-5 flex h-20 items-end gap-1.5" aria-hidden="true">
            {bars.map((b, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-[#3FB68B] transition-[height] duration-500"
                style={{ height: `${Math.max(6, (b / peak) * 100)}%` }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <label htmlFor="hero-monthly" className="font-semibold text-foreground">Monthly SIP</label>
              <span className="tnum font-bold text-foreground">{formatCurrency(monthly)}</span>
            </div>
            <input
              id="hero-monthly"
              type="range"
              min={500}
              max={100000}
              step={500}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="range"
              style={{ "--pct": `${pctMonthly}%` } as React.CSSProperties}
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <label htmlFor="hero-years" className="font-semibold text-foreground">Duration</label>
              <span className="tnum font-bold text-foreground">{years} years</span>
            </div>
            <input
              id="hero-years"
              type="range"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="range"
              style={{ "--pct": `${pctYears}%` } as React.CSSProperties}
            />
          </div>
        </div>

        <Link
          href={`/toolkit/finance-calculator/sip?monthlyInvestment=${monthly}&years=${years}`}
          className="btn-ghost mt-6 w-full py-3 text-sm"
        >
          Open full SIP calculator
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
