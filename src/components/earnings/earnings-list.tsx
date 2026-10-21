"use client";

import * as React from "react";
import type { CompanyResult, EarningsMarket } from "@/types/earnings";
import { CompanyCard } from "@/components/earnings/company-card";
import { cn } from "@/lib/utils";

const markets: { id: EarningsMarket; label: string }[] = [
  { id: "IN", label: "India" },
  { id: "US", label: "United States" },
];

type SortKey = "revenue" | "profit" | "name";
const sorts: { id: SortKey; label: string }[] = [
  { id: "revenue", label: "Revenue growth" },
  { id: "profit", label: "Profit growth" },
  { id: "name", label: "A–Z" },
];

const compare: Record<SortKey, (a: CompanyResult, b: CompanyResult) => number> = {
  revenue: (a, b) => b.revenueYoY - a.revenueYoY,
  profit: (a, b) => b.profitYoY - a.profitYoY,
  name: (a, b) => a.name.localeCompare(b.name),
};

const chip = (active: boolean) =>
  cn(
    "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
    active
      ? "border-transparent bg-foreground text-background"
      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
  );

/** `today` (IST) comes from the server so "due today" labels match after hydration. */
export function EarningsList({ companies, today }: { companies: CompanyResult[]; today: string }) {
  const [market, setMarket] = React.useState<EarningsMarket>("IN");
  const [sort, setSort] = React.useState<SortKey>("revenue");

  const visible = companies.filter((c) => c.market === market).sort(compare[sort]);

  return (
    <div>
      <div className="surface sticky top-16 z-20 mb-8 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between md:top-[72px]">
        <div role="group" aria-label="Market" className="no-scrollbar flex gap-2 overflow-x-auto">
          {markets.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMarket(m.id)}
              aria-pressed={market === m.id}
              className={chip(market === m.id)}
            >
              {m.label}
              <span className="ml-1.5 opacity-60">{companies.filter((c) => c.market === m.id).length}</span>
            </button>
          ))}
        </div>

        <div role="group" aria-label="Sort by" className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          <span className="mr-1 shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Sort
          </span>
          {sorts.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSort(s.id)}
              aria-pressed={sort === s.id}
              className={cn(
                "shrink-0 rounded-sm px-2.5 py-1.5 text-xs font-semibold transition-colors",
                sort === s.id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
        <span className="font-semibold text-foreground">{visible.length}</span>{" "}
        {market === "IN" ? "Indian companies · ₹ crore, consolidated" : "US companies · US$ billion"}
        {sort !== "name" && ` · sorted by YoY ${sort} growth`}
      </p>

      <div className="grid gap-4 xl:grid-cols-2">
        {visible.map((c) => (
          <CompanyCard key={c.id} company={c} today={today} />
        ))}
      </div>
    </div>
  );
}
