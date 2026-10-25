import * as React from "react";

export interface RosettePoint {
  invested: number;
  value: number;
}

/*
  A guilloche rosette, drawn the way the fine-line security pattern on a
  rupee note is: concentric braided rings, each made of two sine strands in
  opposite phase.

  The pattern is the data. One ring per year; its radius grows with the
  square root of the balance (so the area it encloses tracks the money), and
  its ink shifts from lavender (money you put in) to turmeric (growth) as
  returns overtake contributions.
*/

const C = 100; // centre of the 200×200 viewBox
const R_INNER = 20;
const R_OUTER = 94;
const PETALS = 24;
const STEPS = 180;

function strand(radius: number, amp: number, petals: number, phase: number) {
  let d = "";
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * Math.PI * 2;
    const r = radius + amp * Math.sin(petals * t + phase);
    const x = C + r * Math.cos(t);
    const y = C + r * Math.sin(t);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d + "Z";
}

/** Ink for a ring: lavender at 0% growth, turmeric at 100%. */
function ink(growthShare: number) {
  const pct = Math.round(Math.min(1, Math.max(0, growthShare)) * 100);
  return `color-mix(in oklab, var(--growth) ${pct}%, var(--principal))`;
}

export function Rosette({
  series,
  label,
  engrave = false,
  className,
}: {
  /** Year-by-year balances, starting at year 0 */
  series: RosettePoint[];
  /** Text alternative describing what the rosette shows */
  label: string;
  /** Draw the rings in on first paint (the hero's one orchestrated moment) */
  engrave?: boolean;
  className?: string;
}) {
  const rings = React.useMemo(() => {
    const years = series.slice(1);
    const max = years.length ? years[years.length - 1].value : 0;
    if (!years.length || max <= 0) return [];
    const spacing = (R_OUTER - R_INNER) / years.length;
    const amp = Math.min(3.2, Math.max(0.9, spacing * 0.85));
    return years.map((p, i) => {
      const radius = R_INNER + (R_OUTER - R_INNER - amp) * Math.sqrt(Math.max(0, p.value) / max);
      const share = p.value > 0 ? (p.value - p.invested) / p.value : 0;
      // A slight per-ring twist keeps neighbouring braids from lining up into stripes
      const twist = (i * Math.PI) / (PETALS * 3);
      return {
        key: i,
        stroke: ink(share),
        a: strand(radius, amp, PETALS, twist),
        b: strand(radius, amp, PETALS, twist + Math.PI),
      };
    });
  }, [series]);

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={label}
      className={className}
    >
      <g fill="none" strokeWidth="0.55" strokeLinejoin="round" className={engrave ? "rosette-engrave" : undefined}>
        {/* Centre medallion in plain ink, like the seal at a note's heart */}
        <path d={strand(11, 5.5, 7, 0)} stroke="var(--foreground)" strokeWidth="0.7" pathLength={engrave ? 1 : undefined} />
        <path d={strand(11, 5.5, 7, Math.PI)} stroke="var(--foreground)" strokeWidth="0.7" pathLength={engrave ? 1 : undefined} />
        {rings.map((r) => (
          <g key={r.key} style={{ stroke: r.stroke, "--ring": r.key } as React.CSSProperties}>
            <path d={r.a} pathLength={engrave ? 1 : undefined} />
            <path d={r.b} pathLength={engrave ? 1 : undefined} />
          </g>
        ))}
      </g>
    </svg>
  );
}
