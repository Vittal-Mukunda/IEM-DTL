# IEM Department Website — RVCE

Official website for the Department of Industrial Engineering & Management,
R.V. College of Engineering (RVCE), Bengaluru.

Built with **Next.js 16 (App Router) + Tailwind CSS 4 + Motion (Framer Motion)**.
Fully static — every route is prerendered, no server runtime.

## Features

- **Scroll-driven cinematic homepage** ("The X-Ray") — a scanner sweeps each
  photo to reveal the engineered systems underneath, then converges six career
  worlds into one finale. All animations respect `prefers-reduced-motion` and
  fall back to a static, fully-readable version.
- 9 content pages: Home, About, Faculty (14 profiles with photos),
  Curriculum, Research, Placements, Events, FAQ, Contact.
- SEO: per-page titles/descriptions, `CollegeOrUniversity` + `FAQPage`
  JSON-LD, `sitemap.xml`, `robots.txt`, Open Graph tags.
- WCAG-minded: semantic headings, alt text, keyboard-navigable menu,
  aria attributes on interactive controls.
- Hardened HTTP security headers (CSP, HSTS, etc.) set in `next.config.ts`.

## Development

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # production build (all static)
npm run lint             # eslint (must be clean)
npm run optimize:images  # recompress source photos in public/images
```

## Project structure

```
src/
  app/                      # App Router — one folder per route
    layout.tsx              # root shell: fonts, <Header>, <Footer>, metadata
    page.tsx                # Home — renders the X-Ray experience + JSON-LD
    globals.css             # design system (sketchbook theme) + keyframes
    robots.ts  sitemap.ts   # SEO route handlers
    about|contact|curriculum|events|faculty|faq|placements|research/page.tsx
  components/
    layout/                 # Header, Footer (global chrome)
    xray/                   # homepage scroll experience + its data
    about/  curriculum/  faculty/  faq/  placements/   # per-page client UI
    cinematic/              # shared motion primitives (Counter, Tilt3D, TiltCard)
    futures/                # career-ecosystem data consumed by the X-Ray
  lib/
    data.ts                 # SINGLE SOURCE OF TRUTH — all content/facts
scripts/
  optimize-images.mjs       # one-off photo recompressor (sharp)
public/
  images/  syllabus/        # static assets
```

**To update any content** (stats, faculty, recruiters, curriculum, FAQs),
edit `src/lib/data.ts` — pages read from it, so nothing else needs touching.

## Security

`next.config.ts` sends a strict set of headers on every response:

- **Content-Security-Policy** — `default-src 'self'`; only the Contact-page
  Google Maps embed (`frame-src`) and image/font CDNs are allowed.
  `'unsafe-eval'` is added in **development only** (React's dev runtime needs
  it); production CSP omits it.
- **Strict-Transport-Security**, **X-Frame-Options: DENY**,
  **X-Content-Type-Options: nosniff**, **Referrer-Policy**, **Permissions-Policy**.
- `poweredByHeader: false` removes the `X-Powered-By` fingerprint.

The site has no API routes, forms, cookies, or secrets — attack surface is
limited to static assets. All external links use `rel="noopener noreferrer"`.

## Image optimization

Source photos are resized/recompressed by `npm run optimize:images`
(faculty ≤900px, world backgrounds ≤1600px, mozjpeg). Next/image then serves
AVIF/WebP variants at request time. Re-running the script is safe — files that
wouldn't shrink are skipped.

## Environment variables

None. The site is fully static — there are no API routes, forms, databases,
cookies, or secrets, so no `.env` file is required to build or run it.

## Deploying to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Set the **Root Directory** to `iem-website` (the repo root also holds the
   research dossier, which is not part of the app).
4. Vercel auto-detects Next.js — framework preset, build command
   (`next build`), and output are all detected automatically. Click **Deploy**.

Or with the CLI, from inside `iem-website/`:

```bash
npm i -g vercel
vercel           # follow prompts; `vercel --prod` for production
```

The production URL lives in one place — `siteUrl` in `src/lib/data.ts`, which
feeds `metadataBase`, the sitemap, `robots.txt`, and the JSON-LD. Update it once
when a custom domain replaces the default Vercel URL.

## Content sources

All facts (placement statistics, faculty list, curriculum, research metrics)
are sourced from the research dossier in `../RVCE_IEM_Website_Project/` —
verified against official RVCE pages (June 2026). Each claim traces to
`Sources/Master_Sources_Log.md` there.
