import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Calculator,
  ShieldCheck,
  Newspaper,
  Sparkles,
  Zap,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import { NewsCard } from "@/components/news/news-card";
import { StructuredData } from "@/components/seo/StructuredData";
import { getFeaturedNews } from "@/lib/news/rss";
import { calculators, calculatorsByCategory, categories } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";

export const revalidate = 600;

const values = [
  {
    icon: Newspaper,
    title: "Attributed news",
    body: "Headlines from established Indian financial publishers, each linked to the original story. We aggregate; we don't rewrite.",
  },
  {
    icon: Calculator,
    title: "Transparent calculators",
    body: "Every result shows the formula and the assumptions behind it, so you can check the maths yourself.",
  },
  {
    icon: ShieldCheck,
    title: "No sign-up, no tracking walls",
    body: "All calculators are free and open. No accounts, no paywall, no data harvesting.",
  },
];

const popularIds = ["sip", "emi", "fd", "ppf", "nps", "retirement"];

export default async function Home() {
  let featured: Awaited<ReturnType<typeof getFeaturedNews>> = [];
  try {
    featured = await getFeaturedNews(3);
  } catch {
    featured = [];
  }

  const popular = popularIds
    .map((id) => calculators.find((c) => c.id === id))
    .filter((c): c is (typeof calculators)[number] => Boolean(c));

  const base = siteConfig.url.replace(/\/$/, "");
  const homepageFaqs = [
    {
      q: "Is Fistotex free to use?",
      a: "Yes. Every calculator and all news coverage on Fistotex is free, with no account required.",
    },
    {
      q: "Do you give investment advice?",
      a: "No. Fistotex provides educational tools and aggregated news. We do not offer personalised investment, tax or legal advice.",
    },
    {
      q: "How accurate are the calculators?",
      a: "They apply standard financial formulas, which are shown on each page. Results are estimates and will differ from actual outcomes because of taxes, fees, market movement and product-specific terms.",
    },
  ];

  return (
    <div className="flex flex-col">
      <StructuredData
        type="FAQPage"
        data={{ questions: homepageFaqs.map((f) => ({ question: f.q, answer: f.a })) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-border bg-gradient-to-b from-muted/60 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Indian markets · {calculators.length} calculators · free
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-6xl">
              Finance, without the noise.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Smarter financial decisions start with clear numbers. Read attributed financial news
              and use transparent calculators to plan your money with confidence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/toolkit/finance-calculator"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore finance calculators
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/news"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Read latest news
              </Link>
            </div>

            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {[
                { k: `${calculators.length}`, v: "Calculators" },
                { k: "4", v: "News sources" },
                { k: "₹0", v: "Cost to use" },
                { k: "INR", v: "Built for India" },
              ].map((stat) => (
                <div key={stat.v}>
                  <dt className="tnum text-2xl font-semibold text-foreground">{stat.k}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{stat.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Featured news ────────────────────────────────────── */}
      <Section
        eyebrow="Curated read"
        title="Latest financial news"
        description="Live headlines from Mint, Economic Times, Moneycontrol and Business Standard — each linked to the original."
        action={
          <Link
            href="/news"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            All news
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        {featured.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="surface p-8 text-center">
            <p className="text-foreground">News feeds are unavailable right now.</p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
              We pull headlines live from Indian financial publishers. If they&apos;re unreachable,
              nothing is shown rather than stale or invented content. Please check back shortly.
            </p>
            <Link
              href="/news"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              Try the news page
            </Link>
          </div>
        )}
      </Section>

      {/* ── Popular calculators ──────────────────────────────── */}
      <Section
        tone="muted"
        eyebrow="Toolkit"
        title="Popular calculators"
        description="Start with the ones people use most. Every calculator is free and shows its working."
        action={
          <Link
            href="/toolkit/finance-calculator"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.id}
                href={`/toolkit/finance-calculator/${calc.id}`}
                className="surface surface-link group flex flex-col p-6"
              >
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Icon className="h-5 w-5" />
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

      {/* ── Browse by category ───────────────────────────────── */}
      <Section
        eyebrow="Browse"
        title="Find the right tool"
        description="Calculators grouped by what you're trying to decide."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const items = calculatorsByCategory(cat.id);
            if (items.length === 0) return null;
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/toolkit/finance-calculator#${cat.id}`}
                className="surface surface-link group flex items-start gap-4 p-6"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{items.length}</span>
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                    {cat.blurb}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ── Why Fistotex ─────────────────────────────────────── */}
      <Section
        tone="muted"
        eyebrow="Why Fistotex"
        title="Clear assumptions, transparent formulas"
        description="Built for people who want to understand the numbers, not just see them."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="surface p-6">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <Section eyebrow="Questions" title="Common questions">
        <div className="max-w-3xl divide-y divide-border border-y border-border">
          {homepageFaqs.map((faq) => (
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

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Section tone="muted">
        <div className="surface flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">
              <Zap className="h-3.5 w-3.5" />
              Get started
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Run your first calculation in under a minute
            </h2>
            <p className="mt-2 text-muted-foreground">
              No account. No sign-up. Just the numbers.
            </p>
          </div>
          <Link
            href="/toolkit/finance-calculator/sip"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <TrendingUp className="h-4 w-4" />
            Try the SIP calculator
          </Link>
        </div>
      </Section>

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <section className="border-t border-border bg-background py-8">
        <div className="container mx-auto px-4">
          <p className="mx-auto max-w-4xl text-center text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> {siteConfig.name} is an
            educational and informational platform. Nothing here is personalised financial,
            investment or tax advice. All figures are estimates based on the inputs and assumptions
            shown; actual outcomes will vary. Please consult a qualified adviser before making
            financial decisions. {base.replace(/^https?:\/\//, "")}
          </p>
        </div>
      </section>
    </div>
  );
}
