import type { LucideIcon } from "lucide-react";
import {
  TrendingUp,
  PiggyBank,
  Landmark,
  ShieldCheck,
  Calculator,
  ChartBar,
  Coins,
  LineChart,
  Wallet,
  Banknote,
  Percent,
  Receipt,
} from "lucide-react";

import {
  calculateSIP,
  calculateLumpsum,
  calculateEMI,
  calculateFD,
  calculateRD,
  calculatePPF,
  calculateCAGR,
  calculateXIRR,
  calculateInflation,
  calculateRetirement,
  calculateNPS,
  calculateBond,
} from "@/lib/calculators";

/* ────────────────────────────────────────────────────────────────
   Single source of truth for every calculator.

   Adding one here gives you: the toolkit listing, the finance-calculator
   index, a statically generated page at /toolkit/finance-calculator/<id>,
   and an entry in the sitemap. No per-page wiring.
   ──────────────────────────────────────────────────────────────── */

export type CategoryId =
  | "investment"
  | "loans"
  | "savings"
  | "retirement"
  | "fixed-income"
  | "planning";

export interface Category {
  id: CategoryId;
  name: string;
  icon: LucideIcon;
  blurb: string;
}

export const categories: Category[] = [
  {
    id: "investment",
    name: "Investments",
    icon: TrendingUp,
    blurb: "Project what regular or one-time investing could grow into.",
  },
  {
    id: "loans",
    name: "Loans",
    icon: Landmark,
    blurb: "Understand EMIs, interest cost and repayment schedules.",
  },
  {
    id: "savings",
    name: "Savings",
    icon: PiggyBank,
    blurb: "Fixed deposits, recurring deposits and small-savings schemes.",
  },
  {
    id: "retirement",
    name: "Retirement",
    icon: ShieldCheck,
    blurb: "Work out the corpus you need and how much to set aside.",
  },
  {
    id: "fixed-income",
    name: "Fixed income",
    icon: ChartBar,
    blurb: "Bond pricing, yield and income from debt instruments.",
  },
  {
    id: "planning",
    name: "Planning",
    icon: Calculator,
    blurb: "Everyday planning tools for costs and purchasing power.",
  },
];

export type FieldKind = "currency" | "percent" | "years" | "number" | "select" | "age";

export interface CalcField {
  key: string;
  label: string;
  kind: FieldKind;
  min?: number;
  max?: number;
  step?: number;
  help?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface CalcOutput {
  label: string;
  value: number | string;
  kind: "currency" | "percent" | "number" | "years";
  tone?: "default" | "positive";
  emphasis?: boolean;
}

export interface ChartPoint {
  label: string;
  invested: number;
  value: number;
}

export interface CalculatorDef {
  id: string;
  name: string;
  tagline: string;
  category: CategoryId;
  icon: LucideIcon;
  fields: CalcField[];
  defaults: Record<string, number | string>;
  compute: (v: Record<string, number | string>) => CalcOutput[];
  chart?: (v: Record<string, number | string>) => ChartPoint[];
  chartSeriesLabels?: { invested: string; value: string };
  formula: { expression: string; note: string };
  steps: string[];
  faqs: Array<{ q: string; a: string }>;
}

/* ── helpers ─────────────────────────────────────────────────── */
const num = (v: unknown): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
};

const str = (v: unknown): string => String(v ?? "");

const yearlySipSeries = (
  monthly: number,
  annualReturn: number,
  years: number
): ChartPoint[] => {
  const r = annualReturn / 12 / 100;
  const points: ChartPoint[] = [];
  for (let y = 0; y <= years; y++) {
    const months = y * 12;
    const invested = monthly * months;
    const value =
      months === 0
        ? 0
        : r === 0
          ? invested
          : monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    points.push({ label: `${y}Y`, invested, value });
  }
  return points;
};

/* ── definitions ─────────────────────────────────────────────── */

