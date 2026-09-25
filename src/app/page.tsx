import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  ShieldCheck,
  Newspaper,
  SlidersHorizontal,
  LineChart,
  Share2,
  Lock,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Section } from "@/components/layout/section";
import { NewsCard } from "@/components/news/news-card";
import { StructuredData } from "@/components/seo/StructuredData";
import { CalculatorCard } from "@/components/calculators/calculator-card";
import { HeroCalculator } from "@/components/home/hero-calculator";
import { HeadlineTicker } from "@/components/home/headline-ticker";
import { getNews } from "@/lib/news/rss";
import type { NewsArticle } from "@/types/news";
import { calculators, calculatorsByCategory, categories } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";

export const revalidate = 600;

const values = [
  {
    icon: Newspaper,
    tint: "#06B6D4",
    title: "Attributed news",
    body: "Headlines from established Indian financial publishers, each linked to the original story. We aggregate; we don't rewrite.",
  },
  {
    icon: Calculator,
    tint: "#10B981",
    title: "Transparent maths",
    body: "Every result shows the formula and the assumptions behind it, so you can check the numbers yourself.",
  },
  {
    icon: Lock,
    tint: "#6366F1",
    title: "Private by design",
    body: "Calculations run entirely in your browser. No accounts, no paywall and nothing you type is stored.",
  },
];

const steps = [
  {
    icon: SlidersHorizontal,
    title: "Enter your numbers",
    body: "Drag the sliders or type exact amounts, rates and durations.",
  },
  {
    icon: LineChart,
    title: "See the outcome instantly",
    body: "Results, a year-by-year chart and the split between what you put in and what it earns.",
  },
  {
    icon: Share2,
    title: "Save or share the scenario",
    body: "Every calculation has its own link — bookmark it or send it to family.",
  },
];

const popularIds = ["sip", "emi", "fd", "ppf", "retirement", "nps"];

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
  {
    q: "Is my data stored anywhere?",
    a: "No. Calculator inputs are processed in your browser and never sent to our servers.",
  },
];

export default async function Home() {
  let articles: NewsArticle[] = [];
  try {
    articles = (await getNews()).articles;
  } catch {
    articles = [];
  }
  const featured = articles.slice(0, 3);

  const popular = popularIds
    .map((id) => calculators.find((c) => c.id === id))
    .filter((c): c is (typeof calculators)[number] => Boolean(c));

  return (
    <div className="flex flex-col">
      <StructuredData
        type="FAQPage"
        data={{ questions: homepageFaqs.map((f) => ({ question: f.q, answer: f.a })) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 pb-16 pt-10 md:pb-20 md:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="animate-fade-up">
              <span className="chip">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {calculators.length} free calculators · live market news
              </span>

              <h1 className="font-display mt-6 text-5xl leading-[1.04] text-foreground md:text-6xl lg:text-7xl">
                Make every rupee <span className="text-accent">work harder.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Plan SIPs, loans, deposits and retirement with transparent calculators — and stay on top
                of the markets with headlines from India&apos;s leading financial publishers.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/toolkit/finance-calculator" className="btn-brand h-13 px-7 text-base">
                  Explore calculators
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/news" className="btn-ghost h-13 px-7 text-base">
                  <Newspaper className="h-4 w-4" />
                  Latest news
                </Link>
              </div>

              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                {["No sign-up", "100% free", "Formulas shown", "Built for India"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-fade-up [animation-delay:150ms]">
              <HeroCalculator />
            </div>
          </div>
        </div>
      </section>

      <HeadlineTicker articles={articles} />

      {/* ── Popular calculators ──────────────────────────────── */}
      <Section
        eyebrow="Most used"
        title={
          <>
            Popular <span className="text-accent">calculators</span>
          </>
        }
        description="Start with the tools people reach for most. Each one is free and shows its working."
        action={
          <Link href="/toolkit/finance-calculator" className="btn-ghost h-11 px-5 text-sm">
            All {calculators.length} calculators
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((calc) => (
            <CalculatorCard key={calc.id} calc={calc} />
          ))}
        </div>
      </Section>

      {/* ── Latest news ──────────────────────────────────────── */}
      <Section
        tone="muted"
        eyebrow="Market pulse"
        title="Latest financial news"
        description="Live headlines from Mint, Economic Times, Moneycontrol and Business Standard — each linked to the original."
        action={
          <Link href="/news" className="btn-ghost h-11 px-5 text-sm">
            All news
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        {featured.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <NewsCard article={featured[0]} featured className="md:col-span-2" />
            {featured.slice(1).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="surface p-10 text-center">
            <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 font-semibold text-foreground">News feeds are unavailable right now.</p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
              We pull headlines live from Indian financial publishers. If they&apos;re unreachable,
              nothing is shown rather than stale or invented content. Please check back shortly.
            </p>
            <Link href="/news" className="btn-brand mt-6 h-11 px-6 text-sm">
              Try the news page
            </Link>
          </div>
        )}
      </Section>

      {/* ── Browse by category ───────────────────────────────── */}
      <Section
        eyebrow="Browse"
        title="Find the right tool"
        description="Calculators grouped by the decision you're trying to make."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const items = calculatorsByCategory(cat.id);
            if (items.length === 0) return null;
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/toolkit/finance-calculator#${cat.id}`}
                className="surface surface-link group relative overflow-hidden p-6"
                style={{ "--tint": cat.tint } as CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: cat.tint }}
                />
                <div className="flex items-start gap-4">
                  <span className="icon-tile h-12 w-12 shrink-0">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-foreground">{cat.name}</h3>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                        {items.length}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cat.blurb}</p>
                    <p className="mt-3 text-xs font-medium text-muted-foreground">
                      {items.map((c) => c.name.replace(/ Calculator$/, "")).join(" · ")}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="bg-panel py-20 text-white md:py-24">
        <div className="container relative mx-auto px-4">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3 !text-[#7FD6B2] before:!bg-[#7FD6B2]">How it works</p>
            <h2 className="font-display text-3xl md:text-4xl">
              From question to answer in under a minute
            </h2>
          </div>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="relative rounded-lg border border-white/15 p-7">
                  <span className="font-display absolute right-6 top-5 text-5xl text-white/15">0{i + 1}</span>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#3FB68B] text-panel">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── Why Fistotex ─────────────────────────────────────── */}
      <Section
        eyebrow={`Why ${siteConfig.name}`}
        title="Clear assumptions. Transparent formulas."
        description="Built for people who want to understand the numbers, not just see them."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="surface p-7" style={{ "--tint": v.tint } as CSSProperties}>
                <span className="icon-tile h-12 w-12">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <Section tone="muted" eyebrow="Questions" title="Common questions">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="surface flex flex-col justify-between gap-6 p-7">
            <div>
              <ShieldCheck className="h-8 w-8 text-accent" />
              <p className="mt-4 text-lg font-bold text-foreground">Still have a question?</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We read every message and usually reply within two business days.
              </p>
            </div>
            <Link href="/contact" className="btn-brand h-11 w-fit px-5 text-sm">
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {homepageFaqs.map((faq) => (
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
        </div>
      </Section>

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <section className="bg-background py-8">
        <div className="container mx-auto px-4">
          <p className="mx-auto max-w-4xl text-center text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> {siteConfig.name} is an
            educational and informational platform. Nothing here is personalised financial,
            investment or tax advice. All figures are estimates based on the inputs and assumptions
            shown; actual outcomes will vary. Please consult a qualified adviser before making
            financial decisions.
          </p>
        </div>
      </section>
    </div>
  );
}
