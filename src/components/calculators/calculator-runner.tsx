"use client";

import * as React from "react";
import { RotateCcw, Link2, Check, AlertTriangle } from "lucide-react";
import { getCalculator, type CalcField, type CalcOutput } from "@/lib/calculators/registry";
import { GrowthChart } from "@/components/calculators/growth-chart";
import { formatCurrency, formatCompactCurrency, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Values = Record<string, number | string>;

function formatOutput(value: number | string, kind: CalcOutput["kind"]) {
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return "—";
  switch (kind) {
    case "currency":
      return formatCurrency(value);
    case "percent":
      return `${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}%`;
    case "years":
      return `${value.toLocaleString("en-IN")} years`;
    default:
      return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }
}

const noopSubscribe = () => () => {};

/** Read any of this calculator's inputs from a query string (?key=value). */
function valuesFromSearch(search: string, fields: CalcField[], defaults: Values): Values {
  const params = new URLSearchParams(search);
  const out: Values = { ...defaults };
  for (const f of fields) {
    const raw = params.get(f.key);
    if (raw === null) continue;
    if (f.kind === "select") {
      if (f.options?.some((o) => o.value === raw)) out[f.key] = raw;
    } else {
      const n = Number(raw);
      if (Number.isFinite(n)) out[f.key] = clampToField(n, f);
    }
  }
  return out;
}

function clampToField(n: number, f: CalcField) {
  let v = n;
  if (f.min !== undefined) v = Math.max(f.min, v);
  if (f.max !== undefined) v = Math.min(f.max, v);
  return v;
}

export function CalculatorRunner({ id }: { id: string }) {
  // The definition lives in a plain module so the client can hold the compute
  // functions directly — functions cannot cross the server/client boundary.
  const def = getCalculator(id);

  // Shared scenario from the URL (empty on the server, so the static HTML shows defaults)
  const search = React.useSyncExternalStore(noopSubscribe, () => window.location.search, () => "");
  // null until the visitor changes something; then their edits take over
  const [edits, setEdits] = React.useState<Values | null>(null);
  const [copied, setCopied] = React.useState(false);
  const tracked = React.useRef(false);

  const values = React.useMemo<Values>(
    () => edits ?? (def ? (search ? valuesFromSearch(search, def.fields, def.defaults) : def.defaults) : {}),
    [edits, search, def]
  );

  // Keep the URL in sync so the current scenario can be shared or bookmarked
  React.useEffect(() => {
    if (!def || edits === null) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      for (const f of def.fields) {
        if (String(values[f.key]) !== String(def.defaults[f.key])) {
          params.set(f.key, String(values[f.key]));
        }
      }
      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }, 300);
    return () => clearTimeout(t);
  }, [def, values, edits]);

  const setValue = (key: string, value: number | string) => {
    if (!tracked.current && def) {
      tracked.current = true;
      trackEvent("calculator_interaction", { calculator_name: def.id });
    }
    setEdits({ ...values, [key]: value });
  };

  const reset = () => {
    if (def) setEdits(def.defaults);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (e.g. insecure context); ignore.
    }
  };

  const validation = React.useMemo(() => (def?.validate ? def.validate(values) : null), [def, values]);

  const outputs = React.useMemo(() => {
    if (!def || validation) return [];
    try {
      return def.compute(values);
    } catch {
      return [];
    }
  }, [def, values, validation]);

  const chartData = React.useMemo(() => {
    if (!def || !def.chart || validation) return null;
    try {
      const data = def.chart(values);
      return data.length > 1 ? data : null;
    } catch {
      return null;
    }
  }, [def, values, validation]);

  if (!def) return null;

  // The last emphasised output is the headline figure
  const headline = [...outputs].reverse().find((o) => o.emphasis) ?? outputs[outputs.length - 1];
  const rest = outputs.filter((o) => o !== headline);
  const base = outputs.find((o) => o.split === "base");
  const gain = outputs.find((o) => o.split === "gain");
  const showDonut =
    base && gain && typeof base.value === "number" && typeof gain.value === "number" && base.value > 0 && gain.value >= 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
      {/* ── Inputs ── */}
      <div className="surface p-6 md:p-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">Your inputs</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyLink}
              aria-label="Copy a link to this calculation"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Link2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy link"}</span>
            </button>
            <button
              type="button"
              onClick={reset}
              aria-label="Reset inputs"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {def.fields.map((field) => (
            <FieldControl
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(v) => setValue(field.key, v)}
            />
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="space-y-6" aria-live="polite">
        {validation ? (
          <div className="surface flex items-start gap-3 border-amber-500/40 bg-amber-500/10 p-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-foreground">Check your inputs</p>
              <p className="mt-1 text-sm text-muted-foreground">{validation}</p>
            </div>
          </div>
        ) : (
          <div className="surface overflow-hidden">
            {headline && (
              <div className="bg-panel px-6 py-7 text-white md:px-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7FD6B2]">
                      {headline.label}
                    </p>
                    <p className="tnum mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                      {formatOutput(headline.value, headline.kind)}
                    </p>
                    {headline.kind === "currency" &&
                      typeof headline.value === "number" &&
                      headline.value >= 100000 && (
                        <p className="mt-1 text-sm text-white/60">
                          ≈ {formatCompactCurrency(headline.value)}
                        </p>
                      )}
                  </div>
                  {showDonut && (
                    <Donut base={base.value as number} gain={gain.value as number} baseLabel={base.label} gainLabel={gain.label} />
                  )}
                </div>
              </div>
            )}

            <dl className="divide-y divide-border">
              {rest.map((out) => (
                <div key={out.label} className="flex items-center justify-between gap-4 px-6 py-4 md:px-8">
                  <dt className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    {out.split && (
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          out.split === "base" ? "bg-[#8FA7D6]" : "bg-[#3FB68B]"
                        )}
                      />
                    )}
                    {out.label}
                  </dt>
                  <dd
                    className={cn(
                      "tnum text-right font-semibold",
                      out.emphasis ? "text-lg" : "text-base",
                      out.tone === "positive" ? "text-success" : "text-foreground"
                    )}
                  >
                    {formatOutput(out.value, out.kind)}
                  </dd>
                </div>
              ))}
              {outputs.length === 0 && (
                <div className="px-6 py-6 text-sm text-muted-foreground">
                  Adjust the inputs to see an estimate.
                </div>
              )}
            </dl>
          </div>
        )}

        {chartData && (
          <div className="surface p-6 md:p-8">
            <h2 className="mb-5 text-lg font-bold text-foreground">Growth over time</h2>
            <GrowthChart
              data={chartData}
              labels={def.chartSeriesLabels ?? { invested: "Invested", value: "Value" }}
            />
          </div>
        )}

        <p className="text-xs leading-relaxed text-muted-foreground">
          Figures are estimates based on the inputs and assumptions shown. Actual outcomes will
          differ. This is not financial advice.
        </p>
      </div>
    </div>
  );
}

