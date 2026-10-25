"use client";

import * as React from "react";
import { RotateCcw, Link2, Check, AlertTriangle, Bookmark, BookmarkCheck } from "lucide-react";
import { getCalculator, type CalcField } from "@/lib/calculators/registry";
import { GrowthChart } from "@/components/calculators/growth-chart";
import { formatCompactCurrency, cn } from "@/lib/utils";
import { formatOutput } from "@/lib/calculators/format";
import { trackEvent } from "@/lib/analytics";
import { nextStepsFor } from "@/lib/calculators/next-steps";
import { recordRecent, saveScenario } from "@/lib/scenarios";
import { NextSteps, SavedScenarios } from "@/components/calculators/result-extras";

type Values = Record<string, number | string>;

const noopSubscribe = () => () => {};

/** Read any of this calculator's inputs from a "key=value&…" string (hash, or a legacy query string). */
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

/** Years and ages are whole numbers: the formulas count whole deposits and periods. */
function isWholeField(f: CalcField) {
  return f.kind === "years" || f.kind === "age";
}

function clampToField(n: number, f: CalcField) {
  let v = isWholeField(f) ? Math.round(n) : n;
  if (f.min !== undefined) v = Math.max(f.min, v);
  if (f.max !== undefined) v = Math.min(f.max, v);
  return v;
}

