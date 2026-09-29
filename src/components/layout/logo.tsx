import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Masthead mark: a solid ink tile struck with a rupee, the way a gazette
 * prints its colophon. Square, not rounded — this is letterpress, not an app.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-foreground bg-foreground text-xl font-bold leading-none text-background",
        "font-display",
        className
      )}
    >
      ₹
    </span>
  );
}

export function Logo({
  className,
  onClick,
  /** Hides the "The Indian Investor's Gazette" strapline (tight spaces, footer). */
  compact = false,
}: {
  className?: string;
  onClick?: () => void;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("group flex shrink-0 items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <LogoMark className={compact ? "h-6 w-6 text-sm" : undefined} />
      <span className="block">
        <span
          className={cn(
            "font-display block font-extrabold leading-none tracking-tight text-foreground",
            compact ? "text-xl" : "text-2xl sm:text-3xl"
          )}
        >
          {siteConfig.name}
        </span>
        {!compact && (
          <span className="mt-0.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-2">
            The Indian Investor&apos;s Gazette
          </span>
        )}
      </span>
    </Link>
  );
}
