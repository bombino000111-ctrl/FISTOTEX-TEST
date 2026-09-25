import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Target,
  Users,
  Lightbulb,
  BookOpen,
  Calculator,
  Newspaper,
  IndianRupee,
  Sigma,
  CheckCircle2,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { PageHeader, Section } from "@/components/layout/section";
import { calculators } from "@/lib/calculators/registry";

export const metadata: Metadata = {
  title: "About Fistotex",
  description:
    "Learn about Fistotex — transparent financial calculators and attributed market news built for Indian investors.",
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, "")}/about` },
  openGraph: {
    title: "About Fistotex",
    description: "Transparent financial calculators and attributed market news built for Indian investors.",
    type: "website",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
};

const values = [
  {
    icon: Target,
    tint: "#10B981",
    title: "Accuracy first",
    description: "Calculators use standard, published formulas, and every news story links back to its original publisher.",
  },
  {
    icon: ShieldCheck,
    tint: "#6366F1",
    title: "Transparency",
    description: "Formulas and assumptions are shown on every calculator, so you can see exactly how a number was reached.",
  },
  {
    icon: Users,
    tint: "#F59E0B",
    title: "Built for people",
    description: "Plain language, fast pages and no sign-up walls. Tools that respect your time and your privacy.",
  },
  {
    icon: Lightbulb,
    tint: "#EC4899",
    title: "Education over advice",
    description: "We explain the numbers; you make the decision. We never push products or give personal recommendations.",
  },
  {
    icon: BookOpen,
    tint: "#06B6D4",
    title: "Always improving",
    description: "We refine tools as rates, rules and your feedback change. Tell us what you'd like to see next.",
  },
];

const features = [
  {
    icon: Calculator,
    tint: "#10B981",
    title: `${calculators.length} financial calculators`,
    description: "SIP, lumpsum, EMI, FD, RD, PPF, NPS, retirement, CAGR, XIRR, bonds, inflation and more.",
  },
  {
    icon: Newspaper,
    tint: "#06B6D4",
    title: "Curated market news",
    description: "Live headlines from Mint, Economic Times, Moneycontrol and Business Standard, always attributed.",
  },
  {
    icon: IndianRupee,
    tint: "#F59E0B",
    title: "Made for India",
    description: "Rupee formatting, lakh/crore figures and Indian products like PPF, NPS and recurring deposits.",
  },
  {
    icon: Sigma,
    tint: "#6366F1",
    title: "Working shown",
    description: "Every calculator explains its formula, assumptions and common questions alongside the result.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <StructuredData
        type="WebPage"
        data={{
          title: "About Fistotex",
          description: "Transparent financial calculators and attributed market news built for Indian investors.",
          url: `${siteConfig.url.replace(/\/$/, "")}/about`,
        }}
      />

      <PageHeader
        eyebrow="About us"
        title={
          <>
            Financial clarity for <span className="text-accent">every Indian.</span>
          </>
        }
        description="We build free, transparent tools and curate trustworthy news so you can make money decisions with confidence."
        crumbs={[{ name: "About" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/toolkit/finance-calculator" className="btn-brand h-12 px-6 text-sm">
            Explore calculators
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/news" className="btn-ghost h-12 px-6 text-sm">
            Read the latest news
          </Link>
        </div>
      </PageHeader>

      {/* Mission */}
      <Section eyebrow="Our mission" title="Why we built Fistotex">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              In a country where financial aspirations run high but reliable guidance is hard to find,{" "}
              <strong className="text-foreground">{siteConfig.name}</strong> started from a simple belief: everyone
              deserves access to clear financial tools and honest information.
            </p>
            <p>
              On one side are complex products with fine print; on the other, generic advice that ignores Indian
              realities — our tax rules, our investment options, our economy. We sit in between, giving you the
              numbers and the context to decide for yourself.
            </p>
            <p className="font-semibold text-foreground">
              We don&apos;t give financial advice. We give you the tools to make informed decisions.
            </p>
          </div>
          <div className="surface p-7">
            <p className="text-sm font-bold uppercase tracking-wider text-accent">What you get</p>
            <ul className="mt-5 space-y-4">
              {[
                "Calculators built on standard formulas with assumptions spelled out",
                "News aggregated from India's leading financial publications",
                "Explanations of the 'why' behind every calculation",
                "No accounts, no paywalls — inputs never leave your browser",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section tone="muted" eyebrow="What we offer" title="Everything in one place">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="surface p-6" style={{ "--tint": f.tint } as CSSProperties}>
                <span className="icon-tile h-12 w-12">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Values */}
      <Section
        eyebrow="Our values"
        title="Principles we build by"
        description="These guide every tool we ship and every decision we make."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="surface p-7" style={{ "--tint": v.tint } as CSSProperties}>
                <span className="icon-tile h-12 w-12">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Disclaimer */}
      <Section tone="muted" className="py-14 md:py-16">
        <div className="surface mx-auto max-w-3xl p-7 md:p-9">
          <h2 className="text-2xl font-bold text-foreground">Important disclaimer</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">{siteConfig.name} is an educational and informational platform.</strong>{" "}
              We do not provide personalised financial advice, investment recommendations or tax advice.
            </p>
            <p>
              Calculators provide estimates based on standard formulas and your inputs. Actual returns, rates, taxes
              and outcomes vary with market conditions, policy and regulatory changes, product terms, fees and your
              individual circumstances.
            </p>
            <p>
              Always consult a qualified financial adviser or tax professional before making financial decisions.
              Past performance is not indicative of future results. Mutual fund investments are subject to market
              risks.
            </p>
          </div>
          <Link href="/disclaimer" className="btn-ghost mt-6 h-11 px-5 text-sm">
            Read the full disclaimer
          </Link>
        </div>
      </Section>
    </div>
  );
}
