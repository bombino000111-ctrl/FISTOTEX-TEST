import type { SIPInput, SIPResult } from "@/types/calculators";

/**
 * Calculate SIP (Systematic Investment Plan) returns
 * Formula: FV = P × [((1+r)^n - 1) / r] × (1+r)
 * Where:
 *   P = Monthly investment
 *   r = Monthly rate (annual rate / 12 / 100)
 *   n = Number of months (years × 12)
 */
export function calculateSIP(input: SIPInput): SIPResult {
  const { monthlyInvestment, annualReturn, years } = input;
  
  // Validate inputs
  if (monthlyInvestment <= 0 || years <= 0) {
    return {
      totalInvested: 0,
      estimatedReturns: 0,
      futureValue: 0,
      monthlyRate: 0,
      months: 0,
    };
  }
  
  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;
  const totalInvested = monthlyInvestment * months;
  
  let futureValue: number;
  
  if (monthlyRate === 0) {
    // Handle 0% return case
    futureValue = totalInvested;
  } else {
    // FV = P × [((1+r)^n - 1) / r] × (1+r)
    const growthFactor = Math.pow(1 + monthlyRate, months);
    futureValue = monthlyInvestment * ((growthFactor - 1) / monthlyRate) * (1 + monthlyRate);
  }
  
  const estimatedReturns = futureValue - totalInvested;
  
  return {
    totalInvested,
    estimatedReturns,
    futureValue,
    monthlyRate,
    months,
  };
}

/**
 * Calculate lumpsum investment returns
 * Formula: FV = P × (1+r)^n
 */
export function calculateLumpsum(input: {
  initialInvestment: number;
  annualReturn: number;
  years: number;
}): {
  initialInvestment: number;
  estimatedReturns: number;
  finalValue: number;
  yearlyGrowth: Array<{ year: number; value: number }>;
} {
  const { initialInvestment, annualReturn, years } = input;
  
  if (initialInvestment <= 0 || years <= 0) {
    return {
      initialInvestment: 0,
      estimatedReturns: 0,
      finalValue: 0,
      yearlyGrowth: [],
    };
  }
  
  const rate = annualReturn / 100;
  const yearlyGrowth: Array<{ year: number; value: number }> = [];
  
  for (let year = 0; year <= years; year++) {
    const value = initialInvestment * Math.pow(1 + rate, year);
    yearlyGrowth.push({ year, value });
  }
  
  const finalValue = yearlyGrowth[yearlyGrowth.length - 1].value;
  const estimatedReturns = finalValue - initialInvestment;
  
  return {
    initialInvestment,
    estimatedReturns,
    finalValue,
    yearlyGrowth,
  };
}

/**
 * Calculate EMI (Equated Monthly Installment)
 * Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(input: {
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
}): {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: Array<{
    month: number;
    principal: number;
    interest: number;
    emi: number;
    outstandingBalance: number;
  }>;
} {
  const { loanAmount, interestRate, tenureYears } = input;
  
  if (loanAmount <= 0 || tenureYears <= 0) {
    return {
      monthlyEMI: 0,
      totalInterest: 0,
      totalPayment: 0,
      amortizationSchedule: [],
    };
  }
  
  const monthlyRate = interestRate / 12 / 100;
  const months = tenureYears * 12;
  
  let monthlyEMI: number;
  
  if (monthlyRate === 0) {
    // Handle 0% interest case
    monthlyEMI = loanAmount / months;
  } else {
    // EMI = P × r × (1+r)^n / ((1+r)^n - 1)
    const growthFactor = Math.pow(1 + monthlyRate, months);
    monthlyEMI = loanAmount * monthlyRate * growthFactor / (growthFactor - 1);
  }
  
  const totalPayment = monthlyEMI * months;
  const totalInterest = totalPayment - loanAmount;
  
  // Generate amortization schedule
  const amortizationSchedule: Array<{
    month: number;
    principal: number;
    interest: number;
    emi: number;
    outstandingBalance: number;
  }> = [];
  
  let outstandingBalance = loanAmount;
  
  for (let month = 1; month <= months; month++) {
    const interestComponent = outstandingBalance * monthlyRate;
    const principalComponent = monthlyEMI - interestComponent;
    outstandingBalance -= principalComponent;
    
    // Handle last month rounding
    if (month === months && outstandingBalance > 0 && outstandingBalance < monthlyEMI) {
      amortizationSchedule.push({
        month,
        principal: outstandingBalance,
        interest: interestComponent,
        emi: monthlyEMI,
        outstandingBalance: 0,
      });
      outstandingBalance = 0;
    } else {
      amortizationSchedule.push({
        month,
        principal: Math.max(0, principalComponent),
        interest: interestComponent,
        emi: monthlyEMI,
        outstandingBalance: Math.max(0, outstandingBalance),
      });
    }
  }
  
  return {
    monthlyEMI,
    totalInterest,
    totalPayment,
    amortizationSchedule,
  };
}

/**
 * Calculate Fixed Deposit returns
 * Formula: A = P(1+r/n)^(nt)
 */
