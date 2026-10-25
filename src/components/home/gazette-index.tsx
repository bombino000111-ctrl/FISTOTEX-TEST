import type { CSSProperties } from "react";
import Link from "next/link";
import { calculators, calculatorPath, type CategoryId } from "@/lib/calculators/registry";

/**
 * The full directory as four groups, the way people think about the decision
 * in front of them. The registry's six categories fold into these four; each
 * group keeps its category tint as a short rule, so colour still tells you
 * which family a calculator belongs to elsewhere on the site.
 */
const groups: Array<{ title: string; tint: string; categories: CategoryId[] }> = [
  { title: "Investing and growth", tint: "#0B6E4F", categories: ["investment"] },
  { title: "Loans and borrowing", tint: "#34507F", categories: ["loans"] },
  { title: "Safe savings", tint: "#A2560B", categories: ["savings"] },
  { title: "Retirement and planning", tint: "#7A3E6C", categories: ["retirement", "fixed-income", "planning"] },
];

export function GazetteIndex() {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group) => {
        const entries = group.categories.flatMap((cat) => calculators.filter((c) => c.category === cat));
        if (entries.length === 0) return null;
        return (
          <section key={group.title} style={{ "--tint": group.tint } as CSSProperties} aria-labelledby={`group-${group.categories[0]}`}>
            <span aria-hidden="true" className="block h-0.5 w-10 rounded-full bg-[var(--tint-ink)]" />
            <h3 id={`group-${group.categories[0]}`} className="font-display mt-4 text-2xl text-foreground">
              {group.title}
            </h3>
            <ul className="mt-5 space-y-1">
              {entries.map((calc) => (
                <li key={calc.id}>
                  <Link
                    href={calculatorPath(calc.id)}
                    className="group -mx-3 block rounded-lg px-3 py-2.5 transition-colors hover:bg-background"
                  >
                    <span className="block font-semibold text-foreground group-hover:text-accent">
                      {calc.name.replace(/ Calculator$/, "")}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{calc.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
