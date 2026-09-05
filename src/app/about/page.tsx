import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Target, Users, Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "About Fistotex",
  description: "Learn about Fistotex - your trusted financial companion for expert news, powerful calculators, and smart money tools. Our mission is to empower every Indian with financial knowledge.",
  openGraph: {
    title: "About Fistotex | Your Trusted Financial Companion",
    description: "Learn about Fistotex - empowering every Indian with financial knowledge through expert news and calculators.",
    type: "website",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
};

const values = [
  {
    icon: Target,
    title: "Accuracy First",
    description: "Every calculator uses verified formulas. Every news piece comes from trusted sources. We don't compromise on accuracy.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    description: "Clear assumptions, disclosed limitations, no hidden agendas. You deserve to know exactly how calculations work.",
  },
  {
    icon: Users,
    title: "User-Centric",
    description: "Built for real people making real decisions. No jargon, no complexity - just clear, actionable financial insights.",
  },
  {
    icon: Lightbulb,
    title: "Education Over Advice",
    description: "We provide tools and information, not personalized advice. Empowering you to make your own informed decisions.",
  },
  {
    icon: BookOpen,
    title: "Continuous Learning",
    description: "Financial markets evolve. So do we. Our tools and content are constantly updated to reflect latest regulations and market realities.",
  },
];

const features = [
  {
    icon: "📊",
    title: "14+ Financial Calculators",
    description: "SIP, EMI, FD, PPF, NPS, Retirement, CAGR, XIRR, and more - covering every aspect of personal finance planning.",
  },
  {
    icon: "📰",
    title: "Curated Financial News",
    description: "Aggregated from Mint, Moneycontrol, Economic Times - India's most trusted financial publications.",
  },
  {
    icon: "🇮🇳",
    title: "India-Focused",
    description: "Built specifically for Indian investors with INR currency, Indian tax rules, and local financial products.",
  },
  {
    icon: "💡",
    title: "Educational Content",
    description: "Every calculator includes explanations, formulas, examples, and FAQs to build your financial literacy.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData type="WebPage" data={{ title: "About Fistotex", description: "Learn about Fistotex - your trusted financial companion for expert news, powerful calculators, and smart money tools." }} />
      <StructuredData type="Organization" />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6">
              About {siteConfig.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Empowering every Indian with the financial knowledge and tools to make smarter money decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/toolkit/finance-calculator">
                  Explore Calculators
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/news">Read Latest News</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Mission</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6 text-lg">
                In a country where financial literacy remains low but aspirations run high, <strong>{siteConfig.name}</strong> was born from a simple belief: <em>every Indian deserves access to reliable financial tools and information.</em>
              </p>
              <p className="mb-6">
                We noticed a gap. On one side, complex financial products with hidden terms. On the other, generic advice that doesn't account for Indian realities - our tax laws, our investment options, our economic context.
              </p>
              <p className="mb-6">
                {siteConfig.name} bridges this gap. We provide:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Accurate calculators</strong> built on standard financial formulas with transparent assumptions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Trusted news aggregation</strong> from India's leading financial publications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>Educational content</strong> that explains the 'why' behind every calculation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span><strong>India-specific tools</strong> for SIP, PPF, NPS, tax planning, and more</span>
                </li>
              </ul>
              <p className="font-medium">
                We don't give financial advice. We give you the tools to make your own informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we build and every decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="h-full">
                  <CardContent className="pt-6 space-y-4">
                    <div className="p-3 rounded-lg bg-primary/5 text-primary w-fit">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive financial tools designed for Indian investors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border bg-card shadow-sm">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Important Disclaimer</h2>
            <div className="prose prose-sm max-w-none text-left">
              <p className="text-muted-foreground mb-4">
                <strong>{siteConfig.name} is an educational and informational platform.</strong> We do not provide personalized financial advice, investment recommendations, or tax advice.
              </p>
              <p className="text-muted-foreground mb-4">
                All calculators provide estimates based on standard formulas and user-provided inputs. Actual returns, interest rates, tax implications, and outcomes may vary significantly based on:
              </p>
              <ul className="text-muted-foreground mb-4 space-y-2">
                <li>Market conditions and economic factors</li>
                <li>Changes in government policies, tax laws, and regulations</li>
                <li>Specific terms and conditions of financial products</li>
                <li>Fees, charges, and expense ratios</li>
                <li>Individual financial circumstances</li>
              </ul>
              <p className="text-muted-foreground">
                <strong>Always consult with a qualified financial advisor, tax professional, or certified financial planner before making any investment or financial decisions.</strong> Past performance is not indicative of future results. Mutual fund investments are subject to market risks.
              </p>
            </div>
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/disclaimer">Read Full Disclaimer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              We'd love to hear from you. Whether it's feedback, suggestions, or partnership inquiries.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}