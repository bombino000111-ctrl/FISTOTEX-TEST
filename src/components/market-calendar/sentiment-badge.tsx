import { TrendingUp, TrendingDown } from "lucide-react";
import type { MarketSentiment } from "@/types/market-calendar";
import { cn } from "@/lib/utils";

type TaggedSentiment = Exclude<MarketSentiment, "pending">;

// "pending" events (outcome decides direction) get no tag at all
const sentimentMeta: Record<
  TaggedSentiment,
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
};

export function SentimentBadge({ sentiment, className }: { sentiment: MarketSentiment; className?: string }) {
  if (sentiment === "pending") return null;
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
export type { TaggedSentiment };