const sip: CalculatorDef = {
  id: "sip",
  name: "SIP Calculator",
  tagline: "Estimate the future value of a monthly investment.",
  category: "investment",
  icon: TrendingUp,
  fields: [
    { key: "monthlyInvestment", label: "Monthly investment", kind: "currency", min: 500, max: 200000, step: 500, help: "How much you invest every month." },
    { key: "annualReturn", label: "Expected annual return", kind: "percent", min: 1, max: 30, step: 0.5, help: "An assumption, not a promise. Equity funds have historically ranged widely." },
    { key: "years", label: "Investment duration", kind: "years", min: 1, max: 40, step: 1 },
  ],
  defaults: { monthlyInvestment: 10000, annualReturn: 12, years: 10 },
  compute: (v) => {
    const r = calculateSIP({
      monthlyInvestment: num(v.monthlyInvestment),
      annualReturn: num(v.annualReturn),
      years: num(v.years),
    });
    return [
      { label: "Total invested", value: r.totalInvested, kind: "currency" },
      { label: "Estimated returns", value: r.estimatedReturns, kind: "currency", tone: "positive" },
      { label: "Maturity value", value: r.futureValue, kind: "currency", emphasis: true },
    ];
  },
  chart: (v) => yearlySipSeries(num(v.monthlyInvestment), num(v.annualReturn), num(v.years)),
  chartSeriesLabels: { invested: "Invested", value: "Estimated value" },
  formula: {
    expression: "FV = P × [((1 + r)ⁿ − 1) / r] × (1 + r)",
    note: "P = monthly investment, r = annual return ÷ 12 ÷ 100, n = months invested. Assumes returns compound monthly.",
  },
  steps: [
    "Each instalment is compounded for the months it stays invested.",
    "Later instalments have less time to grow, so the first years matter most.",
    "The result assumes a constant return — real markets are uneven.",
  ],
  faqs: [
    { q: "What is a SIP?", a: "A Systematic Investment Plan invests a fixed amount in mutual funds at regular intervals, usually monthly." },
    { q: "Is the return guaranteed?", a: "No. Mutual fund returns depend on the market and the scheme's holdings. This is a projection based on the rate you enter." },
    { q: "Does a step-up help?", a: "Increasing your SIP each year meaningfully raises the final value, because the larger instalments still have years to compound." },
  ],
};

const lumpsum: CalculatorDef = {
  id: "lumpsum",
  name: "Lumpsum Calculator",
  tagline: "Project how a one-time investment could grow.",
  category: "investment",
  icon: Coins,
  fields: [
    { key: "initialInvestment", label: "One-time investment", kind: "currency", min: 5000, max: 10000000, step: 5000 },
    { key: "annualReturn", label: "Expected annual return", kind: "percent", min: 1, max: 30, step: 0.5 },
    { key: "years", label: "Duration", kind: "years", min: 1, max: 40, step: 1 },
  ],
  defaults: { initialInvestment: 500000, annualReturn: 12, years: 10 },
  compute: (v) => {
    const r = calculateLumpsum({
      initialInvestment: num(v.initialInvestment),
      annualReturn: num(v.annualReturn),
      years: num(v.years),
    });
    return [
      { label: "Amount invested", value: r.initialInvestment, kind: "currency" },
      { label: "Estimated returns", value: r.estimatedReturns, kind: "currency", tone: "positive" },
      { label: "Final value", value: r.finalValue, kind: "currency", emphasis: true },
    ];
  },
  chart: (v) => {
    const p = num(v.initialInvestment);
    const r = num(v.annualReturn) / 100;
    const years = num(v.years);
    const out: ChartPoint[] = [];
    for (let y = 0; y <= years; y++) {
      out.push({ label: `${y}Y`, invested: p, value: p * Math.pow(1 + r, y) });
    }
    return out;
  },
  chartSeriesLabels: { invested: "Principal", value: "Estimated value" },
  formula: {
    expression: "FV = P × (1 + r)ⁿ",
    note: "P = amount invested, r = annual return ÷ 100, n = years.",
  },
  steps: [
    "Compounding applies to the whole balance every year.",
    "Time is the dominant factor — doubling the duration more than doubles the growth.",
  ],
  faqs: [
    { q: "Lumpsum or SIP?", a: "Lumpsum invests everything at once and is fully exposed to the market from day one. SIP spreads entry over time. Many investors use both." },
    { q: "Does this include tax?", a: "No. Tax depends on the instrument and your holding period. Reduce the final value by your applicable rate to estimate the post-tax figure." },
  ],
};

