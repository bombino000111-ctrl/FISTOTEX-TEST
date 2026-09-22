import Link from "next/link";
import { TrendingUp, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/news", label: "Latest News" },
      { href: "/toolkit", label: "Toolkit" },
      { href: "/toolkit/finance-calculator", label: "All Calculators" },
    ],
  },
  {
    title: "Popular calculators",
    links: [
      { href: "/toolkit/finance-calculator/sip", label: "SIP Calculator" },
      { href: "/toolkit/finance-calculator/emi", label: "EMI Calculator" },
      { href: "/toolkit/finance-calculator/fd", label: "FD Calculator" },
      { href: "/toolkit/finance-calculator/ppf", label: "PPF Calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/terms-and-conditions", label: "Terms & Conditions" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <TrendingUp className="h-4 w-4" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Clear financial news and practical calculators for smarter money decisions.
            </p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {siteConfig.contactEmail}
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </h2>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Information provided for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
