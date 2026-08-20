import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * The site is fully static (no middleware, no nonces), so script/style
 * fall back to 'unsafe-inline' — required by Next's hydration bootstrap
 * and Tailwind's injected styles. Everything else is locked down.
 *
 *   frame-src 'self' www.google.com → same-origin newsletter PDF viewer
 *                                     (About page) + Contact-page Maps embed
 *   img-src  data: blob: https      → next/image + Maps tiles
 *   font-src 'self'                 → next/font self-hosts the Google fonts
 *
 * Framing is kept locked to our own origin (`frame-ancestors 'self'` +
 * `X-Frame-Options: SAMEORIGIN`): external sites still cannot embed the site,
 * but the About page can embed its own newsletter PDFs in an <iframe>.
 */
// React's dev runtime needs eval() for debugging; production never does.
const scriptSrc =
  process.env.NODE_ENV === "production"
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: blob:",
  "frame-src 'self' https://www.google.com",
  "connect-src 'self'",
  // Same-origin pdf.js worker (public/pdfjs) powers the newsletter book reader;
  // blob: covers pdf.js's fallback worker path.
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

/**
 * Static assets under `public/` are otherwise served `max-age=0,
 * must-revalidate`, so every repeat view pays a conditional request per file
 * before it can reuse the copy it already has. Nothing here is edited in
 * place — new photos and new notes arrive under new filenames — so they can
 * be cached for real, with `stale-while-revalidate` covering the case where
 * one is replaced.
 */
const assetCache = (maxAge: number, swr: number) => [
  {
    key: "Cache-Control",
    value: `public, max-age=${maxAge}, stale-while-revalidate=${swr}`,
  },
];

const DAY = 86400;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 40 is for decorative backdrops (homepage panels) that are painted at
    // ~30% opacity under gradients; 75 is Next's default for everything else.
    qualities: [40, 75],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/images/:path*",
        headers: assetCache(30 * DAY, 365 * DAY),
      },
      {
        // pdf.js worker — only changes when pdfjs-dist is upgraded.
        source: "/pdfjs/:path*",
        headers: assetCache(30 * DAY, 365 * DAY),
      },
      {
        // Course material: append-only in practice, but a file could be
        // re-uploaded with corrections, so keep the fresh window short and
        // let stale-while-revalidate absorb the update.
        source: "/:dir(notes|syllabus|newsletters)/:path*",
        headers: assetCache(DAY, 30 * DAY),
      },
    ];
  },
};

export default nextConfig;
