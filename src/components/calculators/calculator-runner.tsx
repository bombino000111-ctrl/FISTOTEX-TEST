"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { getCalculator, type CalcField } from "@/lib/calculators/registry";
import { GrowthChart } from "@/components/calculators/growth-chart";
import { formatCurrency } from "@/lib/utils";

type Values = Record<string, number | string>;

function formatOutput(value: number | string, kind: "currency" | "percent" | "number" | "years") {
  if (typeof value === "string") return value;
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

export function CalculatorRunner({ id }: { id: string }) {
  // The definition lives in a plain module so the client can hold the compute
  // functions directly — functions cannot cross the server/client boundary.
  const def = getCalculator(id);

  const [values, setValues] = React.useState<Values>(def?.defaults ?? {});

  const setValue = (key: string, value: number | string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    if (def) setValues(def.defaults);
  };

  const outputs = React.useMemo(() => {
    if (!def) return [];
    try {
      return def.compute(values);
    } catch {
      return [];
    }
  }, [def, values]);

  const chartData = React.useMemo(() => {
    if (!def || !def.chart) return null;
    try {
      const data = def.chart(values);
      return data.length > 1 ? data : null;
    } catch {
      return null;
    }
  }, [def, values]);

  if (!def) return null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* ── Inputs ── */}
      <div className="surface p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Your inputs
          </h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>

        <div className="space-y-7">
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
        <div className="surface overflow-hidden">
          <div className="border-b border-border bg-muted/40 px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Estimated outcome
            </h2>
          </div>
          <dl className="divide-y divide-border">
            {outputs.map((out) => (
              <div
                key={out.label}
                className="flex items-baseline justify-between gap-4 px-6 py-4"
              >
                <dt className="text-sm text-muted-foreground">{out.label}</dt>
                <dd
                  className={[
                    "tnum text-right font-semibold",
                    out.emphasis ? "text-xl" : "text-base",
                    out.tone === "positive" ? "text-success" : "text-foreground",
                  ].join(" ")}
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

        {chartData && (
          <div className="surface p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Growth over time
            </h2>
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

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: CalcField;
  value: number | string | undefined;
  onChange: (v: number | string) => void;
}) {
  const isSelect = field.kind === "select";
  const numericValue = Number(value);

  const display =
    field.kind === "currency"
      ? numericValue.toLocaleString("en-IN")
      : String(value ?? "");

  if (isSelect) {
    return (
      <div>
        <label
          htmlFor={field.key}
          className="mb-2 block text-sm font-medium text-foreground"
        >
          {field.label}
        </label>
        <select
          id={field.key}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {field.help && (
          <p className="mt-1.5 text-xs text-muted-foreground">{field.help}</p>
        )}
      </div>
    );
  }

  const hasRange = field.min !== undefined && field.max !== undefined;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={field.key} className="text-sm font-medium text-foreground">
          {field.label}
        </label>
        <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1">
          {field.kind === "currency" && (
            <span className="text-xs text-muted-foreground">₹</span>
          )}
          <input
            id={field.key}
            type="text"
            inputMode="decimal"
            value={display}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, "");
              onChange(raw === "" ? 0 : Number(raw));
            }}
            className="tnum w-24 bg-transparent text-right text-sm text-foreground focus:outline-none"
          />
          {field.kind === "percent" && (
            <span className="text-xs text-muted-foreground">%</span>
          )}
          {field.kind === "years" && (
            <span className="text-xs text-muted-foreground">yr</span>
          )}
          {field.kind === "age" && (
            <span className="text-xs text-muted-foreground">yrs</span>
          )}
        </div>
      </div>

      {hasRange && (
        <input
          type="range"
          aria-label={`${field.label} slider`}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          value={Number.isFinite(numericValue) ? numericValue : (field.min as number)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
        />
      )}

      <div className="mt-1 flex items-center justify-between">
        {field.help ? (
          <p className="text-xs text-muted-foreground">{field.help}</p>
        ) : (
          <span />
        )}
        {hasRange && (
          <span className="tnum text-[11px] text-muted-foreground">
            {formatBound(field.min as number, field.kind)} –{" "}
            {formatBound(field.max as number, field.kind)} · step{" "}
            {field.step ?? 1}
          </span>
        )}
      </div>
    </div>
  );
}

function formatBound(v: number, kind: CalcField["kind"]) {
  if (kind === "currency") {
    if (v >= 10000000) return `${(v / 10000000).toFixed(1)}Cr`;
    if (v >= 100000) return `${(v / 100000).toFixed(0)}L`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
    return String(v);
  }
  return String(v);
}
