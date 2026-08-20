import type { Metadata } from "next";
import SIPCalculatorClient from "./sip-calculator-client";

export const metadata: Metadata = {
  title: "SIP Calculator | FinanceHub",
  description: "Estimate the potential future value of your monthly SIP investments based on your investment amount, expected return and investment duration.",
};

export default function SIPCalculatorPage() {
  return <SIPCalculatorClient />;
}