/** Two-part ring: base (navy) vs gain (green). */
function Donut({
  base,
  gain,
  baseLabel,
  gainLabel,
}: {
  base: number;
  gain: number;
  baseLabel: string;
  gainLabel: string;
}) {
  const total = base + gain;
  const gainShare = total > 0 ? gain / total : 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90" role="img" aria-label={`${gainLabel} is ${Math.round(gainShare * 100)}% of the total`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#8FA7D6" strokeWidth="14" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#3FB68B"
          strokeWidth="14"
          strokeDasharray={`${gainShare * c} ${c}`}
          className="transition-[stroke-dasharray] duration-500"
        />
      </svg>
      <div className="space-y-2 text-xs">
        <p className="flex items-center gap-2 text-white/80">
          <span className="h-2.5 w-2.5 rounded-full bg-[#8FA7D6]" />
          {baseLabel}
          <span className="tnum font-semibold text-white">{Math.round((1 - gainShare) * 100)}%</span>
        </p>
        <p className="flex items-center gap-2 text-white/80">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3FB68B]" />
          {gainLabel}
          <span className="tnum font-semibold text-white">{Math.round(gainShare * 100)}%</span>
        </p>
      </div>
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: CalcField;
  value: number | string | undefined;
  onChange: (v: number | string) => void;
}) {
  const numericValue = Number(value);

  // Local draft so partial input like "7." or "" can be typed freely
  const [draft, setDraft] = React.useState<string | null>(null);

  if (field.kind === "select") {
    return (
      <div>
        <p id={`${field.key}-label`} className="mb-3 block text-sm font-semibold text-foreground">
          {field.label}
        </p>
        <div role="radiogroup" aria-labelledby={`${field.key}-label`} className="flex flex-wrap gap-2">
          {field.options?.map((o) => {
            const active = String(value) === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(o.value)}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-sm font-medium transition-all",
                  active
                    ? "border-brand bg-brand/10 text-foreground shadow-[inset_0_0_0_1px_var(--brand)]"
                    : "border-border text-muted-foreground hover:border-brand/50 hover:text-foreground"
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>
        {field.help && <p className="mt-2 text-xs text-muted-foreground">{field.help}</p>}
      </div>
    );
  }

  const hasRange = field.min !== undefined && field.max !== undefined;
  const shown =
    draft ??
    (Number.isFinite(numericValue)
      ? field.kind === "currency"
        ? numericValue.toLocaleString("en-IN")
        : String(numericValue)
      : "");

  const pct = hasRange
    ? ((Math.min(Math.max(numericValue, field.min!), field.max!) - field.min!) / (field.max! - field.min!)) * 100
    : 0;

  const commit = () => {
    if (draft === null) return;
    const n = Number(draft.replace(/,/g, ""));
    onChange(clampToField(Number.isFinite(n) && draft.trim() !== "" ? n : field.min ?? 0, field));
    setDraft(null);
  };

  const unit =
    field.kind === "percent" ? "%" : field.kind === "years" ? "yrs" : field.kind === "age" ? "yrs" : null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <label htmlFor={field.key} className="text-sm font-semibold text-foreground">
          {field.label}
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1.5 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25">
          {field.kind === "currency" && <span className="text-sm font-semibold text-muted-foreground">₹</span>}
          <input
            id={field.key}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={shown}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.,]/g, "");
              setDraft(raw);
              const n = Number(raw.replace(/,/g, ""));
              // Update live while typing, but only with in-range values
              if (raw !== "" && Number.isFinite(n) && (!hasRange || (n >= field.min! && n <= field.max!))) {
                onChange(n);
              }
            }}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            className="tnum w-28 bg-transparent text-right text-base font-bold text-foreground focus:outline-none"
          />
          {unit && <span className="text-xs font-semibold text-muted-foreground">{unit}</span>}
        </div>
      </div>

      {hasRange && (
        <input
          type="range"
          aria-label={field.label}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          value={Number.isFinite(numericValue) ? numericValue : (field.min as number)}
          onChange={(e) => {
            setDraft(null);
            onChange(Number(e.target.value));
          }}
          className="range"
          style={{ "--pct": `${pct}%` } as React.CSSProperties}
        />
      )}

      <div className="mt-2 flex items-start justify-between gap-3">
        {field.help ? <p className="text-xs leading-relaxed text-muted-foreground">{field.help}</p> : <span />}
        {hasRange && (
          <span className="tnum shrink-0 text-[11px] text-muted-foreground">
            {formatBound(field.min as number, field.kind)} – {formatBound(field.max as number, field.kind)}
          </span>
        )}
      </div>
    </div>
  );
}

function formatBound(v: number, kind: CalcField["kind"]) {
  if (kind === "currency") {
    if (v >= 10000000) return `₹${+(v / 10000000).toFixed(1)}Cr`;
    if (v >= 100000) return `₹${+(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `₹${+(v / 1000).toFixed(0)}k`;
    return `₹${v}`;
  }
  if (kind === "percent") return `${v}%`;
  return String(v);
}
