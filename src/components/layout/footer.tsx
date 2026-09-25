import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/layout/logo";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/news", label: "Latest news" },
      { href: "/toolkit", label: "Toolkit" },
      { href: "/toolkit/finance-calculator", label: "All calculators" },
    ],
  },
  {
    title: "Popular tools",
    links: [
      { href: "/toolkit/finance-calculator/sip", label: "SIP calculator" },
      { href: "/toolkit/finance-calculator/emi", label: "EMI calculator" },
      { href: "/toolkit/finance-calculator/fd", label: "FD calculator" },
      { href: "/toolkit/finance-calculator/retirement", label: "Retirement planner" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/terms-and-conditions", label: "Terms & conditions" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-card">
      {/* CTA band */}
      <div className="container mx-auto px-4 pt-14">
        <div className="rounded-lg bg-panel px-6 py-10 text-white sm:px-10 md:py-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl md:text-3xl">
                Your money, in numbers you can trust.
              </h2>
              <p className="mt-2 text-white/70">
                {siteConfig.name} is free, needs no sign-up and runs every calculation in your browser.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/toolkit/finance-calculator" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-panel transition-colors hover:bg-white/90">
                Explore calculators
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/news"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Read the news
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Clear financial news and transparent calculators built for Indian investors.
            </p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {siteConfig.contactEmail}
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">
                {col.title}
              </h2>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" />
            For education only — not investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
