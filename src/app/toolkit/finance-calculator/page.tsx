import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, TrendingUp, ShieldCheck, Landmark, PiggyBank, ChartBar } from "lucide-react";

export const metadata: Metadata = {
  title: "Finance Calculator | FinanceHub",
  description: "Calculate investments, loans, savings, retirement and financial growth with our easy-to-use calculators.",
};

const allCalculators = [
  { id: "sip", name: "SIP Calculator", description: "Calculate returns on your Systematic Investment Plan", category: "Investment", icon: TrendingUp },
  { id: "lumpsum", name: "Lumpsum Calculator", description: "Calculate lumpsum investment returns", category: "Investment", icon: TrendingUp },
  { id: "mutual-fund", name: "Mutual Fund Calculator", description: "Calculate mutual fund returns (SIP & Lumpsum)", category: "Investment", icon: TrendingUp },
  { id: "cagr", name: "CAGR Calculator", description: "Calculate Compound Annual Growth Rate", category: "Investment", icon: TrendingUp },
  { id: "xirr", name: "XIRR Calculator", description: "Calculate XIRR for irregular cash flows", category: "Investment", icon: TrendingUp },
  { id: "emi", name: "EMI Calculator", description: "Calculate your loan EMIs with ease", category: "Loans", icon: Landmark },
  { id: "loan", name: "Loan Calculator", description: "Calculate loan amount and repayment schedule", category: "Loans", icon: Landmark },
  { id: "fd", name: "FD Calculator", description: "Estimate returns on Fixed Deposits", category: "Savings", icon: PiggyBank },
  { id: "rd", name: "RD Calculator", description: "Calculate Recurring Deposit maturity value", category: "Savings", icon: PiggyBank },
  { id: "ppf", name: "PPF Calculator", description: "Plan your Public Provident Fund investments", category: "Savings", icon: PiggyBank },
  { id: "nps", name: "NPS Calculator", description: "Calculate National Pension System returns", category: "Retirement", icon: ShieldCheck },
  { id: "retirement", name: "Retirement Calculator", description: "Plan for a comfortable retirement", category: "Retirement", icon: ShieldCheck },
  { id: "bond", name: "Bond Calculator", description: "Calculate bond yield and returns", category: "Fixed Income", icon: ChartBar },
  { id: "inflation", name: "Inflation Calculator", description: "Calculate inflation impact on purchasing power", category: "Planning", icon: Calculator },
];

export default function FinanceCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Finance Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate investments, loans, savings, retirement and financial growth with our easy-to-use calculators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCalculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.id}
                href={`/toolkit/finance-calculator/${calc.id}`}
                className="group flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">{calc.category}</span>
                    <h3 className="font-semibold text-primary mb-1 group-hover:text-primary/80 transition-colors">
                      {calc.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{calc.description}</p>
                  </div>
                </div>
                <div className="mt-auto pt-4 flex items-center text-sm font-medium text-primary">
                  Calculate
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
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
