import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorPage } from "@/components/calculators/calculator-page";
import { calculatorIds, getCalculator } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";

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

  const url = `${siteConfig.url.replace(/\/$/, "")}/toolkit/finance-calculator/${def.id}`;

  return {
    title: def.name,
    description: `${def.tagline} Free, transparent ${def.name.toLowerCase()} for Indian investors with the formula and assumptions shown.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${def.name} | ${siteConfig.name}`,
      description: def.tagline,
      url,
      type: "website",
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
  };
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
