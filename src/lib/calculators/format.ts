import { formatCurrency } from "@/lib/utils";
import type { CalcField, CalcOutput } from "@/lib/calculators/registry";

/** Display a calculator result value. Shared by the live runner and the static worked example. */
export function formatOutput(value: number | string, kind: CalcOutput["kind"]) {
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

/** Display an input value in its field's units. */
export function formatInput(field: CalcField, value: number | string) {
  if (field.kind === "select") {
    return field.options?.find((o) => o.value === String(value))?.label ?? String(value);
  }
  const n = Number(value);
  switch (field.kind) {
    case "currency":
      return formatCurrency(n);
    case "percent":
      return `${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}%`;
    case "years":
      return `${n.toLocaleString("en-IN")} years`;
    case "age":
      return `${n} years`;
    default:
      return n.toLocaleString("en-IN");
  }
}
