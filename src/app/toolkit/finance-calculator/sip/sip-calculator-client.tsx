"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculateSIP } from "@/lib/calculators";
import { formatCurrency } from "@/lib/utils";
import { SIPChart } from "@/components/charts/sip-chart";

export default function SIPCalculatorClient() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [result, setResult] = useState(calculateSIP({ monthlyInvestment, annualReturn, years }));

  useEffect(() => {
    setResult(calculateSIP({ monthlyInvestment, annualReturn, years }));
  }, [monthlyInvestment, annualReturn, years]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/toolkit/finance-calculator" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Calculators
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">SIP Calculator</h1>
          <p className="text-muted-foreground max-w-2xl">
            Estimate the potential future value of your monthly SIP investments based on your investment amount, expected return and investment duration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
                <Input
                  id="monthly-investment"
                  type="number"
                  value={String(monthlyInvestment)}
                  onChange={(e) => setMonthlyInvestment(Math.max(0, Number(e.target.value)))}
                  min={0}
                />
                <Slider
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  min={0}
                  max={100000}
                  step={500}
                  className="mt-2"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="annual-return">Expected Annual Return (%)</Label>
                <Input
                  id="annual-return"
                  type="number"
                  value={String(annualReturn)}
                  onChange={(e) => setAnnualReturn(Math.max(0, Math.min(30, Number(e.target.value))))}
                  min={0}
                  max={30}
                />
                <Slider
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  min={0}
                  max={30}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="years">Investment Duration (Years)</Label>
                <Input
                  id="years"
                  type="number"
                  value={String(years)}
                  onChange={(e) => setYears(Math.max(1, Math.min(40, Number(e.target.value))))}
                  min={1}
                  max={40}
                />
                <Slider
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  min={1}
                  max={40}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
                  <p className="text-lg md:text-xl font-bold text-primary">{formatCurrency(result.totalInvested)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Estimated Returns</p>
                  <p className="text-lg md:text-xl font-bold text-green-600">{formatCurrency(result.estimatedReturns)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Maturity Value</p>
                  <p className="text-lg md:text-xl font-bold text-primary">{formatCurrency(result.futureValue)}</p>
                </div>
              </div>

              <div className="h-64">
                <SIPChart
                  totalInvested={result.totalInvested}
                  estimatedReturns={result.estimatedReturns}
                  months={result.months}
                />
              </div>

              <p className="text-xs text-muted-foreground text-center">
                * Chart shows invested amount vs estimated returns over time
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">How SIP Calculation Works</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-4">
              A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds. The power of compounding helps your investments grow over time.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <p className="font-mono text-sm">
                Formula: FV = P × [((1+r)^n - 1) / r] × (1+r)
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Where P = Monthly investment, r = Monthly rate (annual rate / 12 / 100), n = Number of months (years × 12)
              </p>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Example</h3>
            <p className="text-muted-foreground">
              If you invest ₹{formatCurrency(monthlyInvestment)} per month for {years} years at an expected annual return of {annualReturn}%, 
              your total investment would be {formatCurrency(result.totalInvested)} and the estimated maturity value would be {formatCurrency(result.futureValue)}.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-primary mb-1">What is a SIP?</h3>
              <p className="text-sm text-muted-foreground">
                SIP stands for Systematic Investment Plan. It&apos;s a method of investing a fixed amount regularly in mutual funds at predetermined intervals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-1">How is SIP return calculated?</h3>
              <p className="text-sm text-muted-foreground">
                SIP returns are calculated using the future value of annuity formula, which accounts for regular monthly investments and compound interest.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-1">Is SIP return guaranteed?</h3>
              <p className="text-sm text-muted-foreground">
                No, SIP returns are not guaranteed. They depend on market performance and the underlying assets of the mutual fund scheme.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-muted/50 border">
          <h3 className="font-semibold text-primary mb-2">Disclaimer</h3>
          <p className="text-sm text-muted-foreground">
            These calculators provide estimates for educational and planning purposes only. Actual results may vary based on market conditions, taxes, fees, financial institution policies and other factors. This website does not provide personalized financial advice. Mutual fund investments are subject to market risks.
          </p>
        </div>
      </div>
    </div>
  );
}