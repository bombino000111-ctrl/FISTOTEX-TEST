"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calculator, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/toolkit", label: "Toolkit" },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">{siteConfig.name}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/toolkit/finance-calculator">
              <Calculator className="mr-2 h-4 w-4" />
              Finance Calculators
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary py-2",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/toolkit/finance-calculator"
              className="text-sm font-medium text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Finance Calculator
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm font-medium text-muted-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Privacy Policy
            </Link>
            <Link
              href="/disclaimer"
              className="text-sm font-medium text-muted-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Disclaimer
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