const mutualFund: CalculatorDef = {
  id: "mutual-fund",
  name: "Mutual Fund Calculator",
  tagline: "Compare SIP and lumpsum outcomes side by side.",
  category: "investment",
  icon: LineChart,
  fields: [
    { key: "mode", label: "Investment mode", kind: "select", options: [ { value: "sip", label: "Monthly SIP" }, { value: "lumpsum", label: "One-time lumpsum" } ] },
    { key: "amount", label: "Amount (monthly, or one-time)", kind: "currency", min: 500, max: 10000000, step: 500 },
    { key: "annualReturn", label: "Expected annual return", kind: "percent", min: 1, max: 30, step: 0.5 },
    { key: "years", label: "Duration", kind: "years", min: 1, max: 40, step: 1 },
  ],
  defaults: { mode: "sip", amount: 10000, annualReturn: 12, years: 10 },
  compute: (v) => {
    const amount = num(v.amount);
    const annualReturn = num(v.annualReturn);
    const years = num(v.years);

    if (str(v.mode) === "lumpsum") {
      const r = calculateLumpsum({ initialInvestment: amount, annualReturn, years });
      return [
        { label: "Amount invested", value: r.initialInvestment, kind: "currency" },
        { label: "Estimated returns", value: r.estimatedReturns, kind: "currency", tone: "positive" },
        { label: "Final value", value: r.finalValue, kind: "currency", emphasis: true },
      ];
    }

    const r = calculateSIP({ monthlyInvestment: amount, annualReturn, years });
    return [
      { label: "Total invested", value: r.totalInvested, kind: "currency" },
      { label: "Estimated returns", value: r.estimatedReturns, kind: "currency", tone: "positive" },
      { label: "Maturity value", value: r.futureValue, kind: "currency", emphasis: true },
    ];
  },
  chart: (v) =>
    str(v.mode) === "lumpsum"
      ? lumpsum.chart!(v)
      : yearlySipSeries(num(v.amount), num(v.annualReturn), num(v.years)),
  chartSeriesLabels: { invested: "Invested", value: "Estimated value" },
  formula: {
    expression: "SIP: FV = P × [((1+r)ⁿ − 1) / r] × (1+r)     Lumpsum: FV = P × (1+r)ⁿ",
    note: "Switch the investment mode above to apply the matching formula.",
  },
  steps: [
    "SIP smooths your entry price across market cycles.",
    "Lumpsum gives every rupee the full time horizon to compound.",
    "Neither is universally better — it depends on your cash flow.",
  ],
  faqs: [
    { q: "What is NAV?", a: "Net Asset Value is the per-unit price of a mutual fund. Your units × NAV gives your investment value." },
    { q: "What is an expense ratio?", a: "The annual fee a fund charges, expressed as a percentage of assets. It reduces your net return, so this calculator's return rate should be your expected net figure." },
  ],
};

const cagr: CalculatorDef = {
  id: "cagr",
  name: "CAGR Calculator",
  tagline: "Find the smoothed annual growth rate between two values.",
  category: "investment",
  icon: Percent,
  fields: [
    { key: "initialValue", label: "Initial value", kind: "currency", min: 1000, max: 100000000, step: 1000 },
    { key: "finalValue", label: "Final value", kind: "currency", min: 1000, max: 100000000, step: 1000 },
    { key: "years", label: "Number of years", kind: "years", min: 1, max: 50, step: 1 },
  ],
  defaults: { initialValue: 100000, finalValue: 250000, years: 5 },
  compute: (v) => {
    const r = calculateCAGR({
      initialValue: num(v.initialValue),
      finalValue: num(v.finalValue),
      years: num(v.years),
    });
    return [
      { label: "Absolute return", value: r.absoluteReturn, kind: "percent", tone: "positive" },
      { label: "CAGR", value: r.cagr, kind: "percent", emphasis: true },
    ];
  },
  formula: {
    expression: "CAGR = (Final ÷ Initial)^(1 ÷ n) − 1",
    note: "n = number of years. The result is the constant annual rate that would take you from the initial to the final value.",
  },
  steps: [
    "CAGR smooths out volatility into a single comparable number.",
    "It does not reflect the actual path the investment took.",
  ],
  faqs: [
    { q: "CAGR vs absolute return?", a: "Absolute return is the total percentage gain. CAGR converts it into an equivalent per-year rate, which makes investments of different durations comparable." },
    { q: "CAGR vs XIRR?", a: "CAGR assumes a single investment held for the whole period. XIRR handles multiple cash flows at different dates." },
  ],
};

const xirr: CalculatorDef = {
  id: "xirr",
  name: "XIRR Calculator",
  tagline: "Annualised return for a monthly investment ending in a current value.",
  category: "investment",
  icon: TrendingUp,
  fields: [
    { key: "monthlyInvestment", label: "Monthly investment", kind: "currency", min: 500, max: 500000, step: 500 },
    { key: "currentValue", label: "Current value", kind: "currency", min: 1000, max: 200000000, step: 1000 },
    { key: "years", label: "Duration", kind: "years", min: 1, max: 40, step: 1 },
  ],
  defaults: { monthlyInvestment: 10000, currentValue: 2000000, years: 10 },
  compute: (v) => {
    const monthly = num(v.monthlyInvestment);
    const years = num(v.years);
    const months = Math.max(1, Math.round(years * 12));

    const flows: Array<{ date: string; amount: number }> = [];
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    for (let i = 0; i < months; i++) {
      const d = new Date(start);
      d.setMonth(start.getMonth() + i);
      flows.push({ date: d.toISOString().slice(0, 10), amount: -monthly });
    }
    const end = new Date();
    flows.push({ date: end.toISOString().slice(0, 10), amount: num(v.currentValue) });

    const r = calculateXIRR({ cashFlows: flows });

    if (r.xirr === null) {
      return [
        { label: "Total invested", value: r.totalInvested, kind: "currency" },
        { label: "Current value", value: r.currentValue, kind: "currency" },
        { label: "XIRR", value: r.error ? "Could not solve" : "—", kind: "number" },
      ];
    }

    return [
      { label: "Total invested", value: r.totalInvested, kind: "currency" },
      { label: "Current value", value: r.currentValue, kind: "currency" },
      { label: "Absolute return", value: r.absoluteReturn, kind: "percent", tone: "positive" },
      { label: "XIRR", value: r.xirr, kind: "percent", emphasis: true },
    ];
  },
  formula: {
    expression: "Σ [ Ci ÷ (1 + XIRR)^((di − d0) ÷ 365) ] = 0",
    note: "Solved numerically with the Newton–Raphson method. Ci are the cash flows and di their dates.",
  },
  steps: [
    "Each monthly instalment is treated as a dated outflow.",
    "The final value is a single dated inflow.",
    "XIRR is the annual rate that makes the net present value zero.",
  ],
  faqs: [
    { q: "Why is XIRR different from CAGR?", a: "CAGR assumes one lump sum held for the whole period. XIRR accounts for money entering at different times, so it better reflects a SIP's true annualised return." },
    { q: "Why might it fail to solve?", a: "If the current value is far too small or large relative to the contributions, no sensible rate exists and the solver reports it rather than inventing a number." },
  ],
};

