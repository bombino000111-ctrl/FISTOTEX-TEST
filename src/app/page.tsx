import Link from "next/link";
import { ArrowRight, TrendingUp, Calculator, ShieldCheck, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getFeaturedNews } from "@/lib/news/news-service";
import { NewsCard } from "@/components/news/news-card";
import { CalculatorCard } from "@/components/calculators/calculator-card";

const popularCalculators = [
  {
    id: "sip",
    name: "SIP Calculator",
    description: "Calculate returns on your Systematic Investment Plan",
    icon: "TrendingUp",
    path: "/toolkit/finance-calculator/sip",
  },
  {
    id: "emi",
    name: "EMI Calculator",
    description: "Calculate your loan EMIs with ease",
    icon: "Calculator",
    path: "/toolkit/finance-calculator/emi",
  },
  {
    id: "fd",
    name: "FD Calculator",
    description: "Estimate returns on Fixed Deposits",
    icon: "ShieldCheck",
    path: "/toolkit/finance-calculator/fd",
  },
  {
    id: "cagr",
    name: "CAGR Calculator",
    description: "Calculate Compound Annual Growth Rate",
    icon: "TrendingUp",
    path: "/toolkit/finance-calculator/cagr",
  },
  {
    id: "ppf",
    name: "PPF Calculator",
    description: "Plan your Public Provident Fund investments",
    icon: "ShieldCheck",
    path: "/toolkit/finance-calculator/ppf",
  },
  {
    id: "retirement",
    name: "Retirement Calculator",
    description: "Plan for a comfortable retirement",
    icon: "Calculator",
    path: "/toolkit/finance-calculator/retirement",
  },
];

export default async function Home() {
  const featuredNews = await getFeaturedNews(4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6">
              Smarter Financial Decisions Start Here
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stay informed with the latest financial news and use powerful calculators to plan your money with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/toolkit/finance-calculator">
                  Explore Finance Calculators
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

      {/* Featured News */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Featured Financial News</h2>
            <p className="text-muted-foreground">Stay updated with the latest from the financial world</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/news">View All News</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Calculators */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Popular Calculators</h2>
            <p className="text-muted-foreground">Quick tools for your financial planning needs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCalculators.map((calc) => (
              <CalculatorCard key={calc.id} calculator={calc} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/toolkit/finance-calculator">
                View All Calculators
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why FinanceHub */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Why {siteConfig.name}?</h2>
            <p className="text-muted-foreground">Your trusted partner in financial planning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-card shadow-sm">
              <Newspaper className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Stay Informed</h3>
              <p className="text-muted-foreground">
                Get financial news from multiple trusted sources to make informed decisions.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card shadow-sm">
              <Calculator className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Plan Better</h3>
              <p className="text-muted-foreground">
                Use our powerful calculators to understand potential investment outcomes and loan obligations.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card shadow-sm">
              <ShieldCheck className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Simple & Transparent</h3>
              <p className="text-muted-foreground">
                Clear formulas and assumptions. No hidden charges or misleading claims.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> The information provided on {siteConfig.name} is for educational and informational purposes only. 
              Our calculators provide estimates based on the inputs provided and assumptions used. Actual returns, interest, taxes, fees, 
              and outcomes may vary. This website does not provide personalized financial advice. Please consult with a qualified financial 
              advisor before making any investment decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
