"use client";

import * as React from "react";
import type { ChartPoint } from "@/lib/calculators/registry";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";

/**
 * Dependency-free area chart (no recharts) so calculator pages stay light.
 * Two series — amount invested vs projected value — with a hover/touch readout.
 */
export function GrowthChart({
  data,
  labels = { invested: "Invested", value: "Value" },
}: {
  data: ChartPoint[];
  labels?: { invested: string; value: string };
}) {
  const [hover, setHover] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  if (!data || data.length < 2) return null;

  const W = 720;
  const H = 280;
  const pad = { top: 16, right: 16, bottom: 30, left: 72 };

  const peak = Math.max(...data.map((d) => Math.max(d.value, d.invested)), 1);
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const x = (i: number) => pad.left + (i / (data.length - 1)) * innerW;
  const y = (v: number) => pad.top + innerH - (v / peak) * innerH;

  const line = (get: (d: ChartPoint) => number) =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(get(d)).toFixed(1)}`).join(" ");

  const investedLine = line((d) => d.invested);
  const valueLine = line((d) => d.value);
  const area = (l: string) => `${l} L${x(data.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

  const gridValues = [0, peak / 4, peak / 2, (peak * 3) / 4, peak];

  const onMove = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - pad.left) / innerW) * (data.length - 1));
    setHover(Math.min(data.length - 1, Math.max(0, i)));
  };

  const active = hover ?? data.length - 1;
  const point = data[active];

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg bg-muted/60 px-4 py-2.5 text-xs">
        <span className="font-bold text-foreground">
          {hover === null ? "At the end" : `Year ${point.label.replace("Y", "")}`}
        </span>
        <span className="tnum flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-brand" />
          {labels.value}: <span className="font-semibold text-foreground">{formatCurrency(point.value)}</span>
        </span>
        <span className="tnum flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-brand-3" />
          {labels.invested}: <span className="font-semibold text-foreground">{formatCurrency(point.invested)}</span>
        </span>
      </div>
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`${labels.value} compared with ${labels.invested} over time`}
          className="h-auto w-full touch-pan-y select-none"
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={(e) => onMove(e.clientX)}
          onMouseLeave={() => setHover(null)}
          onTouchStart={(e) => onMove(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={() => setHover(null)}
        >
          <defs>
            <linearGradient id="gc-value" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.14" />
            </linearGradient>
            <linearGradient id="gc-invested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-3)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--brand-3)" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {gridValues.map((gv, i) => (
            <g key={i}>
              <line
                x1={pad.left}
                x2={W - pad.right}
                y1={y(gv)}
                y2={y(gv)}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray={i === 0 ? undefined : "3 5"}
              />
              <text x={pad.left - 10} y={y(gv) + 4} textAnchor="end" fontSize="11" fill="var(--muted-foreground)">
                {formatCompactCurrency(gv).replace(" Crore", " Cr").replace(" Lakh", " L")}
              </text>
            </g>
          ))}

          <path d={area(valueLine)} fill="url(#gc-value)" />
          <path d={area(investedLine)} fill="url(#gc-invested)" />
          <path d={investedLine} fill="none" stroke="var(--brand-3)" strokeWidth="2" strokeDasharray="6 5" />
          <path d={valueLine} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" />

          {/* Crosshair */}
          <line
            x1={x(active)}
            x2={x(active)}
            y1={pad.top}
            y2={pad.top + innerH}
            stroke="var(--muted-foreground)"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <circle cx={x(active)} cy={y(point.invested)} r="4.5" fill="var(--card)" stroke="var(--brand-3)" strokeWidth="2.5" />
          <circle cx={x(active)} cy={y(point.value)} r="5.5" fill="var(--card)" stroke="var(--brand)" strokeWidth="3" />

          {data.map((d, i) =>
            i % Math.ceil(data.length / 8) === 0 || i === data.length - 1 ? (
              <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
                {d.label}
              </text>
            ) : null
          )}
        </svg>

      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-1 w-5 rounded-full bg-brand" />
          {labels.value}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-5 border-t-2 border-dashed border-brand-3" />
          {labels.invested}
        </span>
      </div>
    </div>
  );
}
