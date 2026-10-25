/* ────────────────────────────────────────────────────────────────
   "Your next step" — where each calculator naturally leads.

   Every result raises a follow-up question (a ₹58L corpus: what will it buy
   in 2036?). Each step answers one, and carries the visitor's own numbers
   into the next calculator through the link hash, so they never retype them.
   Target values are clamped to the target's field ranges on arrival.
   ──────────────────────────────────────────────────────────────── */

import { formatCompactCurrency } from "@/lib/utils";

type Values = Record<string, number | string>;

export interface NextStep {
  to: string;
  title: string;
  body: string;
  carry: Record<string, number>;
}

interface StepDef {
  to: string;
  title: (v: Values, headline: number) => string;
  body: string;
  carry?: (v: Values, headline: number) => Record<string, number>;
}

const n = (v: unknown) => Number(v) || 0;
const money = (x: number) => formatCompactCurrency(Math.round(x));
/** Round to the nearest ₹500 so carried amounts sit on slider steps. */
const toStep = (x: number) => Math.max(500, Math.round(x / 500) * 500);
const yearAhead = (years: number) => new Date().getFullYear() + Math.round(years);

const steps: Record<string, StepDef[]> = {
  sip: [
    {
      to: "inflation",
      title: (v, h) => `What will ${money(h)} buy in ${yearAhead(n(v.years))}?`,
      body: "See the corpus in today's rupees after inflation.",
      carry: (v, h) => ({ currentAmount: Math.round(h), years: n(v.years) }),
    },
    {
      to: "retirement",
      title: () => "Is this on track for retirement?",
      body: "Work out the corpus you'd actually need to stop working.",
    },
    {
      to: "lumpsum",
      title: () => "Have a lump sum to invest too?",
      body: "Same return and duration, invested once.",
      carry: (v) => ({ annualReturn: n(v.annualReturn), years: n(v.years) }),
    },
  ],
  lumpsum: [
    {
      to: "inflation",
      title: (v, h) => `What will ${money(h)} buy in ${yearAhead(n(v.years))}?`,
      body: "See the final value in today's rupees.",
      carry: (v, h) => ({ currentAmount: Math.round(h), years: n(v.years) }),
    },
    {
      to: "sip",
      title: () => "Invest monthly instead?",
      body: "Compare with a SIP at the same return and duration.",
      carry: (v) => ({ annualReturn: n(v.annualReturn), years: n(v.years) }),
    },
    {
      to: "cagr",
      title: () => "Check a real investment's growth",
      body: "Turn a start and end value into an annual rate.",
      carry: (v, h) => ({ initialValue: n(v.initialInvestment), finalValue: Math.round(h), years: n(v.years) }),
    },
  ],
  "mutual-fund": [
    {
      to: "inflation",
      title: (v, h) => `What will ${money(h)} buy in ${yearAhead(n(v.years))}?`,
      body: "See the maturity value in today's rupees.",
      carry: (v, h) => ({ currentAmount: Math.round(h), years: n(v.years) }),
    },
    {
      to: "xirr",
      title: () => "Already investing? Measure your real return",
      body: "XIRR turns monthly investments and today's value into one annual rate.",
    },
    {
      to: "retirement",
      title: () => "Is this on track for retirement?",
      body: "Work out the corpus you'd need to stop working.",
    },
  ],
  cagr: [
    {
      to: "inflation",
      title: () => "Did it beat inflation?",
      body: "See what your starting amount would need to be worth today.",
      carry: (v) => ({ currentAmount: n(v.initialValue), years: n(v.years) }),
    },
    {
      to: "xirr",
      title: () => "Invested in instalments instead?",
      body: "XIRR handles money added over time.",
    },
    {
      to: "lumpsum",
      title: () => "Project the next stretch",
      body: "Grow today's value forward at an assumed return.",
      carry: (v) => ({ initialInvestment: n(v.finalValue), years: n(v.years) }),
    },
  ],
  xirr: [
    {
      to: "sip",
      title: () => "Project this SIP forward",
      body: "Same monthly amount — what could it grow into?",
      carry: (v) => ({ monthlyInvestment: n(v.monthlyInvestment), years: n(v.years) }),
    },
    {
      to: "inflation",
      title: (v) => `What is ${money(n(v.currentValue))} worth in real terms?`,
      body: "Adjust today's value for future inflation.",
      carry: (v) => ({ currentAmount: n(v.currentValue) }),
    },
    {
      to: "cagr",
      title: () => "Single investment instead?",
      body: "CAGR is the simpler measure for one-time investments.",
    },
  ],
  emi: [
    {
      to: "loan",
      title: (_v, h) => `Could ${money(h)} a month borrow more elsewhere?`,
      body: "Flip it around: start from the EMI you can afford.",
      carry: (v, h) => ({ monthlyEmi: toStep(h), interestRate: n(v.interestRate), tenureYears: n(v.tenureYears) }),
    },
    {
      to: "rd",
      title: () => "Save for the down payment",
      body: "Plan a monthly recurring deposit towards it.",
    },
    {
      to: "fd",
      title: () => "Park the down payment safely",
      body: "See what a fixed deposit earns while you wait.",
    },
  ],
  loan: [
    {
      to: "emi",
      title: (_v, h) => `See the full cost of a ${money(h)} loan`,
      body: "Total interest and the year-by-year picture.",
      carry: (v, h) => ({ loanAmount: Math.round(h), interestRate: n(v.interestRate), tenureYears: n(v.tenureYears) }),
    },
    {
      to: "rd",
      title: () => "Save for the down payment",
      body: "Plan a monthly recurring deposit towards it.",
    },
    {
      to: "inflation",
      title: () => "What will the home cost by then?",
      body: "Project today's price forward with inflation.",
    },
  ],
  fd: [
    {
      to: "inflation",
      title: (v, h) => `What is ${money(h)} worth in today's rupees?`,
      body: "Fixed returns can quietly lose to inflation. Check.",
      carry: (v, h) => ({ currentAmount: Math.round(h), years: n(v.tenureYears) }),
    },
    {
      to: "rd",
      title: () => "Saving monthly instead?",
      body: "A recurring deposit at the same rate and tenure.",
      carry: (v) => ({ interestRate: n(v.interestRate), tenureYears: n(v.tenureYears) }),
    },
    {
      to: "ppf",
      title: () => "Want a tax-free alternative?",
      body: "PPF interest and maturity are fully tax-exempt.",
    },
  ],
  rd: [
    {
      to: "sip",
      title: (v) => `${money(n(v.monthlyDeposit))} a month in a SIP?`,
      body: "Same amount and duration in an equity mutual fund.",
      carry: (v) => ({ monthlyInvestment: toStep(n(v.monthlyDeposit)), years: n(v.tenureYears) }),
    },
    {
      to: "fd",
      title: () => "Have the amount up front?",
      body: "A fixed deposit at the same rate and tenure.",
      carry: (v) => ({ interestRate: n(v.interestRate), tenureYears: n(v.tenureYears) }),
    },
    {
      to: "ppf",
      title: () => "Want a tax-free alternative?",
      body: "PPF interest and maturity are fully tax-exempt.",
    },
  ],
  ppf: [
    {
      to: "inflation",
      title: (v, h) => `What will ${money(h)} buy in ${yearAhead(n(v.years))}?`,
      body: "See the maturity value in today's rupees.",
      carry: (v, h) => ({ currentAmount: Math.round(h), years: n(v.years) }),
    },
    {
      to: "nps",
      title: () => "Add NPS for retirement",
      body: "Extra tax deduction, with market-linked growth.",
    },
    {
      to: "sip",
      title: () => "Same amount in equity?",
      body: "Compare with a monthly SIP over the same years.",
      carry: (v) => ({ monthlyInvestment: toStep(n(v.annualInvestment) / 12), years: n(v.years) }),
    },
  ],
  nps: [
    {
      to: "retirement",
      title: () => "Will this cover your retirement?",
      body: "Compare with the corpus your expenses actually need.",
      carry: (v) => ({ currentAge: n(v.currentAge), retirementAge: n(v.retirementAge) }),
    },
    {
      to: "inflation",
      title: (v, h) => `What will ${money(h)} buy at ${n(v.retirementAge)}?`,
      body: "See the corpus in today's rupees.",
      carry: (v, h) => ({ currentAmount: Math.round(h), years: n(v.retirementAge) - n(v.currentAge) }),
    },
    {
      to: "ppf",
      title: () => "Pair it with PPF",
      body: "A guaranteed, tax-free base alongside NPS.",
    },
  ],
  retirement: [
    {
      to: "sip",
      title: () => "Start the monthly saving",
      body: "Model the SIP that builds this corpus.",
      carry: (v) => ({ years: n(v.retirementAge) - n(v.currentAge), annualReturn: n(v.expectedReturnBeforeRetirement) }),
    },
    {
      to: "nps",
      title: () => "Use NPS for part of it",
      body: "Tax benefits plus a pension at retirement.",
      carry: (v) => ({ currentAge: n(v.currentAge), retirementAge: n(v.retirementAge) }),
    },
    {
      to: "inflation",
      title: () => "See how inflation moves the target",
      body: "Your yearly expenses, projected to retirement.",
      carry: (v) => ({
        currentAmount: n(v.currentMonthlyExpenses) * 12,
        inflationRate: n(v.expectedInflation),
        years: n(v.retirementAge) - n(v.currentAge),
      }),
    },
  ],
  bond: [
    {
      to: "fd",
      title: () => "Compare with a bank FD",
      body: "The guaranteed alternative over the same tenure.",
      carry: (v) => ({ tenureYears: n(v.yearsToMaturity) }),
    },
    {
      to: "inflation",
      title: () => "Does the coupon beat inflation?",
      body: "Check what fixed income is worth in real terms.",
      carry: (v) => ({ years: n(v.yearsToMaturity) }),
    },
    {
      to: "ppf",
      title: () => "Want a tax-free fixed return?",
      body: "PPF interest is fully exempt.",
    },
  ],
  inflation: [
    {
      to: "retirement",
      title: () => "Plan retirement with this inflation rate",
      body: "Size a corpus that keeps up with rising costs.",
      carry: (v) => ({ expectedInflation: n(v.inflationRate) }),
    },
    {
      to: "sip",
      title: () => "Invest to stay ahead",
      body: "See what a monthly SIP grows to over the same years.",
      carry: (v) => ({ years: n(v.years) }),
    },
    {
      to: "fd",
      title: () => "Is your FD beating inflation?",
      body: "Compare the fixed-deposit rate with the rate above.",
    },
  ],
};

/** The follow-ups for a calculator, with the visitor's values carried across. */
export function nextStepsFor(id: string, values: Values, headline: number): NextStep[] {
  return (steps[id] ?? []).map((s) => ({
    to: s.to,
    title: s.title(values, headline),
    body: s.body,
    carry: s.carry ? s.carry(values, headline) : {},
  }));
}

/** Every calculator id → the ids it leads to (for maps and related links). */
export function nextStepGraph(): Record<string, string[]> {
  return Object.fromEntries(Object.entries(steps).map(([id, list]) => [id, list.map((s) => s.to)]));
}
