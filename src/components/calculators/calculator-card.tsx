import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, type CalculatorDef } from "@/lib/calculators/registry";

export function CalculatorCard({ calc }: { calc: CalculatorDef }) {
  const Icon = calc.icon;
  const category = categories.find((c) => c.id === calc.category);
  const tint = category?.tint ?? "#10B981";

  return (
    <Link
      href={`/toolkit/finance-calculator/${calc.id}`}
      className="surface surface-link group relative flex flex-col overflow-hidden p-6"
      style={{ "--tint": tint } as CSSProperties}
    >
      <div className="relative mb-5 flex items-start justify-between">
        <span className="icon-tile h-12 w-12">
          <Icon className="h-6 w-6" />
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:border-foreground group-hover:text-foreground">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <p className="relative text-[11px] font-bold uppercase tracking-wider" style={{ color: tint }}>
        {category?.name}
      </p>
      <h3 className="relative mt-1 text-lg font-bold text-foreground">{calc.name}</h3>
      <p className="relative mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{calc.tagline}</p>
    </Link>
  );
}
