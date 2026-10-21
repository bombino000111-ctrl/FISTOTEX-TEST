import type { CompanyResult } from "@/types/earnings";

/** Displayed with the figures; update together with the data. */
export const EARNINGS_AS_OF = "Oct 21, 2026";

const INVESTMENT_GAINS =
  "Profit is inflated by non-operating gains on investments, so profit growth overstates the operating business.";

/**
 * Latest reported quarter for 10 Indian and 10 US large caps, researched
 * Oct 21, 2026 by the Market Research Specialist. India figures are
 * consolidated ₹ crore; US figures are US$ billion. Percentages are kept
 * exactly as reported.
 */
export const companyResults: CompanyResult[] = [
  // India
  {
    id: "tcs", name: "TCS", market: "IN", quarter: "Q2 FY27", revenueLabel: "Revenue",
    revenue: 73188, netProfit: 13934, eps: 38.37,
    revenueYoY: 11.2, profitYoY: 14.9, revenueQoQ: 1.3, profitQoQ: 3.8,
    source: "Business Today",
    sourceUrl: "https://www.businesstoday.in/markets/stocks/story/tcs-q2-fy27-results-net-profit-rises-15-to-rs-13934-crore-declares-rs-12-dividend-560435-2026-10-08",
    next: { kind: "reported" },
  },
  {
    id: "hdfc-bank", name: "HDFC Bank", market: "IN", quarter: "Q2 FY27", revenueLabel: "NII",
    revenue: 34620, netProfit: 19510, eps: 13.43,
    revenueYoY: 9.7, profitYoY: 4.7, revenueQoQ: 3.3, profitQoQ: 2.4,
    source: "GoodReturns",
    sourceUrl: "https://www.goodreturns.in/news/hdfc-bank-q2-results-good-or-bad-largest-indian-bank-earns-rs-19-510-crore-profit-nii-up-10-yoy-1542241.html",
    next: { kind: "reported" },
  },
  {
    id: "icici-bank", name: "ICICI Bank", market: "IN", quarter: "Q2 FY27", revenueLabel: "Total income",
    revenue: 57157, netProfit: 14843, eps: 22.76,
    revenueYoY: 15.9, profitYoY: 20.1, revenueQoQ: 5.4, profitQoQ: 0.3,
    source: "PSU Connect",
    sourceUrl: "https://www.psuconnect.in/financial/icici-bank-q2-results-2026-net-profit-rises-20-to-14843-cr",
    next: { kind: "reported" },
  },
  {
    id: "infosys", name: "Infosys", market: "IN", quarter: "Q1 FY27", revenueLabel: "Revenue",
    revenue: 48211, netProfit: 7769, eps: 19.19,
    revenueYoY: 14.0, profitYoY: 12.3, revenueQoQ: 3.9, profitQoQ: -8.6,
    source: "IIFL",
    sourceUrl: "https://www.indiainfoline.com/news/earnings/infosys-q1-results-fy2027-revenue-rises-14-yoy-to-48211-crore-pat-grows-12-ai-business-contributes-8-2",
    next: { kind: "date", date: "2026-10-23" },
  },
  {
    id: "reliance", name: "Reliance Industries", market: "IN", quarter: "Q1 FY27", revenueLabel: "Revenue",
    revenue: 311850, netProfit: 23001, eps: 15.48,
    revenueYoY: 25.4, profitYoY: -25.0, revenueQoQ: -4.1, profitQoQ: 11.6,
    source: "Free Press Journal",
    sourceUrl: "https://www.freepressjournal.in/amp/business/reliance-industries-q1-fy27-profit-declines-to-23001-crore-revenue-rises-to-312-lakh-crore",
    next: { kind: "tba" },
  },
  {
    id: "bharti-airtel", name: "Bharti Airtel", market: "IN", quarter: "Q1 FY27", revenueLabel: "Revenue",
    revenue: 58539, netProfit: 8167, eps: 13.38,
    revenueYoY: 18.4, profitYoY: 37.3, revenueQoQ: 5.7, profitQoQ: 11.5,
    source: "Kotak Neo",
    sourceUrl: "https://www.kotakneo.com/news/stocks/bharti-airtel-q1-2026-27-results-net-profit-jumps-37-to-rs-8167-crore-revenue-up-18-3/",
    next: { kind: "date", date: "2026-11-05", estimated: true },
  },
  {
    id: "itc", name: "ITC", market: "IN", quarter: "Q1 FY27", revenueLabel: "Revenue",
    revenue: 29410, netProfit: 4509, eps: 3.51,
    revenueYoY: 27.8, profitYoY: -15.6, revenueQoQ: 23.5, profitQoQ: -17.6,
    source: "Free Press Journal",
    sourceUrl: "https://www.freepressjournal.in/business/itc-ltds-q1-fy27-consolidated-net-profit-declines-1561-to-450879-crore",
    next: { kind: "date", date: "2026-11-14", estimated: true },
  },
  {
    id: "larsen-toubro", name: "Larsen & Toubro", market: "IN", quarter: "Q1 FY27", revenueLabel: "Revenue",
    revenue: 67942, netProfit: 4123, eps: 29.97,
    revenueYoY: 6.7, profitYoY: 14.0, revenueQoQ: -17.9, profitQoQ: -22.6,
    source: "Sahi",
    sourceUrl: "https://www.sahi.com/blogs/lt-q1-fy27-results",
    next: { kind: "date", date: "2026-10-27" },
  },
  {
    id: "sbi", name: "State Bank of India", market: "IN", quarter: "Q1 FY27", revenueLabel: "Total income",
    revenue: 143819, netProfit: 21121, eps: 22.88,
    revenueYoY: 6.3, profitYoY: 10.2, revenueQoQ: 2.4, profitQoQ: 7.3,
    source: "DSIJ",
    sourceUrl: "https://insights.dsij.in/dsijarticledetail/sbi-q1fy27-results-shares-gain-over-2-as-profit-climbs-to-rs-21121-crore-58878",
    next: { kind: "approx", label: "Early Nov" },
  },
  {
    id: "hul", name: "Hindustan Unilever", market: "IN", quarter: "Q1 FY27", revenueLabel: "Revenue",
    revenue: 17184, netProfit: 2680, eps: 11.38,
    revenueYoY: 10, profitYoY: -2, revenueQoQ: 6.0, profitQoQ: -10.4,
    source: "Free Press Journal",
    sourceUrl: "https://www.freepressjournal.in/business/hul-q1-fy27-consolidated-net-profit-dips-2-to-2680-crore",
    next: { kind: "date", date: "2026-10-28" },
  },

  // United States
  {
    id: "apple", name: "Apple", market: "US", quarter: "Q3 FY26", revenueLabel: "Revenue",
    revenue: 109.4, netProfit: 29.8, eps: 2.02,
    revenueYoY: 16.4, profitYoY: 27.4, revenueQoQ: -1.6, profitQoQ: 0.7,
    source: "9to5Mac",
    sourceUrl: "https://9to5mac.com/2026/07/30/apple-reports-q3-2026-earnings-109-4-billion-in-revenue-up-16/",
    next: { kind: "date", date: "2026-11-02" },
  },
  {
    id: "microsoft", name: "Microsoft", market: "US", quarter: "Q4 FY26", revenueLabel: "Revenue",
    revenue: 90.0, netProfit: 35.8, eps: 4.81,
    revenueYoY: 17.8, profitYoY: 31.6, revenueQoQ: 8.6, profitQoQ: 12.6,
    source: "Microsoft Investor Relations",
    sourceUrl: "https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast",
    next: { kind: "date", date: "2026-10-28" },
  },
  {
    id: "nvidia", name: "Nvidia", market: "US", quarter: "Q2 FY27", revenueLabel: "Revenue",
    revenue: 96.2, netProfit: 59.7, eps: 2.46,
    revenueYoY: 106.0, profitYoY: 126.1, revenueQoQ: 17.9, profitQoQ: 2.4,
    source: "Nvidia Investor Relations",
    sourceUrl: "https://investor.nvidia.com/financial-info/quarterly-results/",
    next: { kind: "approx", label: "Late Nov" },
  },
  {
    id: "amazon", name: "Amazon", market: "US", quarter: "Q2 2026", revenueLabel: "Revenue",
    revenue: 200.6, netProfit: 62.6, eps: 5.75,
    revenueYoY: 19.6, profitYoY: 244, revenueQoQ: 10.5, profitQoQ: 107,
    profitNote: INVESTMENT_GAINS,
    source: "Seeking Alpha",
    sourceUrl: "https://seekingalpha.com/pr/20493420",
    next: { kind: "date", date: "2026-10-29", estimated: true },
  },
  {
    id: "alphabet", name: "Alphabet", market: "US", quarter: "Q2 2026", revenueLabel: "Revenue",
    revenue: 119.8, netProfit: 112.1, eps: 9.11,
    revenueYoY: 24.3, profitYoY: 298, revenueQoQ: 9.0, profitQoQ: 79,
    profitNote: INVESTMENT_GAINS,
    source: "SEC filing (8-K)",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0001652044/000165204426000066/googexhibit991q22026.htm",
    next: { kind: "date", date: "2026-10-28" },
  },
  {
    id: "meta", name: "Meta", market: "US", quarter: "Q2 2026", revenueLabel: "Revenue",
    revenue: 60.8, netProfit: 15.85, eps: 6.18,
    revenueYoY: 28.0, profitYoY: -13.6, revenueQoQ: 8.0, profitQoQ: -40.8,
    source: "SEC filing (8-K)",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0001326801/000162828026050596/meta-06302026xexhibit991.htm",
    next: { kind: "date", date: "2026-10-21" },
  },
  {
    id: "tesla", name: "Tesla", market: "US", quarter: "Q2 2026", revenueLabel: "Revenue",
    revenue: 28.24, netProfit: 1.11, eps: 0.32,
    revenueYoY: 25.5, profitYoY: -5.1, revenueQoQ: 26.1, profitQoQ: -23.4,
    source: "Drive Tesla Canada",
    sourceUrl: "https://driveteslacanada.ca/news/tesla-q2-2026-earnings-results-beat-revenue-miss-eps/",
    next: { kind: "date", date: "2026-10-28" },
  },
  {
    id: "jpmorgan", name: "JPMorgan Chase", market: "US", quarter: "Q3 2026", revenueLabel: "Revenue",
    revenue: 50.2, netProfit: 15.3, eps: 5.57,
    revenueYoY: 6.6, profitYoY: 6.3, revenueQoQ: -12.4, profitQoQ: -27.8,
    source: "SEC filing",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0000019617/000162828026054343/jpm-20260630.htm",
    next: { kind: "reported" },
  },
  {
    id: "visa", name: "Visa", market: "US", quarter: "Q3 FY26", revenueLabel: "Revenue",
    revenue: 11.6, netProfit: 5.6, eps: 2.97,
    revenueYoY: 13.7, profitYoY: 5.7, revenueQoQ: 3.6, profitQoQ: -6.7,
    source: "SEC filing (8-K)",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0001403161/000140316126000103/q32026earningsrelease.htm",
    next: { kind: "date", date: "2026-10-27" },
  },
  {
    id: "exxon-mobil", name: "Exxon Mobil", market: "US", quarter: "Q2 2026", revenueLabel: "Revenue",
    revenue: 116.02, netProfit: 14.5, eps: 3.48,
    revenueYoY: 45.9, profitYoY: 104.2, revenueQoQ: 36.3, profitQoQ: 246.9,
    source: "SEC filing (8-K)",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0002115436/000211543626000006/livef8k2q26991.htm",
    next: { kind: "date", date: "2026-10-30" },
  },
];
