import { TrendingUp, TrendingDown, Shuffle } from "lucide-react";
import type { MarketSentiment } from "@/types/market-calendar";
import { cn } from "@/lib/utils";

const sentimentMeta: Record<
  MarketSentiment,
  { label: string; icon: typeof TrendingUp; className: string }
> = {
  positive: {
    label: "Positive",
    icon: TrendingUp,
    className: "border-success/30 bg-success/10 text-success",
  },
  negative: {
    label: "Negative",
    icon: TrendingDown,
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  pending: {
    label: "Bidirectional",
    icon: Shuffle,
    className: "border-amber-warm/30 bg-amber-warm/10 text-amber-warm",
  },
};

export function SentimentBadge({ sentiment, className }: { sentiment: MarketSentiment; className?: string }) {
  const meta = sentimentMeta[sentiment];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        meta.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

export { sentimentMeta };
