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
          background: "#E8EAE6",
          color: "#262A4F",
          fontFamily: "Georgia, serif",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 36, margin: 0 }}>Something went wrong</h1>
          <p style={{ fontSize: 18, color: "#585D7A", lineHeight: 1.5 }}>
            Fistotex couldn&apos;t load. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "12px 24px",
              background: "#34419A",
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
