import { ShieldCheck } from "lucide-react";

/**
 * The strip above the masthead: what the site is, and the privacy promise it
 * can actually keep. Static and server-rendered — it costs nothing.
 */
export function Dateline() {
  return (
    <div className="border-b border-border bg-muted/60">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 text-xs text-muted-foreground">
        <span className="hidden items-center gap-1.5 font-medium text-ink-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Free calculators for India · every formula shown
        </span>

        <span className="inline-flex items-center gap-1.5 font-medium text-accent">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Your numbers never leave your browser
        </span>
      </div>
    </div>
  );
}
