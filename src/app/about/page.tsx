import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { PageHeader } from "@/components/layout/section";
import { calculators } from "@/lib/calculators/registry";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Fistotex builds free, transparent financial calculators and curates attributed market news for Indian investors. Learn who we are and how we check our numbers.",
  path: "/about",
});

/** How the site works, set as plain statements rather than icon cards. */
const practices = [
  {
    title: "Standard formulas, shown in full",
    body: "Each calculator uses the published method for its product — reducing-balance EMIs, quarterly compounding for bank deposits, PFRDA's rules for NPS — and prints the formula and assumptions next to the result.",
  },
  {
    title: "Made for Indian money",
    body: "Rupees, lakhs and crores; PPF, NPS and recurring deposits; current RBI and PFRDA conventions. Rules change, and we update the calculators when they do.",
  },
  {
    title: "Your numbers stay with you",
    body: "Calculations run in your browser and are never sent to us. There are no accounts. We show ads to stay free, and use Google Analytics only if you allow it.",
  },
  {
    title: "Education, not advice",
    body: "We explain the numbers; you make the decision. We don't sell financial products, take commissions or recommend what to buy.",
  },
  {
    title: "News, credited",
    body: "Headlines come from Mint, The Economic Times, Moneycontrol and Business Standard, unedited, and link to the original story.",
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
        title="Why Fistotex exists"
        description="Free calculators for everyday Indian money decisions, each showing its working, and the day's market news from the publishers who report it."
        crumbs={[{ name: "About" }]}
      />

      <article className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-6 text-lg leading-[1.75] text-ink-2">
            <p>
              Money decisions in India come with two kinds of help. One is the product page, built to sell
              you something, with the maths in the fine print. The other is generic advice that ignores how
              things work here: our tax rules, our savings schemes, our banks.
            </p>
            <p>
              {siteConfig.name} sits in between. You put in your own numbers, you see the result, and you
              see exactly how it was worked out. Then you decide.
            </p>
          </div>

          <h2 className="font-display mt-20 text-4xl text-foreground">How we work</h2>
          <dl className="mt-8 space-y-8">
            {practices.map((p) => (
              <div key={p.title}>
                <dt className="font-display text-2xl text-foreground">{p.title}</dt>
                <dd className="mt-2 leading-[1.75] text-ink-2">{p.body}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-ink-2">
            That covers {calculators.length} calculators today.{" "}
            <Link href="/calculators" className="font-semibold text-accent underline-offset-4 hover:underline">
              See them all
            </Link>
            .
          </p>

          <h2 id="founder" className="font-display mt-20 scroll-mt-28 text-4xl text-foreground">
            Who we are
          </h2>
          <div className="mt-8 space-y-12">
            <section aria-labelledby="founder-name" className="flex gap-5">
              <span
                aria-hidden="true"
                className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-foreground text-2xl text-background"
              >
                {siteConfig.founder.name.charAt(0)}
              </span>
              <div>
                <h3 id="founder-name" className="font-display text-2xl text-foreground">
                  {siteConfig.founder.name}
                </h3>
                <p className="text-muted-foreground">
                  {siteConfig.founder.role}, {siteConfig.name}
                </p>
                <p className="mt-3 leading-[1.75] text-ink-2">
                  {siteConfig.founder.name} founded {siteConfig.name} and leads it as CEO. The thinking behind
                  the site is his: that everyday money maths in India should be simple, transparent and free
                  to check, with every formula shown rather than buried in a black box. He is currently
                  studying for an MSc in Finance in Paris.
                </p>
              </div>
            </section>

            <section id="partner" aria-labelledby="partner-name" className="flex scroll-mt-28 gap-5">
              <span
                aria-hidden="true"
                className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-principal text-2xl text-white"
              >
                {siteConfig.partner.name.charAt(0)}
              </span>
              <div>
                <h3 id="partner-name" className="font-display text-2xl text-foreground">
                  {siteConfig.partner.name}
                </h3>
                <p className="text-muted-foreground">
                  {siteConfig.partner.role}, {siteConfig.name}
                </p>
                <p className="mt-3 leading-[1.75] text-ink-2">
                  {siteConfig.partner.name} is {siteConfig.founder.name}&apos;s partner in {siteConfig.name}.
                  He builds and maintains the calculators, checks every formula against standard financial
                  methods and curates the news sources.
                </p>
              </div>
            </section>
          </div>

          <div className="mt-20 rounded-[var(--radius)] border border-border bg-card p-7">
            <h2 className="font-display text-2xl text-foreground">What we are not</h2>
            <p className="mt-3 leading-[1.75] text-ink-2">
              Neither {siteConfig.founder.name} nor {siteConfig.partner.name} is a SEBI-registered investment
              adviser or research analyst. Nothing on {siteConfig.name} is a recommendation to buy or sell any
              security or financial product, and every figure is an estimate. For personal advice, consult a
              SEBI-registered adviser.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-brand min-h-11 px-5 text-sm">
                Write to us
              </Link>
              <Link href="/disclaimer" className="btn-ghost min-h-11 px-5 text-sm">
                Read the full disclaimer
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
