import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/** "YoY ▲ 11.2%" — green when up, red when down. `flag` adds a footnote marker. */
export function Growth({ label, value, flag }: { label: "YoY" | "QoQ"; value: number; flag?: boolean }) {
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const word = value > 0 ? "up" : value < 0 ? "down" : "flat";

  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span className="w-7 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span
        className={cn(
          "inline-flex items-center gap-0.5 font-mono font-semibold tabular-nums",
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
    </span>
  );
}
