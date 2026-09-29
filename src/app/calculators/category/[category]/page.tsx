import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { PageHeader, Section } from "@/components/layout/section";
import { CalculatorCard } from "@/components/calculators/calculator-card";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageMetadata, absoluteUrl } from "@/lib/seo";
import {
  categories,
  categoryIds,
  getCategory,
  calculatorsByCategory,
  categoryPath,
  calculatorsPath,
} from "@/lib/calculators/registry";
import { categorySeo } from "@/lib/calculators/seo-content";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return categoryIds.map((category) => ({ category }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  const seo = categorySeo[cat.id];

  return pageMetadata({
    title: seo?.title ?? `${cat.name} Calculators`,
    description: seo?.description ?? cat.blurb,
    path: categoryPath(cat.id),
  });
}

/**
 * A category listing, e.g. /calculators/category/investment.
 *
 * These pages exist to target the plural mid-funnel queries ("investment
 * calculators") that an individual calculator page cannot rank for, and to give
 * the hub a second level of internal linking. They carry real explanatory copy
 * rather than just a grid, so they are not thin pages.
 */
export default async function CategoryRoute({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const items = calculatorsByCategory(cat.id);
  if (items.length === 0) notFound();

  const seo = categorySeo[cat.id];
  const others = categories.filter((c) => c.id !== cat.id && calculatorsByCategory(c.id).length > 0);
  const reviewed = new Date(siteConfig.contentReviewed).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col">
      <StructuredData
        type="WebPage"
        data={{
          title: seo?.title ?? `${cat.name} Calculators`,
          description: seo?.description ?? cat.blurb,
          url: absoluteUrl(categoryPath(cat.id)),
          dateModified: siteConfig.contentReviewed,
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          items: [
            { name: "Home", url: "/" },
            { name: "Calculators", url: calculatorsPath },
            { name: cat.name, url: categoryPath(cat.id) },
          ],
        }}
      />

      <PageHeader
        eyebrow={`${items.length} calculator${items.length === 1 ? "" : "s"}`}
        title={
          <>
            {seo?.heading ?? cat.name} <span className="text-accent">calculators</span>
          </>
        }
        description={cat.blurb}
        crumbs={[{ name: "Calculators", href: calculatorsPath }, { name: cat.name }]}
      >
        <p className="text-sm text-muted-foreground">
          Free · No sign-up · Last reviewed{" "}
          <time dateTime={siteConfig.contentReviewed}>{reviewed}</time>
        </p>
      </PageHeader>

      {/* The calculators in this category */}
      <Section className="pt-10 md:pt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((calc) => (
            <CalculatorCard key={calc.id} calc={calc} />
          ))}
        </div>
      </Section>

      {/* Explainer: what this group of calculators is for */}
      {seo && (
        <Section
          tone="muted"
          eyebrow="Guide"
          title={`What ${(seo?.heading ?? cat.name).toLowerCase()} calculators are for`}
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {seo.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <aside className="surface p-6 md:p-7">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                <span className="icon-tile h-9 w-9">
                  <Compass className="h-4 w-4" />
                </span>
                Which one to use
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">{seo.guidance}</p>
            </aside>
          </div>
        </Section>
      )}

      {/* Sideways links to the other categories */}
      {others.length > 0 && (
        <Section
          eyebrow="Keep going"
          title="Other calculator groups"
          action={
            <Link href={calculatorsPath} className="btn-ghost h-11 px-5 text-sm">
              All calculators
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          <div className="flex flex-wrap gap-3">
            {others.map((c) => (
              <Link
                key={c.id}
                href={categoryPath(c.id)}
                className="surface surface-link inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-foreground"
              >
                <c.icon className="h-4 w-4 text-accent" />
                {c.name}
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
