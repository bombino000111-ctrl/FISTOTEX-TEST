import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/layout/logo";
import { ManageCookiesButton } from "@/components/ads/consent-banner";

const columns = [
  {
    title: "Investing",
    links: [
      { href: "/calculators/sip", label: "SIP calculator" },
      { href: "/calculators/lumpsum", label: "Lumpsum calculator" },
      { href: "/calculators/mutual-fund", label: "Mutual fund returns" },
      { href: "/calculators/cagr", label: "CAGR calculator" },
      { href: "/calculators/xirr", label: "XIRR calculator" },
    ],
  },
  {
    title: "Loans & savings",
    links: [
      { href: "/calculators/emi", label: "EMI calculator" },
      { href: "/calculators/loan", label: "Loan eligibility" },
      { href: "/calculators/fd", label: "Fixed deposit (FD)" },
      { href: "/calculators/rd", label: "Recurring deposit (RD)" },
      { href: "/calculators/ppf", label: "PPF calculator" },
    ],
  },
  {
    title: "Retirement & planning",
    links: [
      { href: "/calculators/nps", label: "NPS calculator" },
      { href: "/calculators/retirement", label: "Retirement corpus" },
      { href: "/calculators/inflation", label: "Inflation calculator" },
      { href: "/calculators/bond", label: "Bond yield" },
    ],
  },
  {
    title: "Fistotex",
    links: [
      { href: "/about", label: "How it works" },
      { href: "/news", label: "Market wire" },
      { href: "/market-calendar", label: "Market calendar" },
      { href: "/earnings", label: "Earnings results" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/terms-and-conditions", label: "Terms of use" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-foreground bg-muted text-xs text-ink-2">
      <div className="container mx-auto px-4 pb-8 pt-12">
        <div className="grid grid-cols-1 gap-8 border-b border-border pb-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Colophon */}
          <div className="space-y-3 sm:col-span-2">
            <Logo compact />
            <p className="max-w-sm text-xs leading-relaxed text-ink-2">
              Free, independent calculators for Indian households, with every formula shown —
              plus the day&apos;s market news from India&apos;s leading publishers.
            </p>
            <div className="space-y-1 pt-2 font-mono text-[11px] text-foreground">
              {siteConfig.businessAddress && <p>Editorial office: {siteConfig.businessAddress}</p>}
              <p>
                Inquiries:{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-accent hover:underline"
                >
                  {siteConfig.contactEmail}
                </a>
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-wider text-foreground">
                {col.title}
              </h2>
              <ul className="space-y-1 font-medium">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 text-sm text-ink-2 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center font-mono text-[11px] text-muted-foreground sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} {siteConfig.name}. For education only — not investment advice.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1 font-semibold text-accent">
              <ShieldCheck className="h-3.5 w-3.5" />
              Calculations stay in your browser
            </span>
            <span aria-hidden="true">·</span>
            <ManageCookiesButton className="underline-offset-2 hover:text-foreground hover:underline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
