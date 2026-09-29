import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Newspaper,
  Lock,
  BookOpen,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Sigma,
  IndianRupee,
  ChevronDown,
} from "lucide-react";
import { StructuredData } from "@/components/seo/StructuredData";
import { HeroCalculator } from "@/components/home/hero-calculator";
import { HeadlineTicker } from "@/components/home/headline-ticker";
import { GazetteIndex } from "@/components/home/gazette-index";
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

/** The four seals printed under the lead — what the reader is promised. */
const seals = [
  { icon: BadgeCheck, label: "No account needed" },
  { icon: KeyRound, label: "Zero telemetry" },
  { icon: Sigma, label: "Formulas disclosed" },
  { icon: IndianRupee, label: "Lakhs & crores math" },
];

/** The integrity pillars, stacked down the left of the manifesto section. */
const pillars = [
  {
    no: "01",
    kicker: "Zero server transmission",
    title: "100% client-side memory",
    icon: Lock,
    tint: "#0A5C36",
    body: "Every loan amount, monthly SIP commitment or retirement assumption you enter stays inside your device's memory. There is no user database, no tracking cookie and no sales outreach.",
    proof: "Auditable in your network tab",
  },
  {
    no: "02",
    kicker: "Transparent proofs",
    title: "Standard Indian math",
    icon: BookOpen,
    tint: "#C26100",
    body: "We follow RBI reducing-balance guidelines, post office and bank quarterly compounding conventions, and the PFRDA 40% annuity threshold. Every formula is printed on the page it powers.",
    proof: "RBI / SEBI / PFRDA aligned",
  },
  {
    no: "03",
    kicker: "Factual attribution",
    title: "Direct publisher credit",
    icon: Newspaper,
    tint: "#1B365D",
    body: "Financial news is syndicated from established Indian business journals without AI summarisation or rage-bait rephrasing. Every headline links to the original publisher's domain.",
    proof: "Zero clickbait rewriting",
  },
];