export function calculateFD(input: {
  principal: number;
  interestRate: number;
  tenureYears: number;
  compoundingFrequency: "monthly" | "quarterly" | "half-yearly" | "yearly";
}): {
  principal: number;
  interestEarned: number;
  maturityAmount: number;
} {
  const { principal, interestRate, tenureYears, compoundingFrequency } = input;
  
  if (principal <= 0 || tenureYears <= 0) {
    return {
      principal: 0,
      interestEarned: 0,
      maturityAmount: 0,
    };
  }
  
  const n = {
    monthly: 12,
    quarterly: 4,
    "half-yearly": 2,
    yearly: 1,
  }[compoundingFrequency];
  
  const rate = interestRate / 100;
  const maturityAmount = principal * Math.pow(1 + rate / n, n * tenureYears);
  const interestEarned = maturityAmount - principal;
  
  return {
    principal,
    interestEarned,
    maturityAmount,
  };
}

/**
 * Calculate Recurring Deposit returns
 * Uses the standard RD formula with quarterly compounding
 */
export function calculateRD(input: {
  monthlyDeposit: number;
  interestRate: number;
  tenureYears: number;
}): {
  totalDeposits: number;
  interestEarned: number;
  maturityValue: number;
} {
  const { monthlyDeposit, interestRate, tenureYears } = input;
  
  if (monthlyDeposit <= 0 || tenureYears <= 0) {
    return {
      totalDeposits: 0,
      interestEarned: 0,
      maturityValue: 0,
    };
  }
  
  const months = tenureYears * 12;
  const totalDeposits = monthlyDeposit * months;
  
  // RD calculation with quarterly compounding
  // Simplified formula: M = P × n + P × n(n+1)/2 × r/12 × 1/100
  // This is a simplified approximation; actual bank calculations may vary
  
  const quarterlyRate = interestRate / 4 / 100;
  const quarters = Math.floor(months / 3);
  
  // Calculate using compound interest for each deposit
  let maturityValue = 0;
  for (let i = 0; i < months; i++) {
    const remainingMonths = months - i;
    const remainingQuarters = remainingMonths / 3;
    maturityValue += monthlyDeposit * Math.pow(1 + quarterlyRate, remainingQuarters);
  }
  
  const interestEarned = maturityValue - totalDeposits;
  
  return {
    totalDeposits,
    interestEarned,
    maturityValue,
  };
}

/**
 * Calculate PPF (Public Provident Fund) returns
 */
