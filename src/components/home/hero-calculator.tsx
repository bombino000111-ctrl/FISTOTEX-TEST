"use client";

import * as React from "react";
import Link from "next/link";
import { Rosette, type RosettePoint } from "@/components/calculators/rosette";
import { formatCurrency, formatCompactCurrency } from "@/lib/utils";

const RETURN_RATE = 12;
const MONTHLY = { min: 1000, max: 100000, step: 500 };
const YEARS = { min: 1, max: 40, step: 1 };

/** SIP balance at the end of each year (payments at the start of each month). */
function sipSeries(monthly: number, years: number): RosettePoint[] {
  const i = RETURN_RATE / 12 / 100;
  const out: RosettePoint[] = [];
  for (let y = 0; y <= years; y++) {
    const n = y * 12;
    out.push({
      invested: monthly * n,
      value: n === 0 ? 0 : monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i),
    });
  }
  return out;
}

const lakh = (v: number) => formatCompactCurrency(Math.round(v)).replace(" Lakh", " lakh").replace(" Crore", " crore");

/**
 * The homepage hero: a working SIP whose result is engraved as a rosette.
 * `children` is the headline block, rendered on the server and placed beside
 * the controls.
 */
export function HeroCalculator({ children }: { children: React.ReactNode }) {
  const [monthly, setMonthly] = React.useState(10000);
  const [years, setYears] = React.useState(15);

  const series = React.useMemo(() => sipSeries(monthly, years), [monthly, years]);
  const final = series[series.length - 1];
  const growth = final.value - final.invested;

  const pct = (v: number, r: { min: number; max: number }) => ((v - r.min) / (r.max - r.min)) * 100;

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
      <div className="max-w-xl">
        {children}

        <div className="mt-10 space-y-7">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="hero-monthly" className="text-sm font-medium text-ink-2">
                Each month
              </label>
              <output htmlFor="hero-monthly" className="tnum font-display text-2xl text-foreground">
                {formatCurrency(monthly)}
              </output>
            </div>
            <input
              id="hero-monthly"
              type="range"
              min={MONTHLY.min}
              max={MONTHLY.max}
              step={MONTHLY.step}
              value={monthly}
              aria-valuetext={formatCurrency(monthly)}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="range mt-2"
              style={{ "--pct": `${pct(monthly, MONTHLY)}%` } as React.CSSProperties}
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="hero-years" className="text-sm font-medium text-ink-2">
                For
              </label>
              <output htmlFor="hero-years" className="tnum font-display text-2xl text-foreground">
                {years} {years === 1 ? "year" : "years"}
              </output>
            </div>
            <input
              id="hero-years"
              type="range"
              min={YEARS.min}
              max={YEARS.max}
              step={YEARS.step}
              value={years}
              aria-valuetext={`${years} years`}
              onChange={(e) => setYears(Number(e.target.value))}
              className="range mt-2"
              style={{ "--pct": `${pct(years, YEARS)}%` } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={`/calculators/sip#monthlyInvestment=${monthly}&years=${years}`}
            className="btn-brand min-h-12 px-6 text-base"
          >
            Open the full SIP calculator
          </Link>
          <p className="text-sm text-muted-foreground">
            Assumes {RETURN_RATE}% a year. You can change it there.
          </p>
        </div>
      </div>

      {/* The engraving */}
      <figure className="mx-auto w-full max-w-[30rem]">
        <Rosette
          series={series}
          engrave
          label={`Rosette with ${years} rings, one per year. Inner rings are mostly money put in; outer rings are mostly growth.`}
          className="aspect-square w-full"
        />
        <figcaption className="mt-6 text-center">
          <span className="block text-sm text-muted-foreground">
            After {years} {years === 1 ? "year" : "years"}
          </span>
          <span className="tnum font-display mt-1 block text-5xl text-foreground sm:text-6xl" aria-hidden="true">
            {formatCurrency(final.value)}
          </span>
          {/* Announced once per change, not on every frame of a drag */}
          <span className="sr-only" aria-live="polite">
            After {years} years: {formatCurrency(final.value)}
          </span>
          <span className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-ink-2">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-principal" />
              {lakh(final.invested)} you put in
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-growth" />
              <span className="font-semibold text-growth-ink">{lakh(growth)}</span> of growth
            </span>
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