const homepageFaqs = [
  {
    q: "Why are Fistotex calculations completely free?",
    a: "Fistotex is an open-access reference utility. We do not sell financial products, take commissions, or act as an insurance or credit agent. The tools run on your own device, so hosting costs stay negligible.",
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
    a: "Scenarios are encoded into the browser URL itself, for example ?monthlyInvestment=10000&years=15. Nothing is stored on a server, so you can safely bookmark a link or send it to family.",
  },
];

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

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

      {/* ── Front page: manifesto + working blotter ──────────── */}
      <section className="container mx-auto px-4 pb-12 pt-8 sm:pb-16 sm:pt-12">
        {/* Sub-masthead slug line */}
        <div className="rule-heavy-b mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-3 font-mono text-xs uppercase tracking-wider">
          <div className="flex flex-wrap items-center gap-2 font-bold text-foreground">
            <span className="bg-foreground px-1.5 py-0.5 text-[10px] text-background">{today}</span>
            <span className="hidden sm:inline">
              Household finance, tax discipline &amp; compounding
            </span>
          </div>
          <span className="text-muted-foreground">Verified computations · Independent utility</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Blotter spine */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <HeroCalculator />
          </div>

          {/* Lead manifesto */}
          <div className="order-1 space-y-6 lg:order-2 lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-sm border border-brand-2/25 bg-brand-2-soft px-2.5 py-1 font-mono text-xs font-semibold text-brand-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-2" />
              Indian statutory assumptions (FY 2025–26)
            </span>

            <h1 className="font-masthead text-4xl text-foreground sm:text-5xl lg:text-6xl">
              Make every rupee work with{" "}
              <em className="font-medium italic text-accent underline decoration-amber-warm/40 decoration-wavy decoration-1 underline-offset-4">
                uncompromised clarity.
              </em>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
              Transparent mathematics, standard Indian statutory formulas, zero telemetry, entirely
              in your browser. Built for savers, homebuyers and wealth builders who want to verify
              the exact math behind their future.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/calculators" className="btn-brand px-5 py-3 text-sm">
                Inspect all {calculators.length} calculators
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#market-wire" className="btn-ghost px-5 py-3 text-sm">
                <Newspaper className="h-[18px] w-[18px] text-brand-2" />
                Read market wire
              </Link>
            </div>

            {/* Reassurance seals */}
            <ul className="grid grid-cols-2 gap-3 border-t border-border pt-6 text-xs sm:grid-cols-4">
              {seals.map((seal) => {
                const Icon = seal.icon;
                return (
                  <li
                    key={seal.label}
                    className="flex items-center gap-2 rounded-sm border border-border bg-muted/50 p-2 font-medium text-ink-2"
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0 text-accent" />
                    {seal.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Live wire ────────────────────────────────────────── */}
      <HeadlineTicker articles={articles} />

      {/* ── The calculator directory ─────────────────────────── */}
      <section className="container mx-auto px-4 py-14 sm:py-20">
        <div className="rule-heavy-b mb-10 flex flex-col gap-4 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow eyebrow-plain mb-1">Statutory calculation directory</p>
            <h2 className="font-display text-3xl font-normal text-foreground sm:text-4xl">
              All {calculators.length} financial calculators
            </h2>
            <p className="mt-1 max-w-xl text-sm text-ink-2">
              Grouped by the household decision you are evaluating. Every computation prints its
              formula and sends nothing to a server.
            </p>
          </div>
          <p className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {calculators.length} of {calculators.length} active · FY 2025–26
          </p>
        </div>

        <GazetteIndex />
      </section>

      {/* ── Market pulse ─────────────────────────────────────── */}
      <section className="rule-heavy-b container mx-auto border-t-2 border-foreground px-4 py-14 sm:py-20">
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow eyebrow-plain mb-1 !text-accent">Curated financial press</p>
            <h2 className="font-display text-3xl font-normal text-foreground sm:text-4xl">
              Market pulse &amp; institutional dispatches
            </h2>
            <p className="mt-1 max-w-xl text-sm text-ink-2">
              Live headlines from Mint, The Economic Times, Moneycontrol and Business Standard. We
              aggregate without rewriting.
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs font-bold uppercase text-accent transition-colors hover:text-foreground"
          >
            Read all dispatches
            <ArrowRight className="h-4 w-4" />
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
            <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="font-display mt-4 text-lg font-bold text-foreground">
              The wire is unreachable right now.
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-2">
              We pull headlines live from Indian financial publishers. If they are unreachable, we
              print nothing rather than stale or invented copy. Please check back shortly.
            </p>
            <Link href="/news" className="btn-brand mt-6 px-6 py-2.5 text-sm">
              Try the news page
            </Link>
          </div>
        )}
      </section>

      {/* ── Integrity pillars + questions ────────────────────── */}
      <section className="container mx-auto border-t-2 border-rule px-4 py-14 sm:py-20">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Manifesto and pillars */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <p className="eyebrow eyebrow-plain mb-1 !text-accent">
                Public service integrity guarantee
              </p>
              <h2 className="font-display text-3xl font-normal text-foreground">
                Why {siteConfig.name} looks, calculates and operates differently.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                Most modern finance apps are lead-generation funnels in disguise, built to harvest
                mobile numbers for loan brokers and fund distributors. {siteConfig.name} was built
                from day one as a plain reference ledger.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.no}
                    className="surface p-5 shadow-sm"
                    style={{ "--tint": pillar.tint } as CSSProperties}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="icon-tile h-8 w-8 shrink-0">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <div>
                        <p className="tint-text font-mono text-[10px] font-bold uppercase tracking-wider">
                          {pillar.no}. {pillar.kicker}
                        </p>
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-ink-2">{pillar.body}</p>
                    <p className="mt-3 flex items-center gap-1 border-t border-border pt-2 font-mono text-[11px] text-muted-foreground">
                      <CheckCircle2 className="tint-text h-[13px] w-[13px]" />
                      {pillar.proof}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex flex-col justify-between gap-2 border-b border-border pb-3 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow eyebrow-plain mb-1">Inquiries &amp; auditing</p>
                <h2 className="font-display text-2xl font-normal text-foreground sm:text-3xl">
                  Frequently asked questions
                </h2>
              </div>
              <Link
                href="/contact"
                className="btn-ghost self-start px-3 py-1.5 font-mono text-xs font-bold sm:self-auto"
              >
                Email editorial desk
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <p className="text-sm leading-relaxed text-ink-2">
              Have a question about a compounding formula, a statutory rate or our code? We answer
              every inquiry within two working days.
            </p>

            <div className="space-y-3 pt-2">
              {homepageFaqs.map((faq) => (
                <details key={faq.q} className="surface group border-rule p-4">
                  <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-foreground sm:text-lg">
                    {faq.q}
                    <ChevronDown
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-ink-2 sm:text-sm">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>

            {/* Statutory notice */}
            <p className="mt-6 rounded-sm border border-rule bg-muted p-4 font-mono text-[11px] leading-relaxed text-ink-2">
              <strong className="uppercase text-foreground">Statutory editorial notice:</strong>{" "}
              {siteConfig.name} is an independent informational reference platform. All figures,
              growth rates and EMI tables are mathematical simulations based on the inputs you
              supply. Actual market outcomes, bank charges, GST levies and tax liabilities under the
              old and new regimes will vary. Consult a SEBI or RBI registered professional before
              making family financial decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ── Closing ledger banner ────────────────────────────── */}
      <section className="container mx-auto mb-16 px-4">
        <div className="ledger flex flex-col items-start justify-between gap-6 p-8 sm:p-10 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-panel-accent">
              Open reference ledger
            </p>
            <h2 className="font-display mt-1 mb-2 text-2xl font-bold text-white sm:text-3xl">
              Your household money, in numbers you can independently verify.
            </h2>
            <p className="max-w-xl text-xs text-white/70 sm:text-sm">
              No advertising trackers on your inputs, no phone-number gate. Plan a home purchase,
              evaluate SIP compounding and read the wire unfiltered.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              href="/calculators"
              className="btn-brand px-5 py-2.5 font-mono text-xs font-bold uppercase"
            >
              Launch all {calculators.length} calculators
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center justify-center rounded-sm border border-white/25 px-5 py-2.5 font-mono text-xs font-bold uppercase text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              Inspect market wire
            </Link>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <section className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <p className="mx-auto flex max-w-4xl items-start justify-center gap-2 text-center text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="mt-0.5 hidden h-4 w-4 shrink-0 text-accent sm:block" />
            <span>
              <strong className="text-foreground">Disclaimer:</strong> {siteConfig.name} is an
              educational and informational platform. Nothing here is personalised financial,
              investment or tax advice. All figures are estimates based on the inputs and
              assumptions shown; actual outcomes will vary.
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
