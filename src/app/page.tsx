import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { StructuredData } from "@/components/seo/StructuredData";
import { HeroCalculator } from "@/components/home/hero-calculator";
import { GazetteIndex } from "@/components/home/gazette-index";
import { GoalJourneys } from "@/components/calculators/goal-journeys";
import { RecentStrip } from "@/components/calculators/recent-strip";
import { DispatchCard } from "@/components/news/dispatch-card";
import { getNews } from "@/lib/news/rss";
import type { NewsArticle } from "@/types/news";
import { calculators } from "@/lib/calculators/registry";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Fistotex: Free SIP, EMI & FD Calculators + Market News",
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export const revalidate = 600;

/** What the site promises, set as three plain statements beside the FAQ. */
const principles = [
  {
    title: "Your numbers stay with you",
    body: "Every amount you type is worked out in your browser and never sent to us. There are no accounts and no database of users. We show ads to stay free and, only if you allow it, use Google Analytics. Neither ever receives the numbers you enter.",
  },
  {
    title: "Every formula is on the page",
    body: "Each calculator prints the formula it uses and the conventions behind it: reducing-balance EMIs, quarterly compounding for bank deposits, and PFRDA's current annuity rules for NPS. You can check our working.",
  },
  {
    title: "News, credited to its source",
    body: "Headlines come from established Indian business publishers and link to the original story. We don't rewrite or summarise them.",
  },
];

const homepageFaqs = [
  {
    q: "Why are Fistotex calculations completely free?",
    a: "Fistotex is supported by ads. We do not sell financial products, take commissions, or act as an insurance or credit agent. The tools run on your own device, so hosting costs stay small.",
  },
  {
    q: "Does Fistotex recommend specific mutual funds or stocks?",
    a: "No. We provide educational calculators and syndicated headlines only. We are neither a SEBI Registered Investment Adviser nor a Research Analyst, and nothing here is personalised advice.",
  },
  {
    q: "How are Indian fixed deposit returns calculated here?",
    a: "Unlike simplistic tools that compound annually, the FD calculator uses the quarterly compounding convention Indian banks actually apply — A = P × (1 + r/4)^(4t) — so the maturity figure matches a bank's own working.",
  },
  {
    q: "Where are my inputs stored when I bookmark a calculation?",
    a: "Scenarios are saved in the part of the link after the # sign, for example #monthlyInvestment=10000&years=15. Browsers never send that part to any server — not to us, not to analytics or ads — so you can bookmark a link or send it to family.",
  },
];

export default async function Home() {
  let articles: NewsArticle[] = [];
  try {
    articles = (await getNews()).articles;
  } catch {
    articles = [];
  }

  const [lead, ...secondary] = articles.slice(0, 3);

  return (
    <div className="flex flex-col">
      <StructuredData
        type="FAQPage"
        data={{ questions: homepageFaqs.map((f) => ({ question: f.q, answer: f.a })) }}
      />

      {/* Hero: a working SIP, engraved as a rosette */}
      <section className="container mx-auto px-4 pb-20 pt-12 sm:pt-16 lg:pb-28 lg:pt-20">
        <HeroCalculator>
          <h1 className="font-masthead text-5xl text-foreground sm:text-6xl lg:text-7xl">
            See what a monthly SIP becomes.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-2">
            Move the sliders. Each ring is a year of saving: taupe for what you put in, gold
            for what it grows into. It&apos;s all worked out in your browser and never sent to us.
          </p>
        </HeroCalculator>
      </section>

      {/* Calculators */}
      <section className="border-t border-border bg-card/60 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <RecentStrip className="mb-12" />

          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
              {calculators.length} calculators, one plain answer each
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              Grouped by the decision in front of you. Not sure where to begin? Pick a goal and
              follow the steps.
            </p>
          </div>

          <GoalJourneys className="mb-20" />
          <GazetteIndex />
        </div>
      </section>

      {/* Market news */}
      <section className="container mx-auto px-4 py-20 lg:py-28">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">Today in the markets</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              Headlines from Mint, The Economic Times, Moneycontrol and Business Standard, each
              linked to the original story.
            </p>
          </div>
          <Link href="/news" className="btn-ghost min-h-11 shrink-0 self-start px-5 text-sm md:self-auto">
            All market news
          </Link>
        </div>

        {lead ? (
          <div className="space-y-6">
            <DispatchCard article={lead} lead />
            {secondary.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {secondary.map((article) => (
                  <DispatchCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="surface p-10 text-center">
            <p className="font-display text-2xl text-foreground">Headlines aren&apos;t loading right now</p>
            <p className="mx-auto mt-3 max-w-lg leading-relaxed text-ink-2">
              The publishers&apos; feeds didn&apos;t respond. We show nothing rather than old or
              invented headlines. The news page retries on every visit.
            </p>
            <Link href="/news" className="btn-brand mt-6 min-h-11 px-6 text-sm">
              Open the news page
            </Link>
          </div>
        )}
      </section>

      {/* How it works + questions */}
      <section className="border-t border-border py-20 lg:py-28">
        <div className="container mx-auto grid grid-cols-1 gap-16 px-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          <div>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
              How {siteConfig.name} works
            </h2>
            <dl className="mt-10 space-y-9">
              {principles.map((p) => (
                <div key={p.title}>
                  <dt className="font-display text-2xl text-foreground">{p.title}</dt>
                  <dd className="mt-2 max-w-prose leading-relaxed text-ink-2">{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">Questions</h2>
            <div className="mt-10 divide-y divide-border border-y border-border">
              {homepageFaqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold text-foreground">
                    {faq.q}
                    <ChevronDown
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="max-w-prose pb-6 leading-relaxed text-ink-2">{faq.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-ink-2">
              Something else?{" "}
              <Link href="/contact" className="font-semibold text-accent underline-offset-4 hover:underline">
                Write to us
              </Link>
              . We reply within two working days.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border py-10">
        <p className="container mx-auto max-w-3xl px-4 text-center text-sm leading-relaxed text-muted-foreground">
          {siteConfig.name} is for education. Nothing here is personalised financial, investment or
          tax advice, and every figure is an estimate from the inputs and assumptions shown. We are
          not registered with SEBI as an investment adviser or research analyst.
        </p>
      </section>
    </div>
  );
}
