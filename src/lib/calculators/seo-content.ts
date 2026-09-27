/* ────────────────────────────────────────────────────────────────
   Search copy for each calculator page: the <title>, meta description,
   an explainer that answers "what is it / when to use it", and extra FAQs.

   Kept apart from registry.ts so the maths and the marketing copy can be
   edited independently. Titles stay under ~50 characters because the layout
   appends " | Fistotex".
   ──────────────────────────────────────────────────────────────── */

export interface CalculatorSeo {
  title: string;
  description: string;
  /** Plain-language explainer shown above the method section */
  intro: string[];
  faqs: Array<{ q: string; a: string }>;
}

export const calculatorSeo: Record<string, CalculatorSeo> = {
  sip: {
    title: "SIP Calculator: Mutual Fund SIP Return Calculator",
    description:
      "Free SIP calculator for India. See how much your monthly mutual fund SIP could grow to, with total invested, estimated returns and a year-by-year chart.",
    intro: [
      "A SIP (Systematic Investment Plan) calculator estimates the future value of investing a fixed amount in a mutual fund every month. Enter your monthly amount, an expected annual return and how many years you plan to invest.",
      "Use it to set a realistic monthly target for a goal such as a house down payment, a child's education or retirement, and to see how much of the final value comes from compounding rather than your own contributions.",
    ],
    faqs: [
      { q: "What return should I assume for an equity SIP?", a: "There is no fixed answer. Diversified Indian equity funds have delivered widely different returns across periods. Many planners use a conservative 10–12% for long horizons and test lower rates to see the downside." },
      { q: "Can I start a SIP with ₹500?", a: "Yes. Most mutual fund schemes accept SIPs from ₹500 a month, and some from ₹100. The calculator's minimum is ₹500." },
    ],
  },
  lumpsum: {
    title: "Lumpsum Calculator: One-Time Investment Returns",
    description:
      "Calculate the future value of a one-time lumpsum investment in mutual funds or any asset. Free lumpsum calculator for India with compounding chart and formula.",
    intro: [
      "A lumpsum calculator projects how a single, one-time investment grows at a constant annual rate of return. It is useful when you invest a bonus, an inheritance or the proceeds of a matured deposit all at once.",
      "Compare the result with the SIP calculator to decide whether to invest the amount immediately or stagger it over several months.",
    ],
    faqs: [
      { q: "How is lumpsum return calculated?", a: "Future value = P × (1 + r)ⁿ, where P is the amount invested, r is the annual return and n is the number of years." },
      { q: "Is lumpsum better than SIP?", a: "Neither is always better. A lumpsum has more time in the market, while a SIP reduces the risk of investing everything just before a fall. Your cash flow and risk tolerance matter more than the formula." },
    ],
  },
  "mutual-fund": {
    title: "Mutual Fund Calculator: SIP vs Lumpsum Returns",
    description:
      "Compare mutual fund returns for SIP and lumpsum investing side by side. Free mutual fund return calculator for India with maturity value and gains.",
    intro: [
      "This mutual fund calculator lets you switch between monthly SIP and one-time lumpsum investing to compare what the same fund return could produce under each approach.",
      "Enter the return you expect after the fund's expense ratio. A direct plan with a lower expense ratio leaves more of the fund's gross return in your pocket.",
    ],
    faqs: [
      { q: "Are mutual fund returns taxed?", a: "Yes. Equity and debt funds are taxed differently and the rates depend on how long you hold the units. The figures here are pre-tax." },
      { q: "Direct or regular plan?", a: "Direct plans have no distributor commission, so their expense ratio is lower. Over long periods the difference compounds into a noticeably larger corpus." },
    ],
  },
  cagr: {
    title: "CAGR Calculator: Compound Annual Growth Rate",
    description:
      "Calculate CAGR (compound annual growth rate) from a starting value, ending value and number of years. Free CAGR calculator with formula and examples.",
    intro: [
      "CAGR is the constant yearly growth rate that would take an investment from its starting value to its ending value over a given number of years. It smooths out the ups and downs to give one comparable number.",
      "Use CAGR to compare a stock, fund, property or business metric such as revenue across different time periods on equal terms.",
    ],
    faqs: [
      { q: "What is the CAGR formula?", a: "CAGR = (Ending value ÷ Beginning value)^(1 ÷ years) − 1." },
      { q: "What is a good CAGR?", a: "It depends on the asset and risk. Compare an investment's CAGR with inflation and with a relevant benchmark such as the Nifty 50 over the same years." },
    ],
  },
  xirr: {
    title: "XIRR Calculator for SIP: Annualised SIP Return",
    description:
      "Find the XIRR of your SIP from the monthly amount, duration and current value. Free XIRR calculator for mutual fund SIPs in India, with the method explained.",
    intro: [
      "XIRR (extended internal rate of return) is the annualised return on investments made at different times. Mutual fund statements report SIP performance as XIRR because each instalment is invested for a different length of time.",
      "Enter your monthly SIP, how long you have been investing and the portfolio's current value to see the return you have actually earned.",
    ],
    faqs: [
      { q: "Is XIRR the same as absolute return?", a: "No. Absolute return is total gain divided by total invested and ignores time. XIRR converts it into a yearly rate that accounts for when each rupee went in." },
      { q: "What is a good SIP XIRR?", a: "Compare it with the XIRR of a benchmark index fund over the same dates. A fund that consistently trails its benchmark may not justify its costs." },
    ],
  },
  emi: {
    title: "EMI Calculator: Home, Car & Personal Loan EMI",
    description:
      "Calculate your loan EMI, total interest and total payment for home, car or personal loans. Free EMI calculator for India with an amortisation chart.",
    intro: [
      "An EMI calculator works out the fixed monthly instalment needed to repay a loan over its tenure, along with the total interest you will pay. It works for home loans, car loans, personal loans and education loans.",
      "Try different tenures and rates before you apply: a shorter tenure raises the EMI but can cut total interest by lakhs on a home loan.",
    ],
    faqs: [
      { q: "What is a safe EMI to income ratio?", a: "Many lenders cap total EMIs at roughly 40–50% of net monthly income. Staying well below that leaves room for savings and emergencies." },
      { q: "Does the EMI change with a floating rate?", a: "When a floating rate changes, lenders usually adjust the tenure first and the EMI only if needed. Re-run the calculator with the new rate to see the effect." },
    ],
  },
  loan: {
    title: "Loan Eligibility Calculator: How Much Can I Borrow",
    description:
      "Find out how much loan you can get for an EMI you can afford. Free loan eligibility calculator for home and personal loans in India, based on rate and tenure.",
    intro: [
      "A loan eligibility calculator works backwards from the EMI you are comfortable paying to the maximum loan amount that EMI can repay at a given interest rate and tenure.",
      "Start from your budget rather than the lender's limit. Borrowing only what a comfortable EMI supports keeps the loan manageable if rates rise or income dips.",
    ],
    faqs: [
      { q: "How do banks decide home loan eligibility?", a: "Mainly on net monthly income, existing EMIs (the FOIR ratio), age, credit score, employment stability and the property's value, which caps the loan-to-value ratio." },
      { q: "How can I increase my loan eligibility?", a: "Clearing existing loans, adding a co-applicant with income, choosing a longer tenure and keeping a strong credit score all raise the amount you can borrow." },
    ],
  },
  fd: {
    title: "FD Calculator: Fixed Deposit Maturity & Interest",
    description:
      "Calculate fixed deposit maturity amount and interest earned with monthly, quarterly, half-yearly or yearly compounding. Free FD calculator for Indian banks.",
    intro: [
      "An FD calculator shows what a bank or post office fixed deposit will be worth at maturity and how much interest it earns, based on the amount, interest rate, tenure and compounding frequency.",
      "Most Indian banks compound FD interest quarterly. Use the calculator to compare offers from different banks or to decide between a cumulative FD and one that pays interest out.",
    ],
    faqs: [
      { q: "Is TDS deducted on FD interest?", a: "Yes. Banks deduct TDS when your annual FD interest crosses the threshold set by the Income Tax Act. You can submit Form 15G or 15H if you are eligible to avoid it." },
      { q: "Can I break an FD early?", a: "Usually yes, but banks charge a penalty, often 0.5–1% off the applicable rate. Tax-saving FDs have a 5-year lock-in and cannot be broken early." },
    ],
  },
  rd: {
    title: "RD Calculator: Recurring Deposit Maturity Value",
    description:
      "Calculate recurring deposit maturity value and interest for bank or post office RDs. Free RD calculator for India with quarterly compounding and formula.",
    intro: [
      "An RD calculator estimates the maturity value of a recurring deposit, where you deposit a fixed amount every month at a fixed interest rate for a set tenure.",
      "RDs suit short-term goals with a fixed date, such as a vacation or an insurance premium, where you want guaranteed savings rather than market-linked returns.",
    ],
    faqs: [
      { q: "How is RD interest compounded?", a: "Most Indian banks and the post office compound RD interest quarterly, so each monthly deposit earns interest for the number of quarters it stays invested." },
      { q: "What happens if I miss an RD instalment?", a: "Banks usually charge a small penalty for a missed instalment, and several missed payments can lead to premature closure." },
    ],
  },
  ppf: {
    title: "PPF Calculator: Public Provident Fund Maturity",
    description:
      "Calculate your PPF maturity amount and interest over 15 years or with extensions. Free PPF calculator for India using the current government-notified rate.",
    intro: [
      "A PPF calculator projects the maturity value of your Public Provident Fund account from your yearly deposit, the interest rate and the number of years. PPF interest is compounded annually.",
      "PPF is backed by the Government of India and its interest and maturity amount are tax-free, which makes it a popular debt option for long-term goals.",
    ],
    faqs: [
      { q: "When should I deposit in PPF to earn the most interest?", a: "Interest is calculated on the lowest balance between the 5th and the last day of each month, so depositing before the 5th of April earns interest for the whole year." },
      { q: "Can I extend PPF after 15 years?", a: "Yes. You can extend the account in blocks of 5 years, with or without fresh contributions." },
    ],
  },
  nps: {
    title: "NPS Calculator: Pension & Retirement Corpus",
    description:
      "Estimate your National Pension System (NPS) corpus, lump sum and monthly pension at retirement. Free NPS calculator for India with annuity assumptions.",
    intro: [
      "An NPS calculator estimates the corpus your National Pension System account could build by retirement, and splits it into the lump sum you can withdraw and the part used to buy an annuity for a monthly pension.",
      "Adjust the expected return to match your asset mix. A higher equity allocation has higher expected returns and more volatility.",
    ],
    faqs: [
      { q: "What return does NPS give?", a: "It depends on the mix of equity, corporate bonds and government securities you choose and on market performance. Past returns of NPS schemes are published by PFRDA." },
      { q: "Can I withdraw NPS before 60?", a: "Partial withdrawals are allowed for specific purposes after a minimum period, and premature exit is subject to stricter annuity rules. Check current PFRDA rules before planning an early exit." },
    ],
  },
  retirement: {
    title: "Retirement Calculator: Corpus & Monthly Savings",
    description:
      "Find out how much you need to retire in India and how much to save each month. Free retirement planning calculator that accounts for inflation and returns.",
    intro: [
      "A retirement calculator estimates the corpus you will need to cover your expenses after you stop working, adjusted for inflation, and the monthly saving needed to build it by your retirement age.",
      "Small changes have large effects over decades. Try retiring a few years later, saving a little more, or assuming a lower return to see how robust your plan is.",
    ],
    faqs: [
      { q: "How much money do I need to retire in India?", a: "A common starting point is 25–30 times your expected annual expenses at retirement, measured in future rupees after inflation. Your own figure depends on lifestyle, health costs and other income." },
      { q: "What is the 4% rule?", a: "It suggests withdrawing about 4% of your corpus in the first year and adjusting for inflation afterwards. With higher Indian inflation, many planners use a more conservative 3–3.5%." },
    ],
  },
  bond: {
    title: "Bond Yield Calculator: Current Yield & YTM",
    description:
      "Calculate a bond's current yield and approximate yield to maturity (YTM) from face value, coupon rate and market price. Free bond calculator for India.",
    intro: [
      "A bond calculator shows the return a bond offers at its current market price. Current yield is the annual coupon divided by price; yield to maturity also counts the gain or loss as the price moves to face value at maturity.",
      "Use it to compare government securities, corporate bonds and tax-free bonds on a like-for-like basis before buying on an exchange or bond platform.",
    ],
    faqs: [
      { q: "What is the difference between coupon rate and yield?", a: "The coupon rate is fixed on the bond's face value. Yield depends on the price you pay, so buying below face value gives a yield above the coupon rate." },
      { q: "Is bond interest taxable in India?", a: "Coupon income is usually taxed at your slab rate. Some tax-free bonds issued by public sector companies are exempt." },
    ],
  },
  inflation: {
    title: "Inflation Calculator India: Future Value of Money",
    description:
      "See what today's rupees will be worth in future, or what future costs will be, at a given inflation rate. Free inflation calculator for India with chart.",
    intro: [
      "An inflation calculator shows how rising prices erode the purchasing power of money. It tells you what a cost today will be in the future, such as school fees or monthly expenses, at an assumed inflation rate.",
      "Use the result to set goals in future rupees, and make sure your investments are expected to earn more than inflation after tax.",
    ],
    faqs: [
      { q: "What is the current inflation rate in India?", a: "India's CPI inflation is published monthly by the Ministry of Statistics (MoSPI), and the RBI targets 4% within a 2–6% band. Use a long-term average rather than a single month's figure for planning." },
      { q: "How does inflation affect my savings?", a: "If your savings earn less than inflation after tax, their real value falls every year even though the balance grows." },
    ],
  },
};