export function calculatePPF(input: {
  annualInvestment: number;
  years: number;
  interestRate: number;
}): {
  totalContribution: number;
  estimatedInterest: number;
  maturityAmount: number;
  yearlyBreakdown: Array<{
    year: number;
    deposit: number;
    interest: number;
    balance: number;
  }>;
} {
  const { annualInvestment, years, interestRate } = input;
  
  if (annualInvestment <= 0 || years <= 0) {
    return {
      totalContribution: 0,
      estimatedInterest: 0,
      maturityAmount: 0,
      yearlyBreakdown: [],
    };
  }
  
  const rate = interestRate / 100;
  let balance = 0;
  const yearlyBreakdown: Array<{
    year: number;
    deposit: number;
    interest: number;
    balance: number;
  }> = [];
  
  for (let year = 1; year <= years; year++) {
    const interest = balance * rate;
    balance += annualInvestment + interest;
    
    yearlyBreakdown.push({
      year,
      deposit: annualInvestment,
      interest,
      balance,
    });
  }
  
  const totalContribution = annualInvestment * years;
  const estimatedInterest = balance - totalContribution;
  
  return {
    totalContribution,
    estimatedInterest,
    maturityAmount: balance,
    yearlyBreakdown,
  };
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 * Formula: CAGR = (Final / Initial)^(1/n) - 1
 */
export function calculateCAGR(input: {
  initialValue: number;
  finalValue: number;
  years: number;
}): {
  cagr: number;
  absoluteReturn: number;
} {
  const { initialValue, finalValue, years } = input;
  
  if (initialValue <= 0 || finalValue <= 0 || years <= 0) {
    return {
      cagr: 0,
      absoluteReturn: 0,
    };
  }
  
  const cagr = Math.pow(finalValue / initialValue, 1 / years) - 1;
  const absoluteReturn = ((finalValue - initialValue) / initialValue) * 100;
  
  return {
    cagr: cagr * 100, // Return as percentage
    absoluteReturn,
  };
}

/**
 * Calculate XIRR using Newton-Raphson method
 */
export function calculateXIRR(input: {
  cashFlows: Array<{ date: string; amount: number }>;
}): {
  xirr: number | null;
  error?: string;
  totalInvested: number;
  currentValue: number;
  absoluteReturn: number;
} {
  const { cashFlows } = input;
  
  if (cashFlows.length < 2) {
    return {
      xirr: null,
      error: "At least 2 cash flows are required",
      totalInvested: 0,
      currentValue: 0,
      absoluteReturn: 0,
    };
  }
  
  // Sort cash flows by date
  const sortedFlows = [...cashFlows].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const dates = sortedFlows.map((f) => new Date(f.date).getTime());
  const amounts = sortedFlows.map((f) => f.amount);
  
  // Calculate total invested (negative amounts) and current value (positive amounts)
  const totalInvested = amounts.filter((a) => a < 0).reduce((sum, a) => sum + Math.abs(a), 0);
  const currentValue = amounts.filter((a) => a > 0).reduce((sum, a) => sum + a, 0);
  const absoluteReturn = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;
  
  // First date as reference
  const firstDate = dates[0];
  const yearFraction = 365 * 24 * 60 * 60 * 1000;
  
  // NPV function
  const npv = (rate: number): number => {
    let sum = 0;
    for (let i = 0; i < dates.length; i++) {
      const t = (dates[i] - firstDate) / yearFraction;
      sum += amounts[i] / Math.pow(1 + rate, t);
    }
    return sum;
  };
  
  // Derivative of NPV
  const dnpv = (rate: number): number => {
    let sum = 0;
    for (let i = 0; i < dates.length; i++) {
      const t = (dates[i] - firstDate) / yearFraction;
      sum += (-t * amounts[i]) / Math.pow(1 + rate, t + 1);
    }
    return sum;
  };
  
  // Newton-Raphson iteration
  let rate = 0.1; // Initial guess of 10%
  const maxIterations = 100;
  const tolerance = 1e-6;
  
  for (let i = 0; i < maxIterations; i++) {
    const npvValue = npv(rate);
    const dnpvValue = dnpv(rate);
    
    if (Math.abs(dnpvValue) < tolerance) {
      break;
    }
    
    const newRate = rate - npvValue / dnpvValue;
    
    if (Math.abs(newRate - rate) < tolerance) {
      rate = newRate;
      break;
    }
    
    rate = newRate;
    
    // Keep rate within reasonable bounds
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) rate = 10;
  }
  
  // Verify the result
  const finalNpv = npv(rate);
  if (Math.abs(finalNpv) > 0.01) {
    return {
      xirr: null,
      error: "XIRR could not converge. Please check your cash flows.",
      totalInvested,
      currentValue,
      absoluteReturn,
    };
  }
  
  return {
    xirr: rate * 100, // Return as percentage
    totalInvested,
    currentValue,
    absoluteReturn,
  };
}

