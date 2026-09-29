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

/* ────────────────────────────────────────────────────────────────
   Search copy for the six category pages (/calculators/category/<id>).

   These pages target the mid-funnel plural queries — "investment
   calculators", "loan calculators" — that no single calculator page can rank
   for. Each one carries real explanatory copy rather than a bare grid of
   cards, because a category page with nothing but links is exactly the thin
   content Google and AdSense discount.
   ──────────────────────────────────────────────────────────────── */

export interface CategorySeo {
  title: string;
  /**
   * The adjectival form used in headings and prose. Separate from the category
   * `name`, which is the plural noun used for nav labels ("Investments"):
   * "Investments calculators" is wrong, "Investment calculators" is not.
   */
  heading: string;
  description: string;
  intro: string[];
  /** Which calculator to reach for first, and why. */
  guidance: string;
}

export const categorySeo: Record<string, CategorySeo> = {
  investment: {
    heading: "Investment",
    title: "Investment Calculators: SIP, Lumpsum, CAGR & XIRR",
    description:
      "Free investment calculators for India. Project SIP and lumpsum growth, compare mutual fund approaches, and measure returns with CAGR and XIRR.",
    intro: [
      "Investment calculators answer two different questions, and it helps to know which one you are asking. Forward-looking tools — SIP, lumpsum and mutual fund — project what an assumed rate of return could turn your money into. Backward-looking tools — CAGR and XIRR — measure the return you have already earned.",
      "Every projection here is an assumption, not a forecast. A 12% figure is a common planning convention for Indian equity, not a promise, so test a lower rate as well and see how much of your goal survives it.",
    ],
    guidance:
      "Investing a fixed amount every month? Start with the SIP calculator. Investing a bonus or maturity amount in one go? Use lumpsum. Checking how an existing portfolio has actually performed? XIRR, because it accounts for when each instalment went in.",
  },
  loans: {
    heading: "Loan",
    title: "Loan Calculators: Home, Car & Personal Loan EMI",
    description:
      "Free loan calculators for India. Work out EMI, total interest and the full repayment cost for home, car, personal and education loans.",
    intro: [
      "A loan calculator turns the three numbers a lender quotes you — amount, rate and tenure — into the two that actually matter: what you pay each month, and what the loan costs you in total.",
      "The second number is the one borrowers underestimate. On a long home loan, total interest can approach or exceed the principal, and the tenure moves it far more than a small difference in rate does.",
    ],
    guidance:
      "Before you sign anything, run the same loan at two or three tenures. A shorter tenure raises the EMI but can cut total interest substantially — that comparison is the single most useful thing these calculators do.",
  },
  savings: {
    heading: "Savings",
    title: "Savings Calculators: FD, RD and PPF Returns",
    description:
      "Free FD, RD and PPF calculators for India. See maturity value, total interest and how compounding frequency changes what you actually receive.",
    intro: [
      "Savings calculators cover the instruments where the rate is fixed and known in advance: fixed deposits, recurring deposits and the Public Provident Fund. There is no market assumption to make, so these results are far more certain than any investment projection.",
      "What varies is compounding. Two deposits at the same advertised rate can mature at different amounts depending on whether interest compounds quarterly, half-yearly or annually, which is why each calculator states its assumption.",
    ],
    guidance:
      "Use FD for a single deposit, RD when you are setting aside a fixed amount monthly, and PPF when the 15-year lock-in and its tax treatment suit the goal. Note that FD and RD interest is taxable as income; PPF is not.",
  },
  retirement: {
    heading: "Retirement",
    title: "Retirement Calculators: Corpus and NPS Planning",
    description:
      "Free retirement calculators for India. Work out the corpus you need, what monthly saving gets you there, and how NPS annuity rules affect your payout.",
    intro: [
      "Retirement planning runs backwards from the rest of finance: you start with the income you want in retirement, adjust it for the decades of inflation between now and then, and only then work out what you need to set aside.",
      "Inflation is what makes this counterintuitive. An expense of ₹50,000 a month today is a much larger number thirty years out, so a corpus that looks generous in today's rupees often is not.",
    ],
    guidance:
      "Start with the retirement calculator to size the corpus, then use NPS if that is part of your plan — its rules require a portion of the maturity amount to buy an annuity, which changes how much is actually available as a lump sum.",
  },
  "fixed-income": {
    heading: "Fixed income",
    title: "Fixed Income Calculators: Bond Price and Yield",
    description:
      "Free bond calculator for India. Work out a bond's price, yield and interest income, and see how changing rates move its value.",
    intro: [
      "Fixed-income calculators deal with instruments that pay a set coupon on a set schedule. The coupon is fixed; the price is not, and that is the part most people find surprising.",
      "Bond prices move inversely to interest rates. When prevailing rates rise, an existing bond paying a lower coupon becomes less attractive and its market price falls — which matters if you may sell before maturity rather than hold to the end.",
    ],
    guidance:
      "Holding to maturity? The coupon and face value are what you receive, and price movement in between is noise. Might sell early? Then yield and price sensitivity are the numbers to watch.",
  },
  planning: {
    heading: "Financial planning",
    title: "Financial Planning Calculators: Inflation & Purchasing Power",
    description:
      "Free planning calculators for India. See what inflation does to the value of money over time and what a future cost means in today's rupees.",
    intro: [
      "Planning calculators handle the arithmetic that sits underneath every other financial decision: what a sum of money will actually be worth by the time you need it.",
      "This is the correction most plans are missing. A goal priced at today's cost — a car, a wedding, a year of college — will cost materially more by the time you reach it, and planning against the current figure quietly underfunds the goal.",
    ],
    guidance:
      "Run any goal more than a few years away through the inflation calculator first, then take that adjusted figure into the SIP or lumpsum calculator. Planning against today's price is the most common way a savings target ends up short.",
  },
};
