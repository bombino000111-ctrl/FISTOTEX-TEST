"use client";

/**
 * Last-resort boundary for errors in the root layout itself. It replaces the
 * whole document, so it carries its own <html> and inline styles.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF7F2",
          color: "#1A1D20",
          fontFamily: "Georgia, serif",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 36, margin: 0 }}>Something went wrong</h1>
          <p style={{ fontSize: 18, color: "#5F6770", lineHeight: 1.5 }}>
            Fistotex couldn&apos;t load. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "12px 24px",
              background: "#0A5C36",
              color: "#fff",
              border: 0,
              borderRadius: 4,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
