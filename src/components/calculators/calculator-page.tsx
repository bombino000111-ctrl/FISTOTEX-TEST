import type * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator as CalculatorIcon, Sigma, ListChecks, Plus, BadgeCheck, BookOpen } from "lucide-react";
import { PageHeader, Section } from "@/components/layout/section";
import { CalculatorRunner } from "@/components/calculators/calculator-runner";
import { CalculatorCard } from "@/components/calculators/calculator-card";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdUnit } from "@/components/ads/ad-unit";
import {
  getCalculator,
  calculators,
  categories,
  calculatorPath,
  categoryPath,
  calculatorsPath,
} from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";
import { calculatorSeo } from "@/lib/calculators/seo-content";
import { formatInput, formatOutput } from "@/lib/calculators/format";

export function CalculatorPage({ id }: { id: string }) {
  const def = getCalculator(id);
  if (!def) notFound();

  const category = categories.find((c) => c.id === def.category);
  const seo = calculatorSeo[def.id];
  const faqs = [...def.faqs, ...(seo?.faqs ?? [])];
  const reviewed = new Date(siteConfig.contentReviewed);
  const reviewedLabel = reviewed.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  // Worked example from the default inputs: static, crawlable numbers that
  // search engines and AI answers can quote.
  const exampleOutputs = def.compute(def.defaults);
  const base = siteConfig.url.replace(/\/$/, "");
  const pageUrl = `${base}${calculatorPath(def.id)}`;

  const related = calculators
    .filter((c) => c.id !== def.id && c.category === def.category)
    .slice(0, 3);
  const extra = calculators.filter((c) => c.id !== def.id).slice(0, 3 - related.length);
  const suggestions = [...related, ...extra].filter(
    (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
  );

  // The trail runs through the calculator's category even though the URL is
  // flat (/calculators/sip). That is deliberate: it gives every category page
  // an inbound link from all of its calculators, which is what makes those
  // pages worth having. Google reads breadcrumbs as position in the site, not
  // as a literal echo of the path.
  const crumbs = [
    { name: "Calculators", url: calculatorsPath },
    ...(category ? [{ name: category.name, url: categoryPath(category.id) }] : []),
    { name: def.name, url: calculatorPath(def.id) },
  ];

  return (
    <div className="flex flex-col">
      <StructuredData
        type="WebPage"
        data={{
          title: def.name,
          description: def.tagline,
          url: pageUrl,
          dateModified: siteConfig.contentReviewed,
        }}
      />
      <StructuredData
        type="WebApplication"
        data={{
          title: def.name,
          description: seo?.description ?? def.tagline,
          url: pageUrl,
          dateModified: siteConfig.contentReviewed,
        }}
      />
      <StructuredData type="BreadcrumbList" data={{ items: crumbs }} />
      {faqs.length > 0 && (
        <StructuredData
          type="FAQPage"
          data={{ questions: faqs.map((f) => ({ question: f.q, answer: f.a })) }}
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
          { name: "Calculators", href: calculatorsPath },
          ...(category ? [{ name: category.name, href: categoryPath(category.id) }] : []),
          { name: def.name },
        ]}
      >
        <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <BadgeCheck className="h-4 w-4 text-accent" />
            Formula checked by{" "}
            <Link href="/about#partner" className="font-medium text-foreground underline-offset-4 hover:underline">
              {siteConfig.partner.name}
            </Link>
            , {siteConfig.name} {siteConfig.partner.role.toLowerCase()}
          </span>
          <span>
            Last updated <time dateTime={siteConfig.contentReviewed}>{reviewedLabel}</time>
          </span>
          <span>Free · No sign-up · Runs in your browser</span>
        </p>
      </PageHeader>

      {/* Calculator */}
      <Section className="pt-10 md:pt-12">
        <CalculatorRunner id={def.id} />
      </Section>

      {/* What it is + worked example */}
      {seo && (
        <Section
          tone="muted"
          eyebrow="Guide"
          title={`${def.name}: what it does and when to use it`}
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {seo.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p className="flex items-start gap-2 text-sm">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  How to use it: set each input with the slider or type an exact figure. Results,
                  the chart and the shareable link update instantly.
                </span>
              </p>
            </div>

            <figure className="surface p-6 md:p-7">
              <figcaption className="text-sm font-bold uppercase tracking-wider text-foreground">
                Worked example
              </figcaption>
              <dl className="mt-4 divide-y divide-border text-sm">
                {def.fields
                  .filter((f) => def.defaults[f.key] !== undefined)
                  .map((f) => (
                    <div key={f.key} className="flex justify-between gap-4 py-2.5">
                      <dt className="text-muted-foreground">{f.label}</dt>
                      <dd className="tnum font-medium text-foreground">{formatInput(f, def.defaults[f.key])}</dd>
                    </div>
                  ))}
                {exampleOutputs.map((o) => (
                  <div key={o.label} className="flex justify-between gap-4 py-2.5">
                    <dt className={o.emphasis ? "font-semibold text-foreground" : "text-muted-foreground"}>{o.label}</dt>
                    <dd className={`tnum text-right ${o.emphasis ? "font-display text-lg text-accent" : "font-medium text-foreground"}`}>
                      {formatOutput(o.value, o.kind)}
                    </dd>
                  </div>
                ))}
              </dl>
            </figure>
          </div>
        </Section>
      )}

      {/* How it works */}
      <Section
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

          <div className="surface p-6 md:p-8" style={{ "--tint": "#34507F" } as React.CSSProperties}>
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

      {/* In-content ad: sits after the method explainer, so a visitor has
          reached real content before meeting an ad. */}
      <Section className="py-0">
        <AdUnit format="in-article" minHeight={200} />
      </Section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <Section tone="muted" eyebrow="Questions" title="Frequently asked questions">
          <div className="max-w-3xl space-y-3">
            {faqs.map((faq) => (
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

      {/* Ad above the related-calculator grid */}
      <Section className="py-8">
        <AdUnit format="display" minHeight={280} />
      </Section>

      {/* Related */}
      {suggestions.length > 0 && (
        <Section
          eyebrow="Keep going"
          title="Related calculators"
          action={
            <Link
              href="/calculators"
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
