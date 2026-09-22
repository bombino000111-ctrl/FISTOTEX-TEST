import type { ChartPoint } from "@/lib/calculators/registry";
import { formatCompactCurrency } from "@/lib/utils";

/**
 * Dependency-free area chart (no recharts) so calculator pages stay light.
 * Renders two series: amount invested vs projected value.
 */
export function GrowthChart({
  data,
  labels = { invested: "Invested", value: "Value" },
}: {
  data: ChartPoint[];
  labels?: { invested: string; value: string };
}) {
  if (!data || data.length < 2) return null;

  const W = 720;
  const H = 260;
  const pad = { top: 16, right: 16, bottom: 28, left: 60 };

  const peak = Math.max(...data.map((d) => Math.max(d.value, d.invested)), 1);
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const x = (i: number) => pad.left + (i / (data.length - 1)) * innerW;
  const y = (v: number) => pad.top + innerH - (v / peak) * innerH;

  const line = (get: (d: ChartPoint) => number) =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(get(d)).toFixed(1)}`).join(" ");

  const investedLine = line((d) => d.invested);
  const valueLine = line((d) => d.value);
  const valueArea = `${valueLine} L${x(data.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

  // 3 horizontal gridlines
  const gridValues = [0, peak / 2, peak];

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${labels.value} compared with ${labels.invested} over time`}
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="gc-value" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
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
            />
            <text
              x={pad.left - 8}
              y={y(gv) + 4}
              textAnchor="end"
              fontSize="11"
              fill="var(--muted-foreground)"
            >
              {formatCompactCurrency(gv)}
            </text>
          </g>
        ))}

        <path d={valueArea} fill="url(#gc-value)" />
        <path
          d={investedLine}
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <path d={valueLine} fill="none" stroke="var(--accent)" strokeWidth="2.5" />

        {data.map((d, i) =>
          i % Math.ceil(data.length / 8) === 0 || i === data.length - 1 ? (
            <text
              key={i}
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fill="var(--muted-foreground)"
            >
              {d.label}
            </text>
          ) : null
        )}
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full bg-accent" />
          {labels.value}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full border-t-2 border-dashed border-muted-foreground" />
          {labels.invested}
        </span>
      </div>
    </div>
  );
}