const emi: CalculatorDef = {
  id: "emi",
  name: "EMI Calculator",
  tagline: "Work out your monthly loan instalment and total interest.",
  category: "loans",
  icon: Landmark,
  fields: [
    { key: "loanAmount", label: "Loan amount", kind: "currency", min: 50000, max: 50000000, step: 50000 },
    { key: "interestRate", label: "Interest rate", kind: "percent", min: 1, max: 30, step: 0.1 },
    { key: "tenureYears", label: "Tenure", kind: "years", min: 1, max: 30, step: 1 },
  ],
  defaults: { loanAmount: 2500000, interestRate: 8.5, tenureYears: 20 },
  compute: (v) => {
    const r = calculateEMI({
      loanAmount: num(v.loanAmount),
      interestRate: num(v.interestRate),
      tenureYears: num(v.tenureYears),
    });
    return [
      { label: "Total interest", value: r.totalInterest, kind: "currency" },
      { label: "Total payment", value: r.totalPayment, kind: "currency" },
      { label: "Monthly EMI", value: r.monthlyEMI, kind: "currency", emphasis: true },
    ];
  },
  chart: (v) => {
    const loan = num(v.loanAmount);
    const annualRate = num(v.interestRate);
    const years = num(v.tenureYears);
    const r = annualRate / 12 / 100;
    const months = Math.round(years * 12);
    const emiValue =
      r === 0 ? loan / months : (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);

    const out: ChartPoint[] = [];
    let balance = loan;
    for (let y = 0; y <= years; y++) {
      const paid = Math.min(months, y * 12);
      const outstanding = Math.max(0, balance);
      out.push({
        label: `${y}Y`,
        invested: loan - outstanding,
        value: loan,
      });
      for (let m = 0; m < 12 && paid + m < months; m++) {
        const interest = balance * r;
        balance = balance - (emiValue - interest);
      }
    }
    return out;
  },
  chartSeriesLabels: { invested: "Principal repaid", value: "Loan amount" },
  formula: {
    expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
    note: "P = principal, r = annual rate ÷ 12 ÷ 100, n = tenure in months.",
  },
  steps: [
    "Early instalments are mostly interest; later ones mostly principal.",
    "A longer tenure lowers the EMI but raises total interest.",
    "Even a small rate reduction saves a large amount over a long loan.",
  ],
  faqs: [
    { q: "Does a longer tenure help?", a: "It reduces the monthly outgo, but you pay more interest overall because the balance stays outstanding longer." },
    { q: "Should I prepay?", a: "Prepaying early in the loan saves the most interest, since that is when the interest component is largest. Check for prepayment charges first." },
  ],
};

