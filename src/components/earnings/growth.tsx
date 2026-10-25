import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/** "+11.2% vs last year" — gold when up, red when down, always with a sign and an arrow so colour is never the only cue. `flag` adds a footnote marker. */
export function Growth({ label, value, flag }: { label: "YoY" | "QoQ"; value: number; flag?: boolean }) {
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const word = value > 0 ? "up" : value < 0 ? "down" : "flat";

  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 font-semibold tabular-nums",
          value > 0 ? "text-success" : value < 0 ? "text-destructive" : "text-muted-foreground"
        )}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">{word} </span>
        {sign}
        {Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 1 })}%
        {flag && (
          <sup className="ml-0.5 text-muted-foreground" aria-label="see note">
            *
          </sup>
        )}
      </span>
      <span className="text-muted-foreground">{label === "YoY" ? "vs last year" : "vs last quarter"}</span>
    </span>
  );
}
