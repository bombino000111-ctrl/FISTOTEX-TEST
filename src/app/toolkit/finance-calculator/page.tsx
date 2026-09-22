import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, Section } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/StructuredData";
import { calculators, categories, calculatorsByCategory } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Finance Calculators",
  description:
    "Free finance calculators for SIP, EMI, FD, PPF, NPS, retirement, CAGR, XIRR, bonds and inflation. Clear formulas, transparent assumptions, no sign-up.",
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, "")}/toolkit/finance-calculator` },
};

export default function FinanceCalculatorPage() {
  return (
    <div className="flex flex-col">
      <StructuredData
        type="WebPage"
        data={{
          title: "Finance Calculators",
          description:
            "Free finance calculators with clear formulas and transparent assumptions.",
          url: `${siteConfig.url.replace(/\/$/, "")}/toolkit/finance-calculator`,
        }}
      />

      <PageHeader
        eyebrow="Toolkit"
        title="Finance Calculators"
        description={`${calculators.length} calculators covering investments, loans, savings, retirement and planning — each with the formula and assumptions shown.`}
        crumbs={[
          { name: "Toolkit", href: "/toolkit" },
          { name: "Finance Calculator" },
        ]}
      />

      {categories.map((cat) => {
        const items = calculatorsByCategory(cat.id);
        if (items.length === 0) return null;
        const Icon = cat.icon;

        return (
          <Section
            key={cat.id}
            id={cat.id}
            eyebrow={cat.name}
            title={cat.name}
            description={cat.blurb}
          >
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

              {/* Category anchor card */}
              <div className="hidden items-center justify-center rounded-xl border border-dashed border-border p-6 lg:flex">
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  {items.length} in {cat.name}
                </span>
              </div>
            </div>
          </Section>
        );
      })}

      <Section tone="muted" className="py-12">
        <div className="surface p-6">
          <h2 className="text-sm font-semibold text-foreground">Disclaimer</h2>
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
