"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/toolkit/finance-calculator", label: "Calculators", match: (p: string) => p.startsWith("/toolkit") },
  { href: "/news", label: "News", match: (p: string) => p.startsWith("/news") },
  { href: "/about", label: "About", match: (p: string) => p.startsWith("/about") },
  { href: "/contact", label: "Contact", match: (p: string) => p.startsWith("/contact") },
];

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  // Close the mobile menu whenever the route changes
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll and allow Escape while the mobile menu is open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-card transition-shadow duration-300",
        (scrolled || open) && "shadow-[0_1px_8px_rgb(0_0_0/0.06)]"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <Logo />

          {/* Desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {navItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground after:absolute after:inset-x-3.5 after:-bottom-[19px] after:h-0.5 after:bg-accent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/toolkit/finance-calculator/sip"
              className="btn-brand hidden h-10 px-4 text-sm lg:inline-flex"
            >
              Start calculating
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background md:hidden"
      >
        <nav aria-label="Mobile" className="container mx-auto flex flex-col gap-1 px-4 py-6">
          {navItems.map((item, i) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                style={{ animationDelay: `${i * 40}ms` }}
                className={cn(
                  "animate-fade-up flex items-center justify-between rounded-lg px-4 py-3.5 text-lg font-semibold transition-colors",
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
            );
          })}
          <Link
            href="/toolkit/finance-calculator/sip"
            onClick={() => setOpen(false)}
            className="btn-brand mt-4 h-12 text-base"
          >
            Start calculating
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
