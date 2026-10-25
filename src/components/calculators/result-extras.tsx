"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { calculatorPath } from "@/lib/calculators/registry";
import type { NextStep } from "@/lib/calculators/next-steps";
import { trackEvent } from "@/lib/analytics";
import {
  emptySnapshot,
  removeScenario,
  savedSnapshot,
  subscribeScenarios,
  type SavedScenario,
} from "@/lib/scenarios";

const hrefFor = (step: NextStep) => {
  const qs = new URLSearchParams(
    Object.entries(step.carry)
      .filter(([, v]) => Number.isFinite(v))
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return `${calculatorPath(step.to)}${qs ? `#${qs}` : ""}`;
};

/** Follow-up questions sitting right under the result, so a calculation never ends in a dead end. */
export function NextSteps({ from, steps }: { from: string; steps: NextStep[] }) {
  if (steps.length === 0) return null;
  return (
    <nav aria-labelledby="next-steps-title" className="surface p-6 md:p-8">
      <h2 id="next-steps-title" className="font-display text-xl text-foreground">
        Your next step
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Your numbers come with you.</p>
      <ul className="mt-5 divide-y divide-border border-y border-border">
        {steps.map((step) => (
          <li key={step.to}>
            <Link
              href={hrefFor(step)}
              onClick={() => trackEvent("next_step_click", { from, to: step.to })}
              className="group flex items-center justify-between gap-4 py-4 transition-colors"
            >
              <span>
                <span className="block font-semibold text-foreground group-hover:text-accent">
                  {step.title}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{step.body}</span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** This calculator's saved scenarios, side by side, kept only in this browser. */
export function SavedScenarios({
  calcId,
  currentQuery,
  onLoad,
}: {
  calcId: string;
  currentQuery: string;
  onLoad: (query: string) => void;
}) {
  const all = React.useSyncExternalStore(subscribeScenarios, savedSnapshot, emptySnapshot);
  const mine = all.filter((s: SavedScenario) => s.calcId === calcId);
  if (mine.length === 0) return null;

  return (
    <section aria-labelledby="saved-title" className="surface p-6 md:p-8">
      <h2 id="saved-title" className="text-lg font-bold text-foreground">
        Saved scenarios
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Kept in this browser only. Select one to load it.</p>
      <ul className="mt-4 space-y-2">
        {mine.map((s) => {
          const active = s.query === currentQuery;
          return (
            <li key={s.key} className="flex items-stretch gap-2">
              <button
                type="button"
                onClick={() => onLoad(s.query)}
                aria-current={active ? "true" : undefined}
                className={`flex min-h-11 flex-1 items-center justify-between gap-3 rounded-md border px-4 py-2 text-left text-sm transition-colors ${
                  active ? "border-accent bg-accent-soft" : "border-border hover:border-foreground"
                }`}
              >
                <span className="text-muted-foreground">
                  {new Date(s.savedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  <span className="ml-2 text-foreground">{s.label}</span>
                </span>
                <span className="tnum font-display text-base text-foreground">{s.value}</span>
              </button>
              <button
                type="button"
                onClick={() => removeScenario(s.key)}
                aria-label={`Remove saved scenario: ${s.label} ${s.value}`}
                className="flex min-h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
