import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/StructuredData";
import { CalculatorBrowser } from "@/components/calculators/calculator-browser";
import { calculators } from "@/lib/calculators/registry";
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
          description: "Free finance calculators with clear formulas and transparent assumptions.",
          url: `${siteConfig.url.replace(/\/$/, "")}/toolkit/finance-calculator`,
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          items: [
            { name: "Home", url: "/" },
            { name: "Toolkit", url: "/toolkit" },
            { name: "Finance Calculators", url: "/toolkit/finance-calculator" },
          ],
        }}
      />

      <PageHeader
        eyebrow="Toolkit"
        title={
          <>
            Finance <span className="text-accent">calculators</span>
          </>
        }
        description={`${calculators.length} calculators covering investments, loans, savings, retirement and planning — each with the formula and assumptions shown.`}
        crumbs={[{ name: "Toolkit", href: "/toolkit" }, { name: "Finance Calculators" }]}
      />

      <Section className="pt-10 md:pt-12">
        <CalculatorBrowser />
      </Section>

      <Section tone="muted" className="py-12 md:py-12">
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
