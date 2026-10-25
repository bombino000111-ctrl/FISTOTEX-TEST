import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Mark: a rupee in an ink oval, like the watermark window on a note.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-xl leading-none text-background",
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
  /** Smaller wordmark for tight spaces (footer). */
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
      <span
        className={cn(
          "font-display block leading-none text-foreground",
          compact ? "text-xl" : "text-2xl sm:text-[1.75rem]"
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
