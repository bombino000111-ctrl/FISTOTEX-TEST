import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, Section } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/StructuredData";
import { CalculatorCard } from "@/components/calculators/calculator-card";
import { calculators, categories, calculatorsByCategory } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Financial Toolkit",
  description:
    "Simple, powerful calculators to help you understand investments, loans, savings and long-term financial planning.",
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, "")}/toolkit` },
};

export default function ToolkitPage() {
  return (
    <div className="flex flex-col">
      <StructuredData
        type="WebPage"
        data={{
          title: "Financial Toolkit",
          description:
            "Calculators for investments, loans, savings and long-term financial planning.",
          url: `${siteConfig.url.replace(/\/$/, "")}/toolkit`,
        }}
      />

      <PageHeader
        eyebrow="Toolkit"
        title={
          <>
            Your financial <span className="text-accent">toolkit</span>
          </>
        }
        description="Everything you need to plan with numbers instead of guesses. Each calculator shows its formula and the assumptions behind the result."
        crumbs={[{ name: "Toolkit" }]}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
            >
              {cat.name}
            </a>
          ))}
        </div>
      </PageHeader>

      {categories.map((cat) => {
        const items = calculatorsByCategory(cat.id);
        if (items.length === 0) return null;
        return (
          <Section key={cat.id} id={cat.id} eyebrow={`${items.length} tools`} title={cat.name} description={cat.blurb}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((calc) => (
                <CalculatorCard key={calc.id} calc={calc} />
              ))}
            </div>
          </Section>
        );
      })}

      <Section tone="muted">
        <div className="surface flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {calculators.length} calculators, always free
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No sign-up, no paywall — calculations run in your browser.
            </p>
          </div>
          <Link
            href="/toolkit/finance-calculator"
            className="btn-brand h-11 shrink-0 px-5 text-sm"
          >
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
