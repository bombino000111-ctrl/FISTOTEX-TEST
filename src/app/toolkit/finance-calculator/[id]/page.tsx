import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorPage } from "@/components/calculators/calculator-page";
import { calculatorIds, getCalculator } from "@/lib/calculators/registry";
import { calculatorSeo } from "@/lib/calculators/seo-content";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return calculatorIds.map((id) => ({ id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const def = getCalculator(id);
  if (!def) return {};
  const seo = calculatorSeo[def.id];

  return pageMetadata({
    title: seo?.title ?? def.name,
    description:
      seo?.description ??
      `${def.tagline} Free ${def.name} for Indian investors with the formula and assumptions shown.`,
    path: `/toolkit/finance-calculator/${def.id}`,
  });
}

export default async function CalculatorRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!getCalculator(id)) notFound();
  return <CalculatorPage id={id} />;
}
