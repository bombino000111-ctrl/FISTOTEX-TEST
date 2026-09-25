"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { calculators, categories, type CategoryId } from "@/lib/calculators/registry";
import { CalculatorCard } from "@/components/calculators/calculator-card";
import { cn } from "@/lib/utils";

/** Search + category filter over every calculator. Works without JS as a full list. */
export function CalculatorBrowser() {
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<CategoryId | "all">("all");

  // Honour #category links (e.g. from the home page) on load and on hash change
  React.useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace("#", "");
      if (categories.some((c) => c.id === hash)) setCat(hash as CategoryId);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const q = query.trim().toLowerCase();
  const visible = calculators.filter(
    (c) =>
      (cat === "all" || c.category === cat) &&
      (!q ||
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.id.includes(q))
  );

  return (
    <div>
      <div className="surface sticky top-[76px] z-20 mb-8 flex flex-col gap-4 p-3 md:top-[84px] md:flex-row md:items-center">
        <div className="relative md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="calc-search" className="sr-only">
            Search calculators
          </label>
          <input
            id="calc-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: SIP, loan, retirement…"
            className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {[{ id: "all" as const, name: "All", tint: "#10B981" }, ...categories].map((c) => {
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCat(c.id);
                  window.history.replaceState(null, "", c.id === "all" ? window.location.pathname : `#${c.id}`);
                }}
                aria-pressed={active}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "border-transparent text-white shadow-md"
                    : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground"
                )}
                style={active ? { background: c.tint } : undefined}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-semibold text-foreground">{visible.length}</span> of {calculators.length}{" "}
        calculators
      </p>

      {visible.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((calc) => (
            <CalculatorCard key={calc.id} calc={calc} />
          ))}
        </div>
      ) : (
        <div className="surface p-10 text-center">
          <p className="font-semibold text-foreground">No calculator matches &ldquo;{query}&rdquo;.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCat("all");
            }}
            className="btn-brand mt-5 h-10 px-5 text-sm"
          >
            Show all calculators
          </button>
        </div>
      )}
    </div>
  );
}
