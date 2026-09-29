import { ShieldCheck } from "lucide-react";

/**
 * The strip above the masthead: edition, registry and the privacy claim.
 * Static and server-rendered — it carries no state, so it costs nothing.
 */
export function Dateline() {
  return (
    <aside className="border-b border-border bg-muted/60">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold tracking-tight text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            NEW DELHI · MUMBAI EDITION
          </span>
          <span aria-hidden="true" className="hidden text-rule md:inline">
            |
          </span>
          <span className="hidden font-medium md:inline">
            STANDARD RBI · SEBI · PFRDA FORMULAS
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <span className="hidden text-ink-2 sm:inline">ZERO-TELEMETRY BROWSER ENGINE</span>
          <span aria-hidden="true" className="hidden text-rule sm:inline">
            |
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-accent">
            <ShieldCheck className="h-3.5 w-3.5" />
            100% CLIENT-SIDE
          </span>
        </div>
      </div>
    </aside>
  );
}
