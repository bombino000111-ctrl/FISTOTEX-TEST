export interface SIPInput {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
}

export interface SIPResult {
  totalInvested: number;
  estimatedReturns: number;
  futureValue: number;
  monthlyRate: number;
  months: number;
}

export interface LumpsumInput {
  initialInvestment: number;
  annualReturn: number;
  years: number;
}

export interface LumpsumResult {
  initialInvestment: number;
  estimatedReturns: number;
  finalValue: number;
  yearlyGrowth: Array<{ year: number; value: number }>;
}

export interface EMIInput {
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  tenureMonths?: number;
}

export interface EMIRow {
  month: number;
  principal: number;
  interest: number;
  emi: number;
  outstandingBalance: number;
}

export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: EMIRow[];
}

export interface FDInput {
  principal: number;
  interestRate: number;
  tenureYears: number;
  compoundingFrequency: "monthly" | "quarterly" | "half-yearly" | "yearly";
}

export interface FDResult {
  principal: number;
  interestEarned: number;
  maturityAmount: number;
}

export interface RDInput {
  monthlyDeposit: number;
  interestRate: number;
  tenureYears: number;
}

export interface RDResult {
  totalDeposits: number;
  interestEarned: number;
  maturityValue: number;
}

export interface PPFInput {
  annualInvestment: number;
  years: number;
  interestRate: number;
}

export interface PPFResult {
  totalContribution: number;
  estimatedInterest: number;
  maturityAmount: number;
  yearlyBreakdown: Array<{
    year: number;
    deposit: number;
    interest: number;
    balance: number;
  }>;
}

export interface NPSInput {
  currentAge: number;
  retirementAge: number;
  monthlyContribution: number;
  expectedReturn: number;
  annuityPercentage: number;
  expectedAnnuityRate: number;
}

export interface NPSResult {
  totalContribution: number;
  estimatedCorpus: number;
  lumpSumWithdrawal: number;
  annuityCorpus: number;
  estimatedMonthlyPension: number;
  estimatedAnnualPension: number;
}

export interface BondInput {
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: 1 | 2 | 4; // Annual, Semi-annual, Quarterly
}

export interface BondResult {
  annualCoupon: number;
  currentYield: number;
  approximateYTM: number;
  premiumOrDiscount: number;
  isPremium: boolean;
}

export interface CAGRInput {
  initialValue: number;
  finalValue: number;
  years: number;
}

export interface CAGRResult {
  cagr: number;
  absoluteReturn: number;
}

export interface XIRRCashFlow {
  date: string;
  amount: number;
}

export interface XIRRInput {
  cashFlows: XIRRCashFlow[];
}

export interface XIRRResult {
  xirr: number | null;
  error?: string;
  totalInvested: number;
  currentValue: number;
  absoluteReturn: number;
}

export interface InflationInput {
  currentAmount: number;
  inflationRate: number;
  years: number;
}

export interface InflationResult {
  futureCost: number;
  purchasingPowerEquivalent: number;
  inflationFactor: number;
}

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentMonthlyExpenses: number;
  expectedInflation: number;
  lifeExpectancy: number;
  currentSavings: number;
  expectedReturnBeforeRetirement: number;
  expectedReturnAfterRetirement: number;
}

export interface RetirementResult {
  estimatedMonthlyRetirementExpense: number;
  requiredRetirementCorpus: number;
  currentProjectedCorpus: number;
  shortfall: number;
  isOnTrack: boolean;
  monthlySavingsRequired: number;
}

export interface MutualFundInput {
  type: "sip" | "lumpsum";
  monthlyInvestment?: number;
  initialInvestment?: number;
  annualReturn: number;
  years: number;
}

export interface MutualFundResult {
  investment: number;
  estimatedReturns: number;
  maturityValue: number;
  profit: number;
}

// Calculator metadata
export interface CalculatorInfo {
  id: string;
  name: string;
  description: string;
  category: "investment" | "loan" | "savings" | "retirement" | "fixed-income" | "planning";
  icon: string;
  path: string;
}
