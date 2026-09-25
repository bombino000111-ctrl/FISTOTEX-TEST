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
        "py-16 md:py-24",
        tone === "muted" && "border-y border-border bg-muted/50",
        className
      )}
    >
      <div className={cn("container mx-auto px-4", contentClassName)}>
        {(eyebrow || title || description || action) && (
          <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
              {title && (
                <h2 className="font-display text-3xl text-foreground md:text-4xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{description}</p>
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
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  /** Optional right-hand visual on large screens */
  aside?: React.ReactNode;
}

/**
 * Standard top-of-page header: breadcrumbs, eyebrow, H1, description,
 * on a plain card-coloured band.
 */
export function PageHeader({ eyebrow, title, description, crumbs, children, aside }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className={cn(aside && "grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]")}>
          <div className="animate-fade-up">
            {crumbs && <Breadcrumbs items={crumbs} className="mb-6" />}
            {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
            <h1 className="font-display max-w-3xl text-4xl text-foreground md:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              {title}
            </h1>
            {description && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {aside && <div className="hidden lg:block">{aside}</div>}
        </div>
      </div>
    </div>
  );
}
