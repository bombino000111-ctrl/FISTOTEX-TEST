"use client";

import * as React from "react";
import { Search } from "lucide-react";
import type { CompanyResult, EarningsMarket } from "@/types/earnings";
import { CompanyCard } from "@/components/earnings/company-card";
import { cn } from "@/lib/utils";

const markets: { id: EarningsMarket; label: string }[] = [
  { id: "IN", label: "India" },
  { id: "US", label: "United States" },
];

type SortKey = "revenue" | "profit" | "soon" | "name";
const sorts: { id: SortKey; label: string }[] = [
  { id: "revenue", label: "Revenue growth" },
  { id: "profit", label: "Profit growth" },
  { id: "soon", label: "Reporting soonest" },
  { id: "name", label: "A–Z" },
];

/** Upcoming results date for sorting; companies without one go last. */
const nextDate = (c: CompanyResult) => (c.next.kind === "date" ? c.next.date : "9999-12-31");

const sortLabel: Record<SortKey, string> = {
  revenue: ", sorted by revenue growth over last year",
  profit: ", sorted by profit growth over last year",
  soon: ", soonest results first",
  name: "",
};

const compare: Record<SortKey, (a: CompanyResult, b: CompanyResult) => number> = {
  revenue: (a, b) => b.revenueYoY - a.revenueYoY,
  profit: (a, b) => b.profitYoY - a.profitYoY,
  soon: (a, b) => nextDate(a).localeCompare(nextDate(b)),
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
export function EarningsList({
  companies,
  today,
  checkedOn,
}: {
  companies: CompanyResult[];
  today: string;
  /** When the hand-checked figures were last verified */
  checkedOn: string;
}) {
  const [market, setMarket] = React.useState<EarningsMarket>("IN");
  const [sort, setSort] = React.useState<SortKey>("revenue");
  const [query, setQuery] = React.useState("");

  // A search looks across both markets, so nobody has to guess where a company is listed
  const q = query.trim().toLowerCase();
  const visible = companies
    .filter((c) => (q ? c.name.toLowerCase().includes(q) || c.symbol?.toLowerCase().includes(q) : c.market === market))
    .sort(compare[sort]);

  return (
    <div>
      <div className="sticky top-[68px] z-20 -mx-4 mb-8 flex flex-col gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="company-search" className="sr-only">
            Find a company
          </label>
          <input
            id="company-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a company"
            className="h-10 w-full rounded-full border border-input bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 sm:w-56"
          />
        </div>
        <div role="group" aria-label="Market" className="no-scrollbar flex gap-2 overflow-x-auto">
          {markets.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMarket(m.id)}
              aria-pressed={!q && market === m.id}
              className={chip(!q && market === m.id)}
            >
              {m.label}
              <span className="ml-1.5 opacity-60">{companies.filter((c) => c.market === m.id).length}</span>
            </button>
          ))}
        </div>
        </div>

        <div role="group" aria-label="Sort by" className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          <span className="mr-1 shrink-0 text-sm text-muted-foreground">Sort by</span>
          {sorts.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSort(s.id)}
              aria-pressed={sort === s.id}
              className={cn(
                "inline-flex min-h-9 shrink-0 items-center rounded-full px-3.5 text-sm font-medium transition-colors",
                sort === s.id ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
        <span className="font-semibold text-foreground">{visible.length}</span>{" "}
        {q
          ? `${visible.length === 1 ? "company matches" : "companies match"} “${query.trim()}”`
          : market === "IN"
            ? "Indian companies, in ₹ crore (consolidated)"
            : "US companies, in US$ billion"}
        {sortLabel[sort]}
      </p>

      {visible.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {visible.map((c) => (
            <CompanyCard key={c.id} company={c} today={today} checkedOn={checkedOn} />
          ))}
        </div>
      ) : (
        <div className="surface p-10 text-center">
          <p className="font-display text-2xl text-foreground">No company called &ldquo;{query.trim()}&rdquo; here yet</p>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            This page covers 20 of the largest Indian and US companies. Check the spelling, or clear the
            search to see them all.
          </p>
          <button type="button" onClick={() => setQuery("")} className="btn-ghost mt-6 min-h-10 px-5 text-sm">
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
