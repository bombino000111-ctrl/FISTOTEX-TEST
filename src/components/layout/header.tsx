"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Calculator, ChevronDown, Newspaper, CalendarDays, TrendingUp } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/calculators", label: "Calculators", match: (p: string) => p.startsWith("/calculators") },
  { href: "/news", label: "News", live: true, match: (p: string) => p.startsWith("/news") },
  { href: "/about", label: "About", match: (p: string) => p.startsWith("/about") },
  { href: "/contact", label: "Contact", match: (p: string) => p.startsWith("/contact") },
];

const toolkitItems = [
  {
    href: "/news",
    label: "News",
    desc: "Live market wires from Mint, ET, Moneycontrol & Business Standard",
    icon: Newspaper,
    match: (p: string) => p.startsWith("/news"),
  },
  {
    href: "/calculators",
    label: "Calculators",
    desc: "All 14 RBI-grade financial calculators",
    icon: Calculator,
    match: (p: string) => p.startsWith("/calculators"),
  },
  {
    href: "/toolkit/market-calendar",
    label: "Market Calendar",
    desc: "RBI policy, F&O expiry, Budget & volatile days",
    icon: CalendarDays,
    match: (p: string) => p.startsWith("/toolkit/market-calendar"),
  },
  {
    href: "/toolkit/results",
    label: "Results",
    desc: "Nifty 50 quarterly results, QoQ & YoY",
    icon: TrendingUp,
    match: (p: string) => p.startsWith("/toolkit/results"),
  },
];

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [toolkitOpen, setToolkitOpen] = React.useState(false);
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
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md transition-shadow duration-300",
        (scrolled || open) && "shadow-[0_1px_8px_rgb(0_0_0/0.06)]"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-[68px] items-center justify-between gap-4">
          <Logo />

          {/* Masthead nav */}
          <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex lg:gap-1">
            {navItems.slice(0, 1).map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors",
                    active
                      ? "border-b-2 border-accent font-bold text-accent"
                      : "text-ink-2 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <ToolkitMenu pathname={pathname} open={toolkitOpen} setOpen={setToolkitOpen} />
            {navItems.slice(1).map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors",
                    active
                      ? "border-b-2 border-accent font-bold text-accent"
                      : "text-ink-2 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                  {item.live && (
                    <span className="rounded-sm bg-accent-soft px-1.5 py-px font-mono text-[10px] font-bold text-accent">
                      LIVE
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/calculators"
              className="btn-brand hidden h-10 px-4 font-mono text-xs font-bold uppercase tracking-wide lg:inline-flex"
            >
              All Calculators
              <Calculator className="h-4 w-4" />
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-rule text-foreground md:hidden"
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
        className="h-[calc(100dvh-68px)] overflow-y-auto border-t border-border bg-background md:hidden"
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
                  "animate-fade-up font-display flex items-center justify-between rounded-sm border-b border-border px-4 py-3.5 text-lg font-bold transition-colors",
                  active ? "bg-muted text-accent" : "text-ink-2 hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
            );
          })}
          <p className="eyebrow mt-6 px-4">Toolkit</p>
          {toolkitItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-4 py-3 text-base font-semibold transition-colors",
                  active ? "bg-muted text-accent" : "text-ink-2 hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <ArrowRight className="ml-auto h-4 w-4 opacity-50" />
              </Link>
            );
          })}
          <Link
            href="/calculators"
            onClick={() => setOpen(false)}
            className="btn-brand mt-4 h-12 font-mono text-sm font-bold uppercase tracking-wide"
          >
            All Calculators
            <Calculator className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** Desktop Toolkit dropdown - opens on hover and click, closes on Escape / mouse leave. */
function ToolkitMenu({
  pathname,
  open,
  setOpen,
}: {
  pathname: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const active = toolkitItems.some((i) => i.match(pathname));
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors",
          active
            ? "border-b-2 border-accent font-bold text-accent"
            : "text-ink-2 hover:bg-muted hover:text-foreground"
        )}
      >
        Toolkit
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 w-72 rounded-sm border border-rule bg-card p-1.5 shadow-lg">
          {toolkitItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 rounded-sm px-3 py-2.5 transition-colors hover:bg-muted"
            >
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                <span className="block text-xs text-muted-foreground">{item.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
