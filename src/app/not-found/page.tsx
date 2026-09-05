import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "Sorry, the page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-3xl font-bold text-primary">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/news">
              <Search className="mr-2 h-4 w-4" />
              Browse News
            </Link>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Or try these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link href="/toolkit/finance-calculator" className="text-primary hover:underline">Financial Calculators</Link>
            <Link href="/about" className="text-primary hover:underline">About Us</Link>
            <Link href="/contact" className="text-primary hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}