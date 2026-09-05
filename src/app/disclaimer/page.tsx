import type { Metadata } from "next";
import { ShieldCheck, AlertTriangle, Scale, BookOpen, Calculator, TrendingUp } from "lucide-react";
import { siteConfig } from "@/config/site";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Fistotex Disclaimer - Important legal disclaimers regarding financial calculators, news content, and educational information provided on this platform.",
  openGraph: {
    title: "Disclaimer | Fistotex",
    description: "Important legal disclaimers for Fistotex financial calculators and news content.",
    type: "website",
  },
};

const lastUpdated = new Date().toLocaleDateString("en-IN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const sections = [
  {
    id: "general",
    title: "General Disclaimer",
    icon: ShieldCheck,
    content: `
      <p>The information provided on <strong>${siteConfig.name}</strong> ("the Site") is for general educational and informational purposes only. It does not constitute professional financial advice, investment advice, tax advice, legal advice, or any other form of professional advice.</p>
      <p>All content on this Site - including but not limited to financial calculators, news articles, educational articles, tools, and resources - is provided "as is" without warranties of any kind, either express or implied.</p>
    `,
  },
  {
    id: "no-advice",
    title: "No Professional Financial Advice",
    icon: AlertTriangle,
    content: `
      <p><strong>${siteConfig.name} does not provide personalized financial advice.</strong> We are not a registered investment advisor, financial planner, tax consultant, or legal professional.</p>
      <ul>
        <li>The calculators and tools on this Site are designed to help you understand financial concepts and perform calculations based on standard formulas.</li>
        <li>The results are mathematical estimates based on the inputs you provide and the assumptions built into each calculator.</li>
        <li>These estimates should not be considered as recommendations to buy, sell, or hold any financial product.</li>
        <li>You should not make any financial decisions based solely on the information or calculations from this Site.</li>
      </ul>
      <p className="font-semibold">Always consult with a qualified financial advisor, certified financial planner (CFP), chartered accountant (CA), or tax professional before making any investment, insurance, tax, or financial planning decisions.</p>
    `,
  },
  {
    id: "calculators",
    title: "Calculator-Specific Disclaimers",
    icon: Calculator,
    content: `
      <h3>Accuracy of Calculations</h3>
      <p>While we strive to use accurate, standard financial formulas in our calculators:</p>
      <ul>
        <li>Formulas are based on standard mathematical models (compound interest, annuity, amortization, etc.)</li>
        <li>Results are estimates and may differ from actual financial institution calculations</li>
        <li>Banks, mutual funds, and financial institutions may use different compounding frequencies, day-count conventions, or fee structures</li>
        <li>Rounding differences can cause minor variations</li>
      </ul>

      <h3>Assumptions and Limitations</h3>
      <p>Each calculator operates under specific assumptions which are disclosed on the calculator page. Common assumptions include:</p>
      <ul>
        <li>Constant rate of return throughout the investment period</li>
        <li>Regular, consistent contributions (for SIP calculators)</li>
        <li>No fees, expense ratios, or transaction costs (unless explicitly included)</li>
        <li>No tax implications considered (unless explicitly included)</li>
        <li>No inflation adjustment (unless explicitly included)</li>
      </ul>

      <h3>Specific Calculator Notes</h3>
      <ul>
        <li><strong>SIP/Mutual Fund Calculators:</strong> Assume constant monthly returns. Actual mutual fund returns vary daily and are not guaranteed.</li>
        <li><strong>EMI/Loan Calculators:</strong> Assume fixed interest rate. Floating rate loans will have different EMIs over time.</li>
        <li><strong>PPF/NPS Calculators:</strong> Use current government-notified rates. Rates change quarterly (PPF) or are market-linked (NPS).</li>
        <li><strong>FD/RD Calculators:</strong> Assume interest rates remain constant. Bank rates may change.</li>
        <li><strong>Retirement Calculators:</strong> Highly sensitive to assumptions. Small changes in return rate or inflation significantly impact results.</li>
        <li><strong>CAGR/XIRR Calculators:</strong> Mathematical calculations only. Past performance ≠ future results.</li>
      </ul>
    `,
  },
  {
    id: "news",
    title: "News Content Disclaimer",
    icon: BookOpen,
    content: `
      <p>The financial news displayed on this Site is aggregated from third-party sources including <strong>Mint</strong>, <strong>Moneycontrol</strong>, and <strong>Economic Times</strong>.</p>
      <ul>
        <li>We do not create, edit, or verify the accuracy of news content.</li>
        <li>All news articles link to the original publisher's website.</li>
        <li>Opinions expressed in news articles are those of the original authors/publishers, not ${siteConfig.name}.</li>
        <li>We are not responsible for any errors, omissions, or inaccuracies in third-party news content.</li>
        <li>News is provided for informational purposes only and should not be considered investment advice.</li>
      </ul>
    `,
  },
  {
    id: "market-risk",
    title: "Market Risk Warning",
    icon: TrendingUp,
    content: `
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" /> <strong>Mutual Fund Investments Are Subject to Market Risks</strong>
        </h3>
        <p className="text-amber-700">Read all scheme-related documents carefully before investing.</p>
      </div>

      <ul>
        <li><strong>Equity investments:</strong> Principal is at risk. Value can go down as well as up.</li>
        <li><strong>Debt investments:</strong> Subject to interest rate risk, credit risk, and liquidity risk.</li>
        <li><strong>Past performance:</strong> Is not indicative of future results.</li>
        <li><strong>No guaranteed returns:</strong> Except for specific government-backed schemes with explicit guarantees.</li>
      </ul>
    `,
  },
  {
    id: "tax",
    title: "Tax Disclaimer",
    icon: Scale,
    content: `
      <p>Tax laws in India are complex and subject to frequent changes. The information on this Site regarding taxation:</p>
      <ul>
        <li>Is based on current tax laws as of the publication date</li>
        <li>May not reflect recent amendments, budget announcements, or notifications</li>
        <li>Does not consider your specific tax situation, residential status, or deductions</li>
        <li>Should not be relied upon for tax filing or planning</li>
      </ul>
      <p className="font-semibold">Consult a qualified chartered accountant (CA) or tax advisor for personalized tax advice.</p>
    `,
  },
  {
    id: "regulatory",
    title: "Regulatory Disclaimer",
    icon: Scale,
    content: `
      <p>${siteConfig.name} is not registered with or regulated by:</p>
      <ul>
        <li>Securities and Exchange Board of India (SEBI)</li>
        <li>Reserve Bank of India (RBI)</li>
        <li>Insurance Regulatory and Development Authority of India (IRDAI)</li>
        <li>Pension Fund Regulatory and Development Authority (PFRDA)</li>
      </ul>
      <p>We do not sell financial products, manage portfolios, or provide investment advisory services requiring registration.</p>
    `,
  },
  {
    id: "external-links",
    title: "External Links",
    icon: BookOpen,
    content: `
      <p>The Site contains links to third-party websites for your convenience. These include:</p>
      <ul>
        <li>News source websites (Mint, Moneycontrol, Economic Times)</li>
        <li>Financial institution websites (banks, AMCs, insurance companies)</li>
        <li>Government portals (Income Tax, EPFO, NSDL, etc.)</li>
      </ul>
      <p>We do not control, endorse, or take responsibility for the content, accuracy, privacy policies, or practices of any third-party websites.</p>
    `,
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    icon: ShieldCheck,
    content: `
      <p>To the maximum extent permitted by law:</p>
      <ul>
        <li>${siteConfig.name} and its owners, employees, and contributors shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Site.</li>
        <li>This includes damages for loss of profits, data, goodwill, or other intangible losses.</li>
        <li>Our total liability shall not exceed the amount you paid to use the Site (which is zero).</li>
      </ul>
    `,
  },
  {
    id: "indemnification",
    title: "Indemnification",
    icon: Scale,
    content: `
      <p>You agree to indemnify and hold harmless ${siteConfig.name}, its owners, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
      <ul>
        <li>Your use of the Site</li>
        <li>Your violation of these terms</li>
        <li>Your reliance on any information from the Site</li>
        <li>Any financial decisions you make based on Site content</li>
      </ul>
    `,
  },
  {
    id: "governing-law",
    title: "Governing Law",
    icon: Scale,
    content: `
      <p>This Disclaimer shall be governed by and construed in accordance with the laws of India. Any disputes arising from or related to this Disclaimer or the Site shall be subject to the exclusive jurisdiction of the courts in India.</p>
    `,
  },
  {
    id: "changes",
    title: "Changes to This Disclaimer",
    icon: BookOpen,
    content: `
      <p>We may update this Disclaimer from time to time. The "Last Updated" date at the top of this page will reflect the most recent changes. Your continued use of the Site constitutes acceptance of the updated Disclaimer.</p>
    `,
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: ShieldCheck,
    content: `
      <p>If you have questions about this Disclaimer, please contact us:</p>
      <ul>
        <li>Email: <a href="mailto:${siteConfig.contactEmail}" className="underline">${siteConfig.contactEmail}</a></li>
        <li>Website: <a href="${siteConfig.url}/contact" className="underline">${siteConfig.url}/contact</a></li>
      </ul>
    `,
  },
];

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData type="WebPage" data={{ title: "Disclaimer", description: "Fistotex Disclaimer - Important legal disclaimers regarding financial calculators, news content, and educational information." }} />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">
              Disclaimer
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
            <p className="text-red-600 font-medium mt-2">
              <strong>Please read this carefully before using our calculators or relying on any information from this Site.</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="mb-12 pb-8 border-b last:border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/5 text-primary">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">{section.title}</h2>
                  </div>
                  <div className="ml-10 space-y-4 text-muted-foreground leading-relaxed">
                    {section.content.split('\n\n').map((paragraph, i) => (
                      <div key={i} dangerouslySetInnerHTML={{ __html: paragraph.trim() }} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Key Takeaways Box */}
            <div className="mt-12 p-6 rounded-xl bg-red-50 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Key Takeaways
              </h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>✗ This Site does <strong>not</strong> provide financial advice</li>
                <li>✗ Calculator results are <strong>estimates only</strong> - not guaranteed</li>
                <li>✗ News content is from <strong>third-party sources</strong> - we don't verify accuracy</li>
                <li>✗ Mutual fund investments carry <strong>market risk</strong> - read scheme documents</li>
                <li>✗ Tax information may be <strong>outdated</strong> - consult a CA</li>
                <li>✗ We are <strong>not SEBI/RBI/IRDAI registered</strong></li>
                <li>✓ Use our tools for <strong>education and planning</strong> - then consult a professional</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}