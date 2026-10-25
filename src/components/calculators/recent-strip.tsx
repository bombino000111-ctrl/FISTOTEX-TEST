"use client";

import * as React from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { calculatorPath } from "@/lib/calculators/registry";
import { emptySnapshot, recentSnapshot, subscribeScenarios } from "@/lib/scenarios";

/**
 * "Pick up where you left off" — the calculators this browser used last,
 * each reopening with the numbers that were entered. Renders nothing for a
 * first-time visitor (and in the static HTML).
 */
export function RecentStrip({ className }: { className?: string }) {
  const recent = React.useSyncExternalStore(subscribeScenarios, recentSnapshot, emptySnapshot);
  if (recent.length === 0) return null;

  return (
    <section aria-labelledby="recent-title" className={className}>
      <h2 id="recent-title" className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <History className="h-4 w-4 text-accent" aria-hidden="true" />
        Pick up where you left off
      </h2>
      <ul className="flex flex-wrap gap-2">
        {recent.slice(0, 4).map((r) => (
          <li key={r.calcId}>
            <Link
              href={`${calculatorPath(r.calcId)}${r.query ? `#${r.query}` : ""}`}
              className="inline-flex min-h-10 items-center rounded-md border border-border bg-card px-3.5 text-sm font-medium text-ink-2 transition-colors hover:border-foreground hover:text-foreground"
            >
              {r.calcName}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