export function CalculatorRunner({ id }: { id: string }) {
  // The definition lives in a plain module so the client can hold the compute
  // functions directly — functions cannot cross the server/client boundary.
  const def = getCalculator(id);

  // Shared scenario from the URL (empty on the server, so the static HTML shows defaults).
  // Scenarios live in the hash: browsers never send it to any server, so the
  // numbers stay out of analytics, ad requests and referrers. Older links used
  // the query string, which is still read.
  const search = React.useSyncExternalStore(
    noopSubscribe,
    () => window.location.hash.slice(1) || window.location.search,
    () => ""
  );
  // null until the visitor changes something; then their edits take over
  const [edits, setEdits] = React.useState<Values | null>(null);
  const [copied, setCopied] = React.useState<"idle" | "done" | "failed">("idle");
  const [saved, setSaved] = React.useState(false);
  const tracked = React.useRef(false);

  const values = React.useMemo<Values>(
    () => edits ?? (def ? (search ? valuesFromSearch(search, def.fields, def.defaults) : def.defaults) : {}),
    [edits, search, def]
  );

  // Only values that differ from the defaults go into a shared link
  const scenarioQuery = React.useMemo(() => {
    if (!def) return "";
    const params = new URLSearchParams();
    for (const f of def.fields) {
      if (String(values[f.key]) !== String(def.defaults[f.key])) {
        params.set(f.key, String(values[f.key]));
      }
    }
    return params.toString();
  }, [def, values]);

  // Move a legacy ?query scenario into the hash straight away
  React.useEffect(() => {
    if (window.location.search && !window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}#${window.location.search.slice(1)}`);
    }
  }, []);

  // Keep the URL in sync so the current scenario can be shared or bookmarked
  React.useEffect(() => {
    if (!def || edits === null) return;
    const t = setTimeout(() => {
      window.history.replaceState(null, "", `${window.location.pathname}${scenarioQuery ? `#${scenarioQuery}` : ""}`);
      // Remembered so the homepage can offer "pick up where you left off"
      recordRecent({ calcId: def.id, calcName: def.name, query: scenarioQuery });
    }, 300);
    return () => clearTimeout(t);
  }, [def, edits, scenarioQuery]);

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

  const loadScenario = (query: string) => {
    if (def) setEdits(valuesFromSearch(query, def.fields, def.defaults));
  };

  const copyLink = async () => {
    // Built from the current values, so a copy right after an edit isn't a step behind the URL
    const url = `${window.location.origin}${window.location.pathname}${scenarioQuery ? `#${scenarioQuery}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied("done");
    } catch {
      // Clipboard can be unavailable (e.g. insecure context); the address bar still holds the link.
      setCopied("failed");
    }
    setTimeout(() => setCopied("idle"), 2500);
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
  const headlineNumber = typeof headline?.value === "number" ? headline.value : 0;
  const steps = validation || !headline ? [] : nextStepsFor(def.id, values, headlineNumber);

  const save = () => {
    if (!headline) return;
    saveScenario({
      calcId: def.id,
      calcName: def.name,
      query: scenarioQuery,
      label: headline.label,
      value: formatOutput(headline.value, headline.kind),
    });
    trackEvent("scenario_save", { calculator_name: def.id });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
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
              onClick={save}
              disabled={!headline || !!validation}
              aria-label="Save this scenario in this browser"
              className="inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground disabled:opacity-50"
            >
              {saved ? <BookmarkCheck className="h-3.5 w-3.5 text-accent" /> : <Bookmark className="h-3.5 w-3.5" />}
              <span className={saved ? undefined : "hidden sm:inline"}>{saved ? "Saved" : "Save"}</span>
            </button>
            <button
              type="button"
              onClick={copyLink}
              aria-label="Copy a link to this calculation"
              className="inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
            >
              {copied === "done" ? <Check className="h-3.5 w-3.5 text-accent" /> : <Link2 className="h-3.5 w-3.5" />}
              <span className={copied === "idle" ? "hidden sm:inline" : undefined}>
                {copied === "done" ? "Copied" : copied === "failed" ? "Copy from the address bar" : "Copy link"}
              </span>
            </button>
            <button
              type="button"
              onClick={reset}
              aria-label="Reset inputs"
              className="inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
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
      <div className="space-y-6">
        {validation ? (
          <div role="status" className="surface flex items-start gap-3 border-amber-500/40 bg-amber-500/10 p-6">
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
                  <div aria-live="polite" aria-atomic="true">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7FD6B2]">
                      {headline.label}
                    </p>
                    <p className="font-display tnum mt-2 break-words text-4xl tracking-tight md:text-5xl">
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
                      out.tone === "positive"
                        ? typeof out.value === "number" && out.value < 0
                          ? "text-destructive"
                          : "text-success"
                        : "text-foreground"
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

        <NextSteps from={def.id} steps={steps} />

        <SavedScenarios calcId={def.id} currentQuery={scenarioQuery} onLoad={loadScenario} />

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
        <div
          role="radiogroup"
          aria-labelledby={`${field.key}-label`}
          className="flex flex-wrap gap-2"
          onKeyDown={(e) => {
            // Arrow keys move the selection, as in a native radio group
            const opts = field.options ?? [];
            const i = opts.findIndex((o) => o.value === String(value));
            const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
            if (!delta || opts.length === 0) return;
            e.preventDefault();
            const next = opts[(i + delta + opts.length) % opts.length];
            onChange(next.value);
            e.currentTarget.querySelector<HTMLElement>(`[data-value="${next.value}"]`)?.focus();
          }}
        >
          {field.options?.map((o) => {
            const active = String(value) === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                data-value={o.value}
                onClick={() => onChange(o.value)}
                className={cn(
                  "min-h-10 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all",
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
    // An empty or unreadable box keeps the last estimate rather than jumping to the minimum
    if (Number.isFinite(n) && draft.trim() !== "") onChange(clampToField(n, field));
    setDraft(null);
  };

  // A gentle note while the typed value can't be used as-is
  const draftNumber = draft === null ? NaN : Number(draft.replace(/,/g, ""));
  const hint =
    draft === null
      ? null
      : draft.trim() === ""
        ? "Type a number to update the estimate."
        : !Number.isFinite(draftNumber)
          ? "That doesn't look like a number yet."
          : hasRange && (draftNumber < field.min! || draftNumber > field.max!)
            ? `This calculator works between ${formatBound(field.min!, field.kind)} and ${formatBound(field.max!, field.kind)} — showing ${formatBound(clampToField(draftNumber, field), field.kind)} for now.`
            : null;
  const helpId = `${field.key}-help`;

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
            inputMode={isWholeField(field) ? "numeric" : "decimal"}
            autoComplete="off"
            value={shown}
            aria-invalid={hint ? true : undefined}
            aria-describedby={helpId}
            onChange={(e) => {
              const raw = e.target.value.replace(isWholeField(field) ? /[^0-9,]/g : /[^0-9.,]/g, "");
              setDraft(raw);
              const n = Number(raw.replace(/,/g, ""));
              // Update live while typing; out-of-range values use the nearest bound so the
              // result always matches what the note says is being shown
              if (raw !== "" && Number.isFinite(n)) onChange(clampToField(n, field));
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
          aria-label={`${field.label} slider`}
          aria-valuetext={`${formatBound(Number.isFinite(numericValue) ? numericValue : (field.min as number), field.kind)}${unit === "yrs" ? " years" : ""}`}
          aria-describedby={helpId}
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
        <p id={helpId} className={cn("text-xs leading-relaxed", hint ? "font-medium text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>
          {hint ?? field.help}
        </p>
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
