/** Quiet placeholder blocks while a data page (news, earnings, calendar) loads. */
export function PageSkeleton({ label }: { label: string }) {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16" aria-busy="true">
      <p className="sr-only" role="status">
        Loading {label}…
      </p>
      <div aria-hidden="true" className="animate-pulse space-y-8">
        <div className="space-y-3">
          <div className="h-3 w-40 rounded bg-muted" />
          <div className="h-10 w-3/4 max-w-xl rounded bg-muted" />
          <div className="h-4 w-full max-w-2xl rounded bg-muted" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="surface space-y-3 p-6">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-5 w-full rounded bg-muted" />
              <div className="h-5 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