const loan: CalculatorDef = {
  id: "loan",
  name: "Loan Eligibility Calculator",
  tagline: "See how much you can borrow for a given EMI.",
  category: "loans",
  icon: Banknote,
  fields: [
    { key: "monthlyEmi", label: "EMI you can pay", kind: "currency", min: 1000, max: 500000, step: 1000 },
    { key: "interestRate", label: "Interest rate", kind: "percent", min: 1, max: 30, step: 0.1 },
    { key: "tenureYears", label: "Tenure", kind: "years", min: 1, max: 30, step: 1 },
  ],
  defaults: { monthlyEmi: 25000, interestRate: 8.5, tenureYears: 20 },
  compute: (v) => {
    const emiValue = num(v.monthlyEmi);
    const annualRate = num(v.interestRate);
    const years = num(v.tenureYears);
    const r = annualRate / 12 / 100;
    const n = Math.round(years * 12);

    const principal =
      r === 0 ? emiValue * n : (emiValue * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    const totalPayment = emiValue * n;
    const totalInterest = totalPayment - principal;

    return [
      { label: "Total interest", value: totalInterest, kind: "currency" },
      { label: "Total payment", value: totalPayment, kind: "currency" },
      { label: "Estimated loan amount", value: principal, kind: "currency", emphasis: true },
    ];
  },
  formula: {
    expression: "P = EMI × ((1 + r)ⁿ − 1) ÷ (r × (1 + r)ⁿ)",
    note: "The EMI formula rearranged to solve for the principal you can borrow.",
  },
  steps: [
    "This is the reverse of the EMI calculation.",
    "Lenders also apply income and credit-score limits, so treat this as an upper bound.",
  ],
  faqs: [
    { q: "Will the bank lend me exactly this?", a: "Not necessarily. Lenders also consider your income, existing obligations, credit score and the property or asset being financed." },
  ],
};

const fd: CalculatorDef = {
  id: "fd",
  name: "FD Calculator",
  tagline: "Maturity value of a fixed deposit.",
  category: "savings",
  icon: PiggyBank,
  fields: [
    { key: "principal", label: "Deposit amount", kind: "currency", min: 1000, max: 50000000, step: 1000 },
    { key: "interestRate", label: "Interest rate", kind: "percent", min: 0.5, max: 15, step: 0.05 },
    { key: "tenureYears", label: "Tenure", kind: "years", min: 1, max: 20, step: 1 },
    { key: "compoundingFrequency", label: "Compounding", kind: "select", options: [ { value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" }, { value: "half-yearly", label: "Half-yearly" }, { value: "yearly", label: "Yearly" } ] },
  ],
  defaults: { principal: 500000, interestRate: 7.1, tenureYears: 5, compoundingFrequency: "quarterly" },
  compute: (v) => {
    const r = calculateFD({
      principal: num(v.principal),
      interestRate: num(v.interestRate),
      tenureYears: num(v.tenureYears),
      compoundingFrequency: str(v.compoundingFrequency) as
        | "monthly"
        | "quarterly"
        | "half-yearly"
        | "yearly",
    });
    return [
      { label: "Deposit amount", value: r.principal, kind: "currency" },
      { label: "Interest earned", value: r.interestEarned, kind: "currency", tone: "positive" },
      { label: "Maturity amount", value: r.maturityAmount, kind: "currency", emphasis: true },
    ];
  },
  chart: (v) => {
    const p = num(v.principal);
    const freqMap: Record<string, number> = { monthly: 12, quarterly: 4, "half-yearly": 2, yearly: 1 };
    const n = freqMap[str(v.compoundingFrequency)] ?? 4;
    const rate = num(v.interestRate) / 100;
    const years = num(v.tenureYears);
    const out: ChartPoint[] = [];
    for (let y = 0; y <= years; y++) {
      out.push({ label: `${y}Y`, invested: p, value: p * Math.pow(1 + rate / n, n * y) });
    }
    return out;
  },
  chartSeriesLabels: { invested: "Principal", value: "Maturity value" },
  formula: {
    expression: "A = P × (1 + r ÷ n)^(n × t)",
    note: "P = principal, r = annual rate ÷ 100, n = compounding periods per year, t = years.",
  },
  steps: [
    "More frequent compounding produces a slightly higher maturity value.",
    "Interest is taxable at your slab rate; TDS may apply above the threshold.",
  ],
  faqs: [
    { q: "Is the FD rate fixed for the whole tenure?", a: "Yes for a standard fixed deposit. A floating-rate FD changes with the benchmark, so this calculator assumes a fixed rate." },
    { q: "What about senior citizen rates?", a: "Banks usually offer an additional 0.25–0.50% to senior citizens. Enter the rate you are actually offered." },
  ],
};

const rd: CalculatorDef = {
  id: "rd",
  name: "RD Calculator",
  tagline: "Maturity value of a monthly recurring deposit.",
  category: "savings",
  icon: Wallet,
  fields: [
    { key: "monthlyDeposit", label: "Monthly deposit", kind: "currency", min: 500, max: 500000, step: 500 },
    { key: "interestRate", label: "Interest rate", kind: "percent", min: 0.5, max: 15, step: 0.05 },
    { key: "tenureYears", label: "Tenure", kind: "years", min: 1, max: 15, step: 1 },
  ],
  defaults: { monthlyDeposit: 10000, interestRate: 6.8, tenureYears: 5 },
  compute: (v) => {
    const r = calculateRD({
      monthlyDeposit: num(v.monthlyDeposit),
      interestRate: num(v.interestRate),
      tenureYears: num(v.tenureYears),
    });
    return [
      { label: "Total deposits", value: r.totalDeposits, kind: "currency" },
      { label: "Interest earned", value: r.interestEarned, kind: "currency", tone: "positive" },
      { label: "Maturity value", value: r.maturityValue, kind: "currency", emphasis: true },
    ];
  },
  chart: (v) => {
    const monthly = num(v.monthlyDeposit);
    const rate = num(v.interestRate);
    const years = num(v.tenureYears);
    const out: ChartPoint[] = [];
    for (let y = 0; y <= years; y++) {
      out.push({
        label: `${y}Y`,
        invested: monthly * y * 12,
        value: calculateRD({ monthlyDeposit: monthly, interestRate: rate, tenureYears: y }).maturityValue,
      });
    }
    return out;
  },
  chartSeriesLabels: { invested: "Deposited", value: "Value" },
  formula: {
    expression: "Each instalment is compounded quarterly for the months it remains invested.",
    note: "Banks compute RD interest on a quarterly compounded basis; small differences from your bank's figure are normal rounding.",
  },
  steps: [
    "The first instalment earns the most interest; the last earns least.",
    "RDs are useful for building a fixed sum without a lump sum upfront.",
  ],
  faqs: [
    { q: "RD or SIP?", a: "An RD gives a guaranteed, fixed return. A SIP is market-linked with no guarantee but historically higher long-run expectations. They serve different goals." },
  ],
};

const ppf: CalculatorDef = {
  id: "ppf",
  name: "PPF Calculator",
  tagline: "Project your Public Provident Fund maturity value.",
  category: "savings",
  icon: ShieldCheck,
  fields: [
    { key: "annualInvestment", label: "Annual investment", kind: "currency", min: 500, max: 150000, step: 500, help: "PPF allows up to ₹1,50,000 per financial year." },
    { key: "years", label: "Tenure", kind: "years", min: 15, max: 50, step: 1, help: "PPF matures in 15 years and can be extended in 5-year blocks." },
    { key: "interestRate", label: "Interest rate", kind: "percent", min: 1, max: 15, step: 0.1, help: "Government-notified and revised quarterly. Defaults to 7.1%." },
  ],
  defaults: { annualInvestment: 150000, years: 15, interestRate: 7.1 },
  compute: (v) => {
    const r = calculatePPF({
      annualInvestment: num(v.annualInvestment),
      years: num(v.years),
      interestRate: num(v.interestRate),
    });
    return [
      { label: "Total contributed", value: r.totalContribution, kind: "currency" },
      { label: "Interest earned", value: r.estimatedInterest, kind: "currency", tone: "positive" },
      { label: "Maturity amount", value: r.maturityAmount, kind: "currency", emphasis: true },
    ];
  },
  chart: (v) => {
    const annual = num(v.annualInvestment);
    const rate = num(v.interestRate);
    const years = num(v.years);
    const out: ChartPoint[] = [];
    for (let y = 0; y <= years; y++) {
      out.push({
        label: `${y}Y`,
        invested: annual * y,
        value: calculatePPF({ annualInvestment: annual, years: y, interestRate: rate }).maturityAmount,
      });
    }
    return out;
  },
  chartSeriesLabels: { invested: "Contributions", value: "Balance" },
  formula: {
    expression: "Balance compounds yearly: Balanceₙ = (Balanceₙ₋₁ + Contribution) × (1 + r)",
    note: "Interest is credited annually on the balance including that year's deposit.",
  },
  steps: [
    "Contributions, interest and maturity are exempt from tax (EEE status).",
    "Depositing before the 5th of April maximises that year's interest.",
  ],
  faqs: [
    { q: "What is the maximum I can invest?", a: "₹1,50,000 per financial year across all your PPF accounts." },
    { q: "Can I withdraw early?", a: "Partial withdrawal is allowed from the 7th financial year, subject to limits." },
  ],
};

const nps: CalculatorDef = {
  id: "nps",
  name: "NPS Calculator",
  tagline: "Estimate your National Pension System corpus and pension.",
  category: "retirement",
  icon: ShieldCheck,
  fields: [
    { key: "currentAge", label: "Current age", kind: "age", min: 18, max: 65, step: 1 },
    { key: "retirementAge", label: "Retirement age", kind: "age", min: 40, max: 75, step: 1 },
    { key: "monthlyContribution", label: "Monthly contribution", kind: "currency", min: 500, max: 200000, step: 500 },
    { key: "expectedReturn", label: "Expected return", kind: "percent", min: 1, max: 20, step: 0.5 },
    { key: "annuityPercentage", label: "Annuity allocation", kind: "percent", min: 40, max: 100, step: 5, help: "At least 40% of the corpus must buy an annuity." },
    { key: "expectedAnnuityRate", label: "Annuity rate", kind: "percent", min: 1, max: 12, step: 0.5 },
  ],
  defaults: { currentAge: 30, retirementAge: 60, monthlyContribution: 10000, expectedReturn: 10, annuityPercentage: 40, expectedAnnuityRate: 6 },
  compute: (v) => {
    const r = calculateNPS({
      currentAge: num(v.currentAge),
      retirementAge: num(v.retirementAge),
      monthlyContribution: num(v.monthlyContribution),
      expectedReturn: num(v.expectedReturn),
      annuityPercentage: num(v.annuityPercentage),
      expectedAnnuityRate: num(v.expectedAnnuityRate),
    });
    return [
      { label: "Total contributed", value: r.totalContribution, kind: "currency" },
      { label: "Lump sum available", value: r.lumpSumWithdrawal, kind: "currency" },
      { label: "Annuity corpus", value: r.annuityCorpus, kind: "currency" },
      { label: "Estimated monthly pension", value: r.estimatedMonthlyPension, kind: "currency", emphasis: true },
    ];
  },
  chart: (v) => {
    const monthly = num(v.monthlyContribution);
    const rate = num(v.expectedReturn);
    const years = Math.max(0, num(v.retirementAge) - num(v.currentAge));
    return yearlySipSeries(monthly, rate, years);
  },
  chartSeriesLabels: { invested: "Contributions", value: "Projected corpus" },
  formula: {
    expression: "Corpus uses the SIP formula; the annuity portion pays corpus × annuity rate each year.",
    note: "Pension = (corpus × annuity %) × annuity rate ÷ 12.",
  },
  steps: [
    "The lump-sum portion is tax-free; the annuity income is taxable as salary.",
    "A higher annuity allocation means a safer but usually smaller income.",
  ],
  faqs: [
    { q: "How much must go into an annuity?", a: "At least 40% of the corpus at retirement. The remaining 60% can be withdrawn as a lump sum." },
    { q: "Is NPS tax-efficient?", a: "Contributions may qualify for deduction under Section 80CCD, subject to the applicable limits for your regime." },
  ],
};

const retirement: CalculatorDef = {
  id: "retirement",
  name: "Retirement Calculator",
  tagline: "Find the corpus you need and the monthly saving to get there.",
  category: "retirement",
  icon: Calculator,
  fields: [
    { key: "currentAge", label: "Current age", kind: "age", min: 18, max: 70, step: 1 },
    { key: "retirementAge", label: "Retirement age", kind: "age", min: 35, max: 80, step: 1 },
    { key: "lifeExpectancy", label: "Life expectancy", kind: "age", min: 60, max: 100, step: 1 },
    { key: "currentMonthlyExpenses", label: "Current monthly expenses", kind: "currency", min: 5000, max: 1000000, step: 5000 },
    { key: "currentSavings", label: "Current savings set aside", kind: "currency", min: 0, max: 100000000, step: 10000 },
    { key: "expectedInflation", label: "Expected inflation", kind: "percent", min: 1, max: 12, step: 0.5 },
    { key: "expectedReturnBeforeRetirement", label: "Return before retirement", kind: "percent", min: 1, max: 20, step: 0.5 },
    { key: "expectedReturnAfterRetirement", label: "Return after retirement", kind: "percent", min: 1, max: 15, step: 0.5 },
  ],
  defaults: {
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 85,
    currentMonthlyExpenses: 60000,
    currentSavings: 500000,
    expectedInflation: 6,
    expectedReturnBeforeRetirement: 11,
    expectedReturnAfterRetirement: 7,
  },
  compute: (v) => {
    const r = calculateRetirement({
      currentAge: num(v.currentAge),
      retirementAge: num(v.retirementAge),
      currentMonthlyExpenses: num(v.currentMonthlyExpenses),
      expectedInflation: num(v.expectedInflation),
      lifeExpectancy: num(v.lifeExpectancy),
      currentSavings: num(v.currentSavings),
      expectedReturnBeforeRetirement: num(v.expectedReturnBeforeRetirement),
      expectedReturnAfterRetirement: num(v.expectedReturnAfterRetirement),
    });
    return [
      { label: "Monthly expenses at retirement", value: r.estimatedMonthlyRetirementExpense, kind: "currency" },
      { label: "Projected savings corpus", value: r.currentProjectedCorpus, kind: "currency" },
      { label: "Corpus required", value: r.requiredRetirementCorpus, kind: "currency" },
      r.isOnTrack
        ? { label: "Shortfall", value: 0, kind: "currency", tone: "positive" }
        : { label: "Shortfall", value: r.shortfall, kind: "currency", emphasis: true },
      { label: "Monthly saving needed", value: r.monthlySavingsRequired, kind: "currency", emphasis: true },
    ];
  },
  formula: {
    expression: "Required corpus = PV of inflation-adjusted expenses over the retirement years",
    note: "Uses the real (post-inflation) return during retirement to discount future expenses back to retirement date.",
  },
  steps: [
    "Expenses are inflated to your retirement date first.",
    "The corpus is the present value of those expenses across retirement.",
    "Existing savings are grown to retirement and netted off.",
  ],
  faqs: [
    { q: "Why does inflation matter so much?", a: "At 6% inflation, monthly expenses roughly triple in 20 years. Ignoring it is the most common retirement planning mistake." },
    { q: "Should I include a pension?", a: "If you expect a pension or annuity, subtract its present value from the required corpus before setting your target." },
  ],
};

const bond: CalculatorDef = {
  id: "bond",
  name: "Bond Calculator",
  tagline: "Current yield and approximate yield to maturity.",
  category: "fixed-income",
  icon: ChartBar,
  fields: [
    { key: "faceValue", label: "Face value", kind: "currency", min: 100, max: 10000000, step: 100 },
    { key: "couponRate", label: "Coupon rate", kind: "percent", min: 0.1, max: 20, step: 0.1 },
    { key: "marketPrice", label: "Market price", kind: "currency", min: 100, max: 10000000, step: 100 },
    { key: "yearsToMaturity", label: "Years to maturity", kind: "years", min: 1, max: 40, step: 1 },
  ],
  defaults: { faceValue: 1000, couponRate: 7.5, marketPrice: 980, yearsToMaturity: 5 },
  compute: (v) => {
    const r = calculateBond({
      faceValue: num(v.faceValue),
      couponRate: num(v.couponRate),
      marketPrice: num(v.marketPrice),
      yearsToMaturity: num(v.yearsToMaturity),
      couponFrequency: 2,
    });
    return [
      { label: "Annual coupon", value: r.annualCoupon, kind: "currency" },
      { label: r.isPremium ? "Premium over face value" : "Discount to face value", value: Math.abs(r.premiumOrDiscount), kind: "currency" },
      { label: "Current yield", value: r.currentYield, kind: "percent" },
      { label: "Approximate YTM", value: r.approximateYTM, kind: "percent", emphasis: true },
    ];
  },
  formula: {
    expression: "YTM ≈ [C + (F − P) ÷ n] ÷ [(F + P) ÷ 2]",
    note: "C = annual coupon, F = face value, P = market price, n = years to maturity. An approximation of the exact yield.",
  },
  steps: [
    "When price is below face value the bond trades at a discount and the YTM exceeds the coupon.",
    "When price is above face value it trades at a premium and the YTM is lower.",
  ],
  faqs: [
    { q: "Why does bond price move with interest rates?", a: "When new bonds offer higher rates, existing lower-coupon bonds must fall in price to stay competitive — and vice versa." },
    { q: "What is duration?", a: "A measure of how sensitive a bond's price is to rate changes. Longer-dated, lower-coupon bonds are more sensitive." },
  ],
};

const inflation: CalculatorDef = {
  id: "inflation",
  name: "Inflation Calculator",
  tagline: "See what today's money will be worth later.",
  category: "planning",
  icon: Receipt,
  fields: [
    { key: "currentAmount", label: "Amount today", kind: "currency", min: 1000, max: 100000000, step: 1000 },
    { key: "inflationRate", label: "Expected inflation", kind: "percent", min: 1, max: 15, step: 0.1 },
    { key: "years", label: "Number of years", kind: "years", min: 1, max: 50, step: 1 },
  ],
  defaults: { currentAmount: 100000, inflationRate: 6, years: 10 },
  compute: (v) => {
    const r = calculateInflation({
      currentAmount: num(v.currentAmount),
      inflationRate: num(v.inflationRate),
      years: num(v.years),
    });
    return [
      { label: "Purchasing power today of that amount", value: r.purchasingPowerEquivalent, kind: "currency" },
      { label: "Inflation factor", value: r.inflationFactor, kind: "number" },
      { label: "Cost in the future", value: r.futureCost, kind: "currency", emphasis: true },
    ];
  },
  formula: {
    expression: "Future cost = Amount × (1 + i)ⁿ     Real value = Amount ÷ (1 + i)ⁿ",
    note: "i = inflation rate ÷ 100, n = number of years.",
  },
  steps: [
    "Inflation compounds, so the effect accelerates over long periods.",
    "Real return = nominal return − inflation. That is the number that grows your actual purchasing power.",
  ],
  faqs: [
    { q: "What is a realistic inflation assumption?", a: "In India, headline CPI has typically run around 5–6% over the long term, though food and education inflation can be higher." },
    { q: "Why does this matter for investing?", a: "A 'safe' 4% fixed deposit against 6% inflation loses purchasing power every year, even though the balance grows." },
  ],
};

/* ── registry ────────────────────────────────────────────────── */

export const calculators: CalculatorDef[] = [
  sip,
  lumpsum,
  mutualFund,
  cagr,
  xirr,
  emi,
  loan,
  fd,
  rd,
  ppf,
  nps,
  retirement,
  bond,
  inflation,
];

export const calculatorIds = calculators.map((c) => c.id);

export function getCalculator(id: string): CalculatorDef | undefined {
  return calculators.find((c) => c.id === id);
}

export function calculatorsByCategory(category: CategoryId): CalculatorDef[] {
  return calculators.filter((c) => c.category === category);
}

export function iconFor(icon: LucideIcon) {
  return icon;
}
