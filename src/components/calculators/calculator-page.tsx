import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator as CalculatorIcon } from "lucide-react";
import { PageHeader, Section } from "@/components/layout/section";
import { CalculatorRunner } from "@/components/calculators/calculator-runner";
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
        description={def.tagline}
        crumbs={[
          { name: "Toolkit", href: "/toolkit" },
          { name: "Finance Calculator", href: "/toolkit/finance-calculator" },
          { name: def.name },
        ]}
      />

      {/* Calculator */}
      <Section className="pt-12 md:pt-14">
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
          <div className="surface p-6">
            <p className="eyebrow mb-3">Formula</p>
            <p className="tnum overflow-x-auto whitespace-pre-wrap rounded-md bg-muted px-4 py-3 font-mono text-sm text-foreground">
              {def.formula.expression}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {def.formula.note}
            </p>
          </div>

          <div className="surface p-6">
            <p className="eyebrow mb-4">Assumptions</p>
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
          <div className="max-w-3xl divide-y divide-border border-y border-border">
            {def.faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground transition-transform group-open:rotate-45"
                  >
                    +
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
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              All calculators
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.id}
                  href={`/toolkit/finance-calculator/${c.id}`}
                  className="surface surface-link group flex flex-col p-6"
                >
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.tagline}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    Open
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
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
