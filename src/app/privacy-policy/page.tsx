import type { Metadata } from "next";
import { ShieldCheck, Eye, Database, Lock, Mail, Truck, Globe, UserCheck, Calendar } from "lucide-react";
import { siteConfig } from "@/config/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { PageHeader } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Fistotex Privacy Policy - How we collect, use, and protect your personal information when you use our financial calculators and news platform.",
  openGraph: {
    title: "Privacy Policy | Fistotex",
    description: "How we collect, use, and protect your personal information.",
    type: "website",
  },
};

// Update this date whenever the policy text changes.
const lastUpdated = new Date("2026-09-26").toLocaleDateString("en-IN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    icon: ShieldCheck,
    content: `
      <p>Welcome to <strong>${siteConfig.name}</strong> ("we," "our," or "us"). We are committed to protecting your privacy and being transparent about how we collect, use, and share your information.</p>
      <p>This Privacy Policy explains our practices regarding the information we collect when you visit our website at <strong>${siteConfig.url}</strong> ("the Site"), use our financial calculators, read our news content, or interact with our services.</p>
      <p>By using the Site, you agree to the collection and use of information in accordance with this policy. If you do not agree with this policy, please do not use the Site.</p>
    `,
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    icon: Database,
    content: `
      <h3>2.1 Information You Provide Directly</h3>
      <ul>
        <li><strong>Contact Form Data:</strong> When you fill out our contact form, we collect your name, email address, subject, and message.</li>
        <li><strong>Email Communications:</strong> If you email us directly, we collect your email address and the content of your message.</li>
      </ul>

      <h3>2.2 Information Collected Automatically</h3>
      <ul>
        <li><strong>Analytics Data:</strong> We use Google Analytics 4 (GA4) to collect anonymous usage data including pages visited, time on page, device type, browser, country (based on IP), and referral source. This data does not personally identify you.</li>
        <li><strong>Calculator Usage:</strong> Our financial calculators run entirely in your browser. <strong>We do not collect, store, or transmit any data you enter into calculators.</strong> All calculations happen locally on your device.</li>
        <li><strong>Technical Data:</strong> IP address, browser type, operating system, referring URLs, and access times for security and performance monitoring.</li>
      </ul>

      <h3>2.3 Cookies and Similar Technologies</h3>
      <p>We use cookies and similar tracking technologies for:</p>
      <ul>
        <li><strong>Essential cookies:</strong> Required for the Site to function properly</li>
        <li><strong>Analytics cookies:</strong> GA4 cookies (_ga, _ga_*) to understand how visitors interact with the Site</li>
      </ul>
      <p>You can control cookies through your browser settings. Disabling essential cookies may break Site functionality.</p>
    `,
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    icon: Eye,
    content: `
      <p>We use the information we collect for:</p>
      <ul>
        <li>Operating and maintaining the Site</li>
        <li>Responding to your inquiries and messages</li>
        <li>Improving Site performance and user experience</li>
        <li>Analyzing usage trends via anonymous aggregated analytics</li>
        <li>Ensuring Site security and preventing fraud</li>
        <li>Complying with legal obligations</li>
      </ul>
      <p><strong>We do not sell your personal information to third parties.</strong></p>
    `,
  },
  {
    id: "data-sharing",
    title: "4. Data Sharing and Disclosure",
    icon: Truck,
    content: `
      <p>We may share your information in the following circumstances:</p>
      <ul>
        <li><strong>Service Providers:</strong> We use Vercel (hosting), Google Analytics (Google LLC) for anonymous website analytics, and Resend to deliver contact-form messages to our inbox. Each provider's privacy policy governs its data handling.</li>
        <li><strong>Legal Requirements:</strong> If required by law, court order, or government request.</li>
        <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
        <li><strong>With Your Consent:</strong> When you explicitly agree to share information.</li>
      </ul>
      <p>We do not share calculator inputs or results with any third party - these never leave your browser.</p>
    `,
  },
  {
    id: "data-security",
    title: "5. Data Security",
    icon: Lock,
    content: `
      <p>We implement reasonable technical and organizational measures to protect your information:</p>
      <ul>
        <li>HTTPS encryption for all data in transit</li>
        <li>Secure hosting on Vercel with SOC 2 compliance</li>
        <li>No database storing personal calculator data</li>
        <li>Regular security updates and dependency monitoring</li>
      </ul>
      <p>However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.</p>
    `,
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    icon: UserCheck,
    content: `
      <p>Depending on your location, you may have the following rights:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of personal data we hold about you</li>
        <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
        <li><strong>Erasure:</strong> Request deletion of your data (subject to legal obligations)</li>
        <li><strong>Restriction:</strong> Request limitation of processing</li>
        <li><strong>Portability:</strong> Receive your data in a structured format</li>
        <li><strong>Objection:</strong> Object to processing for direct marketing or legitimate interests</li>
        <li><strong>Withdraw Consent:</strong> Where processing is based on consent</li>
      </ul>
      <p>To exercise these rights, contact us at <a href="mailto:${siteConfig.contactEmail}" className="underline">${siteConfig.contactEmail}</a>.</p>
    `,
  },
  {
    id: "third-party-links",
    title: "7. Third-Party Links",
    icon: Globe,
    content: `
      <p>The Site contains links to third-party websites (news sources, financial institutions, etc.). We are not responsible for the privacy practices or content of these external sites. This Privacy Policy applies only to the Site.</p>
      <p>When you click on news articles, you leave our Site and are subject to the destination site's privacy policy.</p>
    `,
  },
  {
    id: "children",
    title: "8. Children's Privacy",
    icon: Calendar,
    content: `
      <p>The Site is not directed to children under 13 (or 16 in some jurisdictions). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.</p>
    `,
  },
  {
    id: "international-transfers",
    title: "9. International Data Transfers",
    icon: Globe,
    content: `
      <p>Our Site is hosted in India/US via Vercel. Google Analytics processes data in the US. By using the Site, you consent to the transfer of your information to these jurisdictions, which may have different data protection laws than your country.</p>
    `,
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    icon: Calendar,
    content: `
      <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated "Last Updated" date.</p>
      <p>Your continued use of the Site after changes constitutes acceptance of the updated policy.</p>
    `,
  },
  {
    id: "contact",
    title: "11. Contact Us",
    icon: Mail,
    content: `
      <p>If you have questions about this Privacy Policy or our data practices, contact us:</p>
      <ul>
        <li>Email: <a href="mailto:${siteConfig.contactEmail}" className="underline">${siteConfig.contactEmail}</a></li>
        <li>Website: <a href="${siteConfig.url}/contact" className="underline">${siteConfig.url}/contact</a></li>
      </ul>
    `,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col">
      <StructuredData type="WebPage" data={{ title: "Privacy Policy", description: "Fistotex Privacy Policy - How we collect, use, and protect your personal information." }} />

      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description={
          <>
            <span className="block">Last updated: {lastUpdated}</span>
          </>
        }
        crumbs={[{ name: "Privacy Policy" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="legal-copy surface p-6 md:p-10">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="mb-10 border-b border-border pb-8 last:mb-0 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="icon-tile h-10 w-10">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <h2 className="!m-0 text-xl font-bold text-foreground md:text-2xl">{section.title}</h2>
                  </div>
                  <div className="space-y-4 md:ml-[52px] text-muted-foreground leading-relaxed">
                    {section.content.split('\n\n').map((paragraph, i) => (
                      <div key={i} dangerouslySetInnerHTML={{ __html: paragraph.trim() }} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 surface p-6 border-brand/30 bg-brand/5">
              <h3 className="font-semibold text-foreground mb-3">Summary</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-accent">✓</span> Calculator data never leaves your browser (your light/dark theme choice is saved in your browser only)</li>
                <li className="flex gap-2"><span className="text-accent">✓</span> Only contact form data and anonymous analytics collected</li>
                <li className="flex gap-2"><span className="text-accent">✓</span> No selling of personal information</li>
                <li className="flex gap-2"><span className="text-accent">✓</span> Google Analytics 4 for anonymous usage stats</li>
                <li className="flex gap-2"><span className="text-accent">✓</span> You can request data deletion anytime</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}