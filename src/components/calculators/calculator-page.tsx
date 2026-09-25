import type * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator as CalculatorIcon, Sigma, ListChecks, Plus } from "lucide-react";
import { PageHeader, Section } from "@/components/layout/section";
import { CalculatorRunner } from "@/components/calculators/calculator-runner";
import { CalculatorCard } from "@/components/calculators/calculator-card";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCalculator, calculators, categories } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";

export function CalculatorPage({ id }: { id: string }) {
  const def = getCalculator(id);
  if (!def) notFound();

  const category = categories.find((c) => c.id === def.category);
  const base = siteConfig.url.replace(/\/$/, "");
  const pageUrl = `${base}/toolkit/finance-calculator/${def.id}`;

  const related = calculators
    .filter((c) => c.id !== def.id && c.category === def.category)
    .slice(0, 3);
  const extra = calculators.filter((c) => c.id !== def.id).slice(0, 3 - related.length);
  const suggestions = [...related, ...extra].filter(
    (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
  );

  const crumbs = [
    { name: "Toolkit", url: "/toolkit" },
    { name: "Finance Calculator", url: "/toolkit/finance-calculator" },
    { name: def.name, url: `/toolkit/finance-calculator/${def.id}` },
  ];

  return (
    <div className="flex flex-col">
      <StructuredData
        type="WebPage"
        data={{
          title: def.name,
          description: def.tagline,
          url: pageUrl,
        }}
      />
      <StructuredData type="BreadcrumbList" data={{ items: crumbs }} />
      {def.faqs.length > 0 && (
        <StructuredData
          type="FAQPage"
          data={{ questions: def.faqs.map((f) => ({ question: f.q, answer: f.a })) }}
        />
      )}

      <PageHeader
        eyebrow={category?.name ?? "Finance calculator"}
        title={def.name}
        description={
          <>
            {def.tagline} Move the sliders or type exact numbers — results update instantly.
          </>
        }
        crumbs={[
          { name: "Toolkit", href: "/toolkit" },
          { name: "Finance Calculator", href: "/toolkit/finance-calculator" },
          { name: def.name },
        ]}
      />

      {/* Calculator */}
      <Section className="pt-10 md:pt-12">
        <CalculatorRunner id={def.id} />
      </Section>

      {/* How it works */}
      <Section
        tone="muted"
        eyebrow="Method"
        title="How this calculation works"
        description="The exact formula and assumptions behind the numbers above."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="surface p-6 md:p-8">
            <p className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <span className="icon-tile h-9 w-9"><Sigma className="h-4 w-4" /></span>
              Formula
            </p>
            <p className="tnum overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-muted px-4 py-4 font-mono text-sm text-foreground">
              {def.formula.expression}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {def.formula.note}
            </p>
          </div>

          <div className="surface p-6 md:p-8" style={{ "--tint": "#6366F1" } as React.CSSProperties}>
            <p className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <span className="icon-tile h-9 w-9"><ListChecks className="h-4 w-4" /></span>
              Assumptions
            </p>
            <ul className="space-y-3">
              {def.steps.map((step) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      {def.faqs.length > 0 && (
        <Section eyebrow="Questions" title="Frequently asked questions">
          <div className="max-w-3xl space-y-3">
            {def.faqs.map((faq) => (
              <details key={faq.q} className="surface group px-5 py-4 open:border-brand/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-foreground">
                  {faq.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform group-open:rotate-45 group-open:bg-brand group-open:text-white">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </Section>
      )}

      {/* Related */}
      {suggestions.length > 0 && (
        <Section
          tone="muted"
          eyebrow="Keep going"
          title="Related calculators"
          action={
            <Link
              href="/toolkit/finance-calculator"
              className="btn-ghost h-11 px-5 text-sm"
            >
              All calculators
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((c) => (
              <CalculatorCard key={c.id} calc={c} />
            ))}
          </div>
        </Section>
      )}

      {/* Disclaimer */}
      <Section className="py-12">
        <div className="surface flex gap-4 p-6">
          <CalculatorIcon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">Disclaimer</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This calculator is an educational tool. It provides estimates based on the inputs and
              assumptions shown, and does not constitute personalised financial, investment or tax
              advice. Actual returns, interest, taxes and fees will vary. Please consult a qualified
              professional before making financial decisions.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
