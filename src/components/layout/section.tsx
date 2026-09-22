import * as React from "react";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";

interface SectionProps {
  id?: string;
  /** Uppercase label that makes the section boundary obvious */
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned action, e.g. a "View all" link */
  action?: React.ReactNode;
  children: React.ReactNode;
  tone?: "default" | "muted";
  className?: string;
  contentClassName?: string;
}

/**
 * Page section with a visible label + heading block.
 * Used on every page so sections are visually distinct and scannable.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
  tone = "default",
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-14 md:py-20",
        tone === "muted" && "bg-muted/40 border-y border-border",
        className
      )}
    >
      <div className={cn("container mx-auto px-4", contentClassName)}>
        {(eyebrow || title || description || action) && (
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
              {title && (
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-3 text-muted-foreground leading-relaxed">{description}</p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}

/**
 * Standard top-of-page header: breadcrumbs, eyebrow, H1, description.
 * Gives every page an identical, predictable opening.
 */
export function PageHeader({ eyebrow, title, description, crumbs, children }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-gradient-to-b from-muted/60 to-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {crumbs && <Breadcrumbs items={crumbs} className="mb-6" />}
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