/**
 * Calculate inflation impact
 */
export function calculateInflation(input: {
  currentAmount: number;
  inflationRate: number;
  years: number;
}): {
  futureCost: number;
  purchasingPowerEquivalent: number;
  inflationFactor: number;
} {
  const { currentAmount, inflationRate, years } = input;
  
  if (currentAmount <= 0 || years <= 0) {
    return {
      futureCost: 0,
      purchasingPowerEquivalent: 0,
      inflationFactor: 0,
    };
  }
  
  const rate = inflationRate / 100;
  const inflationFactor = Math.pow(1 + rate, years);
  const futureCost = currentAmount * inflationFactor;
  const purchasingPowerEquivalent = currentAmount / inflationFactor;
  
  return {
    futureCost,
    purchasingPowerEquivalent,
    inflationFactor,
  };
}

/**
 * Calculate retirement planning requirements
 */
export function calculateRetirement(input: {
  currentAge: number;
  retirementAge: number;
  currentMonthlyExpenses: number;
  expectedInflation: number;
  lifeExpectancy: number;
  currentSavings: number;
  expectedReturnBeforeRetirement: number;
  expectedReturnAfterRetirement: number;
}): {
  estimatedMonthlyRetirementExpense: number;
  requiredRetirementCorpus: number;
  currentProjectedCorpus: number;
  shortfall: number;
  isOnTrack: boolean;
  monthlySavingsRequired: number;
} {
  const {
    currentAge,
    retirementAge,
    currentMonthlyExpenses,
    expectedInflation,
    lifeExpectancy,
    currentSavings,
    expectedReturnBeforeRetirement,
    expectedReturnAfterRetirement,
  } = input;
  
  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  if (yearsToRetirement <= 0 || yearsInRetirement <= 0) {
    return {
      estimatedMonthlyRetirementExpense: 0,
      requiredRetirementCorpus: 0,
      currentProjectedCorpus: 0,
      shortfall: 0,
      isOnTrack: true,
      monthlySavingsRequired: 0,
    };
  }
  
  // Calculate monthly expense at retirement (adjusted for inflation)
  const inflationFactor = Math.pow(1 + expectedInflation / 100, yearsToRetirement);
  const estimatedMonthlyRetirementExpense = currentMonthlyExpenses * inflationFactor;
  const annualExpense = estimatedMonthlyRetirementExpense * 12;
  
  // Calculate required corpus (present value of annuity)
  const realRate = (expectedReturnAfterRetirement - expectedInflation) / 100;
  let requiredRetirementCorpus: number;
  
  if (realRate <= 0) {
    requiredRetirementCorpus = annualExpense * yearsInRetirement;
  } else {
    requiredRetirementCorpus = (annualExpense / realRate) * (1 - Math.pow(1 + realRate, -yearsInRetirement));
  }
  
  // Calculate projected current savings at retirement
  const growthFactor = Math.pow(1 + expectedReturnBeforeRetirement / 100, yearsToRetirement);
  const currentProjectedCorpus = currentSavings * growthFactor;
  
  // Calculate shortfall
  const shortfall = Math.max(0, requiredRetirementCorpus - currentProjectedCorpus);
  const isOnTrack = shortfall === 0;
  
  // Calculate monthly savings required to meet shortfall
  let monthlySavingsRequired = 0;
  if (shortfall > 0) {
    const monthlyRate = expectedReturnBeforeRetirement / 12 / 100;
    const months = yearsToRetirement * 12;
    
    if (monthlyRate === 0) {
      monthlySavingsRequired = shortfall / months;
    } else {
      monthlySavingsRequired = shortfall / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    }
  }
  
  return {
    estimatedMonthlyRetirementExpense,
    requiredRetirementCorpus,
    currentProjectedCorpus,
    shortfall,
    isOnTrack,
    monthlySavingsRequired,
  };
}

