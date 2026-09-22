import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculators/calculator-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "SIP Calculator",
  description:
    "Estimate the potential future value of your monthly SIP investments based on your investment amount, expected return and duration.",
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, "")}/toolkit/finance-calculator/sip` },
};

export default function SIPCalculatorPage() {
  return <CalculatorPage id="sip" />;
}
