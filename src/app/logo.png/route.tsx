import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/** 512×512 PNG brand mark for Organization schema (Google ignores SVG logos). */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B6E4F",
        }}
      >
        <svg width="340" height="340" viewBox="0 0 64 64">
          <path d="M16 44 L27 32 L35 38 L48 22" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40 22 H48 V30" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
