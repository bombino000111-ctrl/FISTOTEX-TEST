"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

/** Shown when a page fails to render. Calm, with a way forward. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center px-4 py-20">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-4xl text-foreground md:text-5xl">Something went wrong</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This page didn&apos;t load properly. Trying again usually fixes it — and nothing you
          entered has been lost or sent anywhere.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn-brand h-11 px-6 text-sm">
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link href="/calculators" className="btn-ghost h-11 px-6 text-sm">
            All calculators
          </Link>
        </div>
      </div>
    </div>
  );
}
