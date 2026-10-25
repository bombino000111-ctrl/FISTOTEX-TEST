import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { calculatorPath, getCalculator } from "@/lib/calculators/registry";

/** Three short paths through the calculators, one per common life goal. */
const journeys = [
  {
    goal: "Retire calmly",
    line: "Price the future, size the corpus, then fund it.",
    path: ["inflation", "retirement", "nps"],
  },
  {
    goal: "Buy a home",
    line: "Know your budget, the EMI, and the down payment plan.",
    path: ["loan", "emi", "rd"],
  },
  {
    goal: "Start investing",
    line: "Begin monthly, compare a lump sum, then measure growth.",
    path: ["sip", "lumpsum", "cagr"],
  },
];

export function GoalJourneys({ className }: { className?: string }) {
  return (
    <section aria-labelledby="journeys-title" className={className}>
      <h2 id="journeys-title" className="font-display text-2xl text-foreground">
        Start with a goal
      </h2>
      <ol className="mt-5 grid gap-4 md:grid-cols-3">
        {journeys.map((j) => (
          <li key={j.goal} className="surface flex flex-col p-5">
            <p className="font-display text-lg text-foreground">{j.goal}</p>
            <p className="mt-1 text-sm text-muted-foreground">{j.line}</p>
            <ol className="mt-4 space-y-1">
              {j.path.map((id, i) => {
                const calc = getCalculator(id);
                if (!calc) return null;
                return (
                  <li key={id}>
                    <Link
                      href={calculatorPath(id)}
                      className="group flex min-h-10 items-center gap-3 text-sm font-medium text-ink-2 transition-colors hover:text-accent"
                    >
                      <span
                        aria-hidden="true"
                        className="tnum flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs text-muted-foreground group-hover:border-accent group-hover:text-accent"
                      >
                        {i + 1}
                      </span>
                      {calc.name.replace(/ Calculator$/, "")}
                      <ArrowRight aria-hidden="true" className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </section>
  );
}
