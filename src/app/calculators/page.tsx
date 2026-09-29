import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/StructuredData";
import { CalculatorBrowser } from "@/components/calculators/calculator-browser";
import {
  calculators,
  categories,
  calculatorsByCategory,
  categoryPath,
  calculatorsPath,
} from "@/lib/calculators/registry";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "All Finance Calculators: SIP, EMI, FD, PPF & More",
  description:
    "Free online finance calculators for India: SIP, lumpsum, EMI, FD, RD, PPF, NPS, retirement, CAGR, XIRR, bond and inflation. Every formula shown.",
  path: calculatorsPath,
});

/**
 * The single calculator hub.
 *
 * This page replaces the old /calculators and /calculators pair,
 * which both listed all 14 calculators and competed for the same queries. The
 * "browse by goal" grid below is what gives the six category pages their
 * inbound links — without it they would be orphans.
 */
export default function CalculatorsPage() {
  return (
    <div className="flex flex-col">
      <StructuredData
        type="WebPage"
        data={{
          title: "Finance Calculators",
          description: "Free finance calculators with clear formulas and transparent assumptions.",
          url: absoluteUrl(calculatorsPath),
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{ items: [{ name: "Home", url: "/" }, { name: "Calculators", url: calculatorsPath }] }}
      />

      <PageHeader
        eyebrow="Calculators"
        title={
          <>
            Finance <span className="text-accent">calculators</span>
          </>
        }
        description={`${calculators.length} calculators covering investments, loans, savings, retirement and planning — each with the formula and assumptions shown.`}
        crumbs={[{ name: "Calculators" }]}
      />

      <Section className="pt-10 md:pt-12">
        <CalculatorBrowser />
      </Section>

      {/* Browse by goal: one card per category, linking to its own page */}
      <Section
        tone="muted"
        eyebrow="By goal"
        title="Browse by what you're planning"
        description="Each group collects the calculators that answer the same kind of question."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const count = calculatorsByCategory(cat.id).length;
            if (count === 0) return null;
            return (
              <Link
                key={cat.id}
                href={categoryPath(cat.id)}
                className="surface surface-link group flex flex-col gap-3 p-6"
                style={{ "--tint": cat.tint } as React.CSSProperties}
              >
                <span className="icon-tile h-10 w-10">
                  <cat.icon className="h-5 w-5" />
                </span>
                <p className="font-display text-lg text-foreground decoration-1 underline-offset-4 group-hover:underline">
                  {cat.name}
                </p>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{cat.blurb}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                  {count} calculator{count === 1 ? "" : "s"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section className="py-12 md:py-12">
        <div className="surface p-6">
          <h2 className="text-sm font-bold text-foreground">Disclaimer</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            These calculators are educational tools. They provide estimates based on the inputs and
            assumptions used, and actual results may vary with market conditions, taxes, fees and
            lender or institution policies. Nothing here is personalised financial advice.
          </p>
        </div>
      </Section>
    </div>
  );
}
