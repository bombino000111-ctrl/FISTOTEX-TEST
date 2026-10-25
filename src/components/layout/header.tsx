"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Calculator } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  {
    href: "/calculators",
    label: "Calculators",
    match: (p: string) => p.startsWith("/calculators"),
  },
  {
    href: "/news",
    label: "Market News",
    match: (p: string) => p.startsWith("/news"),
  },
  {
    href: "/market-calendar",
    label: "Calendar",
    match: (p: string) => p.startsWith("/market-calendar"),
  },
  {
    href: "/earnings",
    label: "Earnings",
    match: (p: string) => p.startsWith("/earnings"),
  },
  {
    href: "/about",
    label: "About",
    match: (p: string) => p.startsWith("/about"),
  },
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

  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);

  // While the mobile menu is open: lock body scroll, fit the menu to the space
  // actually left below the header (the dateline strip may still be showing),
  // keep Tab inside the menu, and close on Escape with focus back on the toggle.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const headerTop = Math.max(0, headerRef.current?.getBoundingClientRect().top ?? 0);
    if (menuRef.current) menuRef.current.style.height = `calc(100dvh - ${headerTop + 68}px)`;
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;
      const items = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>("a")].filter(
        (el): el is HTMLElement => !!el
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md transition-shadow duration-300",
        (scrolled || open) && "shadow-[0_1px_8px_rgb(0_0_0/0.06)]"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-[68px] items-center justify-between gap-4">
          <Logo />

          {/* Masthead nav */}
          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-card font-semibold text-foreground"
                      : "text-ink-2 hover:bg-muted hover:text-foreground"
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
              href="/calculators"
              className="btn-brand hidden h-10 px-4 text-sm whitespace-nowrap xl:inline-flex"
            >
              All calculators
              <Calculator className="h-4 w-4" />
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              ref={toggleRef}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule text-foreground lg:hidden"
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
        ref={menuRef}
        hidden={!open}
        className="h-[calc(100dvh-68px)] overflow-y-auto border-t border-border bg-background lg:hidden"
      >
        <nav aria-label="Mobile" className="container mx-auto flex flex-col gap-1 px-4 py-6">
          {navItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "font-display flex min-h-14 items-center justify-between border-b border-border px-2 text-2xl transition-colors",
                  active ? "bg-muted text-accent" : "text-ink-2 hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
                <ArrowRight className="h-4 w-4 opacity-50" />
              </Link>
            );
          })}
          <Link
            href="/calculators"
            onClick={() => setOpen(false)}
            className="btn-brand mt-4 h-12 text-base"
          >
            All calculators
            <Calculator className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
