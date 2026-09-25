import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Brand mark: solid green tile with a rising trend line. Matches /icon.svg. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("h-9 w-9", className)}>
      <rect width="64" height="64" rx="12" fill="#0B6E4F" />
      <path d="M16 44 L27 32 L35 38 L48 22" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 22 H48 V30" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("group flex shrink-0 items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <LogoMark />
      <span className="text-xl font-bold tracking-tight text-foreground">
        Fisto<span className="text-accent">tex</span>
      </span>
    </Link>
  );
}
