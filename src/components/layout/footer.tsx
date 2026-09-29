import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/layout/logo";

const columns = [
  {
    title: "Investing tools",
    links: [
      { href: "/calculators/sip", label: "SIP calculator" },
      { href: "/calculators/lumpsum", label: "Lumpsum compound" },
      { href: "/calculators/mutual-fund", label: "Mutual fund returns" },
      { href: "/calculators/cagr", label: "CAGR calculator" },
      { href: "/calculators/xirr", label: "XIRR calculator" },
    ],
  },
  {
    title: "Loans & sovereign",
    links: [
      { href: "/calculators/emi", label: "EMI calculator" },
      { href: "/calculators/loan", label: "Loan eligibility" },
      { href: "/calculators/ppf", label: "PPF (Public Provident)" },
      { href: "/calculators/fd", label: "Fixed deposit (FD)" },
      { href: "/calculators/nps", label: "NPS pension scheme" },
    ],
  },
  {
    title: "Methodology",
    links: [
      { href: "/about", label: "Formulas & method" },
      { href: "/news", label: "Syndicated wire" },
      { href: "/privacy-policy", label: "Privacy by design" },
      { href: "/disclaimer", label: "Statutory disclaimers" },
      { href: "/terms-and-conditions", label: "Terms of reference" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-foreground bg-muted text-xs text-ink-2">
      <div className="container mx-auto px-4 pb-8 pt-12">
        <div className="grid grid-cols-1 gap-8 border-b border-border pb-10 sm:grid-cols-2 md:grid-cols-5">
          {/* Colophon */}
          <div className="space-y-3 sm:col-span-2">
            <Logo compact />
            <p className="max-w-sm text-xs leading-relaxed text-ink-2">
              An independent, non-telemetry Indian financial reference broadsheet. Verified
              compounding mathematics and syndicated business news for disciplined household
              investors.
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
              <ul className="space-y-2 font-medium">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ink-2 transition-colors hover:text-accent"
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
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All computations executed locally on
            your own hardware.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1 font-semibold text-accent">
              <BadgeCheck className="h-3.5 w-3.5" />
              Zero telemetry
            </span>
            <span aria-hidden="true">·</span>
            <span>For education only — not investment advice</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
