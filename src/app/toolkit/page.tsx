import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, TrendingUp, ShieldCheck, Landmark, PiggyBank, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Financial Toolkit | FinanceHub",
  description: "Simple, powerful calculators to help you understand investments, loans, savings and long-term financial planning.",
};

const calculatorCategories = [
  {
    name: "Investment",
    icon: TrendingUp,
    calculators: [
      { id: "sip", name: "SIP Calculator", description: "Calculate returns on your Systematic Investment Plan", path: "/toolkit/finance-calculator/sip" },
      { id: "lumpsum", name: "Lumpsum Calculator", description: "Calculate lumpsum investment returns", path: "/toolkit/finance-calculator/lumpsum" },
      { id: "mutual-fund", name: "Mutual Fund Calculator", description: "Calculate mutual fund returns (SIP & Lumpsum)", path: "/toolkit/finance-calculator/mutual-fund" },
      { id: "cagr", name: "CAGR Calculator", description: "Calculate Compound Annual Growth Rate", path: "/toolkit/finance-calculator/cagr" },
      { id: "xirr", name: "XIRR Calculator", description: "Calculate XIRR for irregular cash flows", path: "/toolkit/finance-calculator/xirr" },
    ],
  },
  {
    name: "Loans",
    icon: Landmark,
    calculators: [
      { id: "emi", name: "EMI Calculator", description: "Calculate your loan EMIs with ease", path: "/toolkit/finance-calculator/emi" },
      { id: "loan", name: "Loan Calculator", description: "Calculate loan amount and repayment schedule", path: "/toolkit/finance-calculator/loan" },
    ],
  },
  {
    name: "Savings",
    icon: PiggyBank,
    calculators: [
      { id: "fd", name: "FD Calculator", description: "Estimate returns on Fixed Deposits", path: "/toolkit/finance-calculator/fd" },
      { id: "rd", name: "RD Calculator", description: "Calculate Recurring Deposit maturity value", path: "/toolkit/finance-calculator/rd" },
      { id: "ppf", name: "PPF Calculator", description: "Plan your Public Provident Fund investments", path: "/toolkit/finance-calculator/ppf" },
    ],
  },
  {
    name: "Retirement",
    icon: ShieldCheck,
    calculators: [
      { id: "nps", name: "NPS Calculator", description: "Calculate National Pension System returns", path: "/toolkit/finance-calculator/nps" },
      { id: "retirement", name: "Retirement Calculator", description: "Plan for a comfortable retirement", path: "/toolkit/finance-calculator/retirement" },
    ],
  },
  {
    name: "Fixed Income",
    icon: ChartBar,
    calculators: [
      { id: "bond", name: "Bond Calculator", description: "Calculate bond yield and returns", path: "/toolkit/finance-calculator/bond" },
    ],
  },
  {
    name: "Planning",
    icon: Calculator,
    calculators: [
      { id: "inflation", name: "Inflation Calculator", description: "Calculate inflation impact on purchasing power", path: "/toolkit/finance-calculator/inflation" },
    ],
  },
];

export default function ToolkitPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Financial Toolkit</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, powerful calculators to help you understand investments, loans, savings and long-term financial planning.
          </p>
        </div>

        <div className="space-y-12">
          {calculatorCategories.map((category) => {
            const Icon = category.icon;
            return (
              <section key={category.name}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-semibold text-primary">{category.name}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.calculators.map((calc) => (
                    <Link
                      key={calc.id}
                      href={calc.path}
                      className="group flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary mb-2 group-hover:text-primary/80 transition-colors">
                          {calc.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{calc.description}</p>
                      </div>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary">
                        Calculate
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-muted/50 border">
          <h3 className="font-semibold text-primary mb-2">Disclaimer</h3>
          <p className="text-sm text-muted-foreground">
            These calculators provide estimates for educational and planning purposes only. Actual results may vary based on market conditions, taxes, fees, financial institution policies and other factors. This website does not provide personalized financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
