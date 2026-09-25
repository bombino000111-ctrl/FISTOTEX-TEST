import Link from "next/link";
import { Compass, Home, Calculator } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center px-4 py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-8xl text-accent md:text-9xl">404</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist, may have moved, or the link is out of
          date.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-brand h-11 px-6 text-sm"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
          <Link
            href="/toolkit/finance-calculator"
            className="btn-ghost h-11 px-6 text-sm"
          >
            <Calculator className="h-4 w-4" />
            Explore calculators
          </Link>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Compass className="h-3.5 w-3.5" />
            Popular destinations
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            {[
              { href: "/news", label: "Latest News" },
              { href: "/toolkit", label: "Toolkit" },
              { href: "/toolkit/finance-calculator/sip", label: "SIP Calculator" },
              { href: "/toolkit/finance-calculator/emi", label: "EMI Calculator" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
