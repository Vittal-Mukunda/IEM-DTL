import { ImageResponse } from "next/og";

// Site-wide social-share card. File-based OG images are auto-wired by Next
// into both og:image and twitter:image, so link previews (WhatsApp, LinkedIn,
// X, Slack) get a branded card on every route that doesn't override it.
export const alt =
  "Department of Industrial Engineering & Management, RV College of Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#070b14",
          backgroundImage:
            "linear-gradient(rgba(120,170,230,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,230,0.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#5ad1c4",
          }}
        >
          IEM · RV College of Engineering
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          <span>Industrial Engineering</span>
          <span style={{ color: "#5ad1c4" }}>&amp; Management</span>
        </div>
        <div
          style={{
            marginTop: 36,
            height: 8,
            width: 180,
            borderRadius: 999,
            background: "#5ad1c4",
          }}
        />
        <div style={{ marginTop: 36, fontSize: 32, color: "rgba(255,255,255,0.78)" }}>
          NBA-accredited B.E. · Bengaluru · 70%+ placements
        </div>
      </div>
    ),
    { ...size },
  );
}
