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
npm run optimize:pdfs    # downsample page scans in public/notes (run on new notes)
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
  optimize_pdfs.py          # page-scan downsampler for the course PDFs
public/
  images/  syllabus/        # static assets
  notes/                    # course material, one folder per semester
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

## Adding notes

Drop the PDF under `public/notes/<sem>/<subject>/`, register it in
`src/lib/data.ts`, then **run `npm run optimize:pdfs` before committing**.

The script does two passes. Scans (scanners hand back 240–700 dpi, two to
three times what a page needs on screen) have their page images resized to
150 dpi. Digital PDFs — typeset notes, slides, merged question papers — get a
lossless repack: embedded fonts are cut to the glyphs actually used and the
object tables are compressed. The repack renders every page before and after
and throws the rewrite away if any page changed, so it can only make a file
smaller, never different. Re-running is safe: anything already done is skipped.

## Hosting budget (Vercel Hobby)

The site is fully static, so the Hobby limits that matter are:

| Limit | Hobby allowance | What drives it here |
| --- | --- | --- |
| Deployment Storage | 10 GB per team | Every deployment Vercel keeps stores its own full copy of `public/` (~220 MB) |
| Fast Data Transfer | 100 GB / month | Students opening and downloading notes |
| Image Optimization | 5,000 transformations / month | `next/image` variants of the photos |

Deployment Storage is the one that fills: thirty-odd pushes a month × ~220 MB
each. Three things keep it down:

- **`vercel.json` → `scripts/vercel-ignore-build.sh`** cancels preview
  deployments and production pushes that change nothing under `iem-website/`.
  A cancelled deployment stores nothing. To force one, use **Redeploy** and
  untick *Use project's Ignore Build Step*.
- **Batch your pushes.** Vercel deploys only the newest commit of each push,
  so ten commits pushed together cost one deployment, not ten.
- **Retention policy** (dashboard, not code): Project → Settings → Security →
  Deployment Retention Policy. Set Production and Pre-Production to the
  shortest option. Hobby always keeps the 3 newest production deployments
  regardless, so rollback still works.

Edge caching is set in `next.config.ts`: `/notes`, `/syllabus` and
`/newsletters` carry `s-maxage` of a year so the CDN keeps each file instead of
re-fetching it daily.

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
