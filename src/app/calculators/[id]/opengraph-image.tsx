import { ImageResponse } from "next/og";
import { calculatorIds, getCalculator, getCategory } from "@/lib/calculators/registry";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Fistotex calculator";

// Rendered once per calculator at build time, so share previews load instantly
export function generateStaticParams() {
  return calculatorIds.map((id) => ({ id }));
}

/** Share card for WhatsApp, LinkedIn and X: the calculator's name and formula, in the site's paper palette. */
export default async function Image({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await params;
  const def = getCalculator(id);
  const category = def ? getCategory(def.category) : undefined;
  const tint = category?.tint ?? "#8A5A1F";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FDFCFA",
          padding: "64px 72px",
          borderTop: `16px solid ${tint}`,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#2A2420", borderRadius: 999,
              color: "#E2C27A",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            ₹
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#2A2420" }}>Fistotex</div>
          {category && (
            <div
              style={{
                display: "flex",
                marginLeft: 16,
                padding: "6px 16px",
                border: `2px solid ${tint}`,
                borderRadius: 999,
                color: tint,
                fontSize: 22,
              }}
            >
              {category.name}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: "#2A2420", lineHeight: 1.05 }}>
            {def?.name ?? "Finance calculators"}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 34, color: "#4A4038", lineHeight: 1.3 }}>
            {def?.tagline ?? "Free calculators for India, with every formula shown."}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #D6CBBB",
            paddingTop: 24,
            fontSize: 24,
            color: "#6B5F54",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex", maxWidth: 820, overflow: "hidden", whiteSpace: "nowrap" }}>
            {def?.formula.expression ?? ""}
          </div>
          <div style={{ display: "flex", color: "#7A5714", fontWeight: 700 }}>Free, no sign-up</div>
        </div>
      </div>
    ),
    size
  );
}
