import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, Section } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/StructuredData";
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
        title="Financial Toolkit"
        description="Everything you need to plan with numbers instead of guesses. Each calculator shows its formula and the assumptions behind the result."
        crumbs={[{ name: "Toolkit" }]}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
          <Section key={cat.id} id={cat.id} eyebrow={cat.name} title={cat.name} description={cat.blurb}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((calc) => {
                const CalcIcon = calc.icon;
                return (
                  <Link
                    key={calc.id}
                    href={`/toolkit/finance-calculator/${calc.id}`}
                    className="surface surface-link group flex flex-col p-6"
                  >
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                      <CalcIcon className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-foreground">{calc.name}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {calc.tagline}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                      Calculate
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
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
              No sign-up, no paywall, no data collection.
            </p>
          </div>
          <Link
            href="/toolkit/finance-calculator"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </div>
  );
}