/**
 * Calculate NPS (National Pension System) returns
 */
export function calculateNPS(input: {
  currentAge: number;
  retirementAge: number;
  monthlyContribution: number;
  expectedReturn: number;
  annuityPercentage: number;
  expectedAnnuityRate: number;
}): {
  totalContribution: number;
  estimatedCorpus: number;
  lumpSumWithdrawal: number;
  annuityCorpus: number;
  estimatedMonthlyPension: number;
  estimatedAnnualPension: number;
} {
  const {
    currentAge,
    retirementAge,
    monthlyContribution,
    expectedReturn,
    annuityPercentage,
    expectedAnnuityRate,
  } = input;
  
  const years = retirementAge - currentAge;
  
  if (years <= 0 || monthlyContribution <= 0) {
    return {
      totalContribution: 0,
      estimatedCorpus: 0,
      lumpSumWithdrawal: 0,
      annuityCorpus: 0,
      estimatedMonthlyPension: 0,
      estimatedAnnualPension: 0,
    };
  }
  
  // Calculate corpus using SIP formula
  const monthlyRate = expectedReturn / 12 / 100;
  const months = years * 12;
  const totalContribution = monthlyContribution * months;
  
  let estimatedCorpus: number;
  if (monthlyRate === 0) {
    estimatedCorpus = totalContribution;
  } else {
    estimatedCorpus = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  }
  
  // Calculate lump sum and annuity portions
  const annuityPortion = annuityPercentage / 100;
  const lumpSumWithdrawal = estimatedCorpus * (1 - annuityPortion);
  const annuityCorpus = estimatedCorpus * annuityPortion;
  
  // Calculate estimated pension
  const annuityRate = expectedAnnuityRate / 100;
  const estimatedAnnualPension = annuityCorpus * annuityRate;
  const estimatedMonthlyPension = estimatedAnnualPension / 12;
  
  return {
    totalContribution,
    estimatedCorpus,
    lumpSumWithdrawal,
    annuityCorpus,
    estimatedMonthlyPension,
    estimatedAnnualPension,
  };
}

/**
 * Calculate bond metrics
 */
export function calculateBond(input: {
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: 1 | 2 | 4;
}): {
  annualCoupon: number;
  currentYield: number;
  approximateYTM: number;
  premiumOrDiscount: number;
  isPremium: boolean;
} {
  const { faceValue, couponRate, marketPrice, yearsToMaturity, couponFrequency } = input;
  
  if (faceValue <= 0 || marketPrice <= 0 || yearsToMaturity <= 0) {
    return {
      annualCoupon: 0,
      currentYield: 0,
      approximateYTM: 0,
      premiumOrDiscount: 0,
      isPremium: false,
    };
  }
  
  const annualCoupon = faceValue * (couponRate / 100);
  const currentYield = (annualCoupon / marketPrice) * 100;
  const premiumOrDiscount = marketPrice - faceValue;
  const isPremium = marketPrice > faceValue;
  
  // Approximate YTM formula
  // YTM ≈ [C + (F - P) / n] / [(F + P) / 2]
  const C = annualCoupon;
  const F = faceValue;
  const P = marketPrice;
  const n = yearsToMaturity;
  
  const approximateYTM = ((C + (F - P) / n) / ((F + P) / 2)) * 100;
  
  return {
    annualCoupon,
    currentYield,
    approximateYTM,
    premiumOrDiscount,
    isPremium,
  };
}
