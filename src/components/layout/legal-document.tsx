import type * as React from "react";

export interface LegalSection {
  id: string;
  title: string;
  /** Trusted, hand-written HTML. Paragraphs are separated by blank lines. */
  content: string;
}

/**
 * A legal page set for reading: the plain-language summary first, a contents
 * list beside the text on wide screens (folded away on phones), and each
 * section's prose at a comfortable measure.
 */
export function LegalDocument({
  sections,
  summary,
}: {
  sections: LegalSection[];
  summary: { title: string; items: React.ReactNode[] };
}) {
  const contents = (
    <ol className="space-y-1 text-sm">
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="block rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Contents" className="lg:sticky lg:top-24 lg:self-start">
          <details className="rounded-[var(--radius)] border border-border bg-card p-4 lg:hidden">
            <summary className="cursor-pointer font-semibold text-foreground">Contents</summary>
            <div className="mt-3">{contents}</div>
          </details>
          <div className="hidden lg:block">
            <h2 className="mb-3 px-2 text-sm font-semibold text-foreground">Contents</h2>
            {contents}
          </div>
        </nav>

        <div className="max-w-[68ch]">
          <section aria-labelledby="legal-summary" className="rounded-[var(--radius)] border border-border bg-card p-6 md:p-8">
            <h2 id="legal-summary" className="font-display text-2xl text-foreground">
              {summary.title}
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-ink-2 marker:text-principal">
              {summary.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="legal-copy mt-14">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 border-t border-border py-10 first:border-t-0 first:pt-0">
                <h2 className="font-display !m-0 text-3xl text-foreground">{section.title}</h2>
                <div className="mt-5 space-y-4">
                  {section.content.split("\n\n").map((paragraph, i) => (
                    <div key={i} dangerouslySetInnerHTML={{ __html: paragraph.trim() }} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
