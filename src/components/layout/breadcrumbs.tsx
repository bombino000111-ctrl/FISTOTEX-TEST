import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  href?: string;
}

/**
 * Breadcrumbs — rendered on every inner page so users always know
 * where they are and can step back up a level.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ name: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
        {all.map((item, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-foreground font-medium">
                  {item.name}
                </span>
              )}
              {!last && <span aria-hidden="true" className="text-border">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
