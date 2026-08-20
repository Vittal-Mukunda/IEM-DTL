# Resume Builder — Architecture Proposal

**Status:** built and shipping at `/resources/resume-builder`.

This began as a proposal; the analysis and the decisions are preserved as
written, and §12 records where reality disagreed with the plan.

**See also** — [ADDING-A-TEMPLATE.md](ADDING-A-TEMPLATE.md) ·
[RENDERING.md](RENDERING.md) · [EXPORTS.md](EXPORTS.md) ·
[DEPLOY.md](DEPLOY.md) · [verification_report.md](verification_report.md)

---

## 1. What is already here

I audited the repository before designing anything. Findings:

| Question | Answer |
|---|---|
| Framework | **Next.js 16.2.9** (App Router) + React 19.2.4 + TypeScript 5 |
| Styling | **Tailwind CSS 4** (`@theme inline`, tokens in `src/app/globals.css`) |
| Runtime | **Fully static.** Zero API routes, zero middleware, zero server code |
| Database | **None, and none provisioned.** No env vars, no ORM, no connection strings |
| Deployment | **Vercel**, root directory `iem-website`, framework auto-detected |
| Relevant page | `src/app/resources/page.tsx` — the Resource Portal, already hosts `GPACalculator` as a client island |
| Useful existing dep | **`pdfjs-dist` 4.10.38** already installed (newsletter reader) — reusable for the PDF→raster verification pipeline |
| Fonts | `next/font/google` self-hosts Source Serif 4, **Source Sans 3**, IBM Plex Mono |
| Security posture | Strict CSP in `next.config.ts`: `default-src 'self'`, `connect-src 'self'`, `worker-src 'self' blob:`, `object-src 'none'` |
| Content convention | `src/lib/data.ts` is the single source of truth; pages read from it |

Two consequences that shape everything below:

1. **There is no backend and no database, by design.** The README states the site's attack surface is deliberately limited to static assets. Introducing a server + DB to hold student résumé data would be the single largest change to this project's security profile — and it is not needed.
2. **`GPACalculator` is the precedent**: a self-contained client component mounted inside a statically-prerendered route. The Resume Builder follows the same pattern, one level deeper.

---

## 2. Template forensics

All eight source documents were parsed with PyMuPDF (glyph-level spans: font, size, colour, x/y bounding boxes) and, for the Word file, by unzipping the OOXML and reading `sectPr` / `pPr` / `rPr` directly. Summary of what was measured:

| # | Template | Origin | Page | Margins | Body face / size | Section heading | Entry layout |
|---|---|---|---|---|---|---|---|
| 1 | **Harvard** (OCS sample) | Word | Letter 612×792 | 0.5in L/R | Times New Roman 11pt | **bold, centred**, no rule | Org **bold** left / Location right; degree-or-title left / dates right; description as full-width **paragraphs, not bullets** |
| 2 | **Yale College** (general template v2) | Word `.docx` | Letter, `pgMar` 720 twips = **0.5in all round** | 0.5in | Times New Roman 11pt (`sz=22`) | bold **small-caps** + **0.75pt bottom border**, full width | `**Employer,** *Title*, City, State` → right tab at **10800 twips (7.5in)** for dates; bullets via `numId=5` |
| 3 | **Stanford** (chronological sample) | Word | Letter | ~0.75in | Times-family serif | **small caps** + full-width rule | **Left date gutter (~1.1in)** + content column; `•` bullets |
| 4 | **MIT** (undergraduate sample) | Word | A4 595×842 | ~0.6in | Times-family serif | **left label column** (~0.9in), bold | Org **BOLD CAPS** left / LOCATION right; title bold left / *dates italic* right; `•` bullets |
| 5 | **Columbia** (CCE sample) | Word | Letter (embedded at ≈0.71 scale in the annotated guide) | ~0.5in | Libre Franklin + Avenir ≈10pt | **BOLD ALL-CAPS with trailing colon**, left | Org **bold**, Location; date right; *title italic*; `•` bullets |
| 6 | **Jake's Resume** | **LaTeX** | Letter | **exactly 0.5in L/R** (rules run x=36→576pt) | Computer Modern, `[letterpaper,11pt]{article}` | `\large\scshape` 11.96pt + `\titlerule` 0.398pt | `\resumeSubheading`: bold 10.91 left / roman right, *italic 9.96* left / *italic* right; bullets at x=61.5, text at x=70.8 |
| 7 | **Awesome-CV** (posquit0) | **LaTeX** (XeLaTeX) | A4 | 0.551in (1.4cm) L/R | Source Sans Pro Light 8.97pt | Roboto/SSP bold **15.94pt**, first 3 glyphs in accent red, + full-width rule | Org bold 9.96 / *location italic accent* right; small-caps title / *dates italic* right; footer = date · name · page |
| 8 | **AltaCV** (Lim) | **LaTeX** (XeLaTeX + TikZ) | A4 | 0.49in L, 0.64in R | Lato 9.96pt | **Roboto Slab Bold 17.22pt** + gold accent rule | **Two-column** (main + sidebar); TikZ widgets: wheel chart, rating dots, tag pills, FA5 icons |

**Font substitutions required** (all metric-compatible or visually equivalent, all OFL/Apache-licensed):

| Original | Substitute | Licence | Note |
|---|---|---|---|
| Times New Roman | **Tinos** | Apache 2.0 | metric-compatible |
| Calibri | **Carlito** | OFL | metric-compatible |
| Avenir (Columbia) | **Nunito Sans** | OFL | *visual* match only — flagged in report |
| Computer Modern | **Latin Modern Roman** | GUST FL | the OpenType CM |
| Lato, Source Sans 3, Roboto, Roboto Slab, Libre Franklin, Font Awesome Free | — | OFL / Apache 2.0 | ship as-is |

The `Avenir → Nunito Sans` substitution is the one place pixel-perfection is genuinely impossible; the verification report will surface it as a warning rather than pretend otherwise.

---

## 3. The one hard constraint: LaTeX cannot run on Vercel

The brief says *"PDF must be generated from the final LaTeX output."* This is worth stating plainly:

- Vercel serverless functions cap at **250 MB unzipped**. TeX Live `scheme-basic` alone is ~350 MB; the packages these eight templates need (`fontspec`, `tikz`, `fontawesome5`, plus the OTF families) push well past that.
- There is no `apt-get`, no persistent filesystem, and no Docker escape hatch on Vercel's Node/Python runtimes.

So there are three honest options.

### Option A — WASM LaTeX in the browser
Ship SwiftLaTeX's `XeTeXEngine` (WASM) plus a curated, self-hosted TeX Live subset in `public/texlive/`.
*Real `pdflatex`/`xelatex` output.* Costs ~40–70 MB of vendored TeX assets in the repo, 3–8 s cold compile, needs `'wasm-unsafe-eval'` added to the CSP, and depends on an unmaintained upstream.

### Option B — Layout engine as source of truth *(recommended)*
A small typesetting core in TypeScript computes a **positioned box tree** from `(resume data × template definition)`. That one box tree is then rendered four ways — DOM preview, PDF, `.tex`, `.docx`. The preview and the PDF transcribe it directly; the reflowing formats walk the same definitions and are handed the fit the box tree settled on, so all four describe the same page. See [EXPORTS](EXPORTS.md#docx).
Instant preview, instant export, ~200 KB of JS, no CSP change, no cold start, works offline.
The `.tex` is genuinely first-class and clean; it is simply not what produced the downloaded PDF.

### Option C — **B at runtime, A in CI** *(what I actually recommend)*
Students get Option B's instant path. Separately, a **GitHub Action with a real TeX Live install** compiles every emitted `.tex` for every template × fixture, rasterises it, and diffs it against (a) the engine's own PDF and (b) the original template PDF. Any drift fails the build.

That is *stronger* than compiling in the browser: it proves the `.tex` and the PDF agree, on every commit, with real LaTeX — instead of hoping a WASM build behaves like the real thing. And because the `.tex` emitter already exists, Option A can be bolted on later as a lazy-loaded "Compile with real LaTeX (beta)" button without touching the core.

**Recommendation: Option C.** Documented as an explicit, deliberate deviation from the literal wording of the brief.

---

## 4. Proposed architecture

```
┌─────────────────────── browser (no server, no DB) ───────────────────────┐
│                                                                          │
│   ┌──────────────┐        ┌────────────────────────────────────────┐     │
│   │ Editor UI    │ data   │  @resume/core   (pure, framework-free) │     │
│   │ (React)      ├───────►│                                        │     │
│   │              │        │  ResumeDoc ─┐                          │     │
│   │ • forms      │        │             ├─► LayoutEngine ─► BoxTree│     │
│   │ • dnd-kit    │◄───────┤  Template  ─┘        ▲                 │     │
│   │ • controls   │ boxes  │                      │                 │     │
│   └──────────────┘        │              FontMetrics (fontkit)     │     │
│          │                └────────────────┬───────────────────────┘     │
│          │                                 │  one BoxTree, four sinks    │
│          ▼                    ┌────────────┼────────────┬──────────┐     │
│   ┌─────────────┐             ▼            ▼            ▼          ▼     │
│   │ localStorage│        DOM/SVG        pdf-lib     .tex emit   docx     │
│   │  autosave   │        preview        (PDF)      (LaTeX)     (DOCX)    │
│   └─────────────┘            │             │            │          │     │
│                              └──── identical geometry ──┴──────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                                       │
                   ┌───────────────────┴───────────────────┐
                   │  CI only (GitHub Actions, real TeX)   │
                   │  .tex → pdflatex/xelatex → PNG        │
                   │  diff vs engine PDF + original sample │
                   │  → verification_report.md             │
                   └───────────────────────────────────────┘
```

### The central idea

**The live preview is not CSS reflow.** It is a DOM rendering of the *same absolutely-positioned box tree* that the PDF exporter consumes. Line breaking, tab alignment and page breaking are all done once, by our engine, using real font metrics read from the TTF/OTF via `fontkit`.

This is what makes "what you see is what you download" true rather than approximately true — and it is what makes pixel-diffing meaningful.

### Storage decision: **no database**

- Résumé data lives in **`localStorage`** (debounced autosave) — student PII never leaves the browser, which preserves the site's current "no cookies, no forms, no secrets" posture.
- **Export/import a `.json`** file for backup or moving between machines.
- Optional later: share-by-URL via a compressed hash fragment (still no server).

A database would add cost, GDPR/PII obligations, and an auth question the brief explicitly rules out. It buys nothing here.

---

## 5. Template definition schema

Templates are **data, not code**. The engine interprets a declarative box model; nothing about Harvard or AltaCV is special-cased in `@resume/core`.

```ts
export interface TemplateDefinition {
  id: 'harvard' | 'yale' | string;
  name: string;
  version: string;
  origin: 'word' | 'latex';

  meta: {
    description: string;
    source: string;          // provenance of the original
    thumbnail: string;       // /templates/<id>/thumb.png
    tags: string[];          // 'ats-friendly' | 'one-page' | 'academic' | ...
    engine: 'pdflatex' | 'xelatex';
  };

  page: {
    size: 'letter' | 'a4' | { w: number; h: number };   // pt
    margin: { top: number; right: number; bottom: number; left: number };
    columns?: ColumnSpec[];  // AltaCV: [{ id:'main', width:0.62 }, { id:'side', width:0.34 }]
  };

  typography: {
    families: FontFamilySpec[];       // file, weights, styles, substitutionOf?
    base: { family: string; size: number; leading: number };
    roles: Record<TextRole, TextStyle>;   // name | contact | sectionTitle | entryTitle | …
  };

  palette: Record<string, string>;    // accent, rule, muted …

  sections: {
    available: SectionKind[];         // what this template supports
    defaultOrder: SectionKind[];
    aliases?: Record<SectionKind, string>;  // 'experience' → 'PROFESSIONAL EXPERIENCE'
  };

  blocks: Record<BlockKind, BlockLayout>;   // ← the actual geometry
  spacing: { sectionBefore: number; sectionAfter: number; entryGap: number; bulletGap: number };
  rules: {
    fontScale: { min: 0.9; max: 1.1; step: 0.02 };
    allowBold: boolean; allowItalic: boolean; allowColor: 'none'|'accent'|'free';
    overflow: OverflowPolicy;
  };

  emit: {
    latex: { preamble: string; macros: Record<BlockKind, string> };
    docx:  { styles: DocxStyleMap; numbering: DocxNumbering };
  };
}
```

A `BlockLayout` is a small tree of rows, each row a list of **cells** with `align: left | right | tab(x)`, a text role, and a field binding:

```ts
// Yale: "**Employer,** *Title*, City, State →tab(7.5in) Dates"
{
  kind: 'experienceEntry',
  rows: [
    { cells: [
        { bind: 'organization', role: 'entryTitle', weight: 'bold', suffix: ', ' },
        { bind: 'position',     role: 'entryTitle', style: 'italic', suffix: ', ' },
        { bind: 'location',     role: 'entryTitle' },
        { bind: 'dateRange',    role: 'entryMeta', align: { tab: 540 } },
    ]},
    { repeat: 'bullets', cells: [{ bind: '$item', role: 'body', marker: 'bullet' }] },
  ],
}
```

### Adding template #9 → #100

1. Drop `public/templates/<id>/` — `thumb.png`, `original.pdf`, any fonts.
2. Write `src/resume/templates/<id>/template.json` + `preamble.tex`.
3. Add a fixture set under `fixtures/`.
4. `npm run verify:templates` → reads `verification_report.md`.

No changes to the engine, editor, or exporters. That is the extensibility test, and it is enforced by an ESLint boundary rule: `@resume/core` may not import from `templates/*`.

---

## 6. Overflow & integrity policy

Students can nudge font size, bold, italic and colour — but the template must not break. The engine enforces a cascade, in order, stopping as soon as the content fits:

1. **Fits** → done.
2. Tighten `entryGap` / `sectionAfter` within each template's declared slack (typically ±15%).
3. Scale font by `-0.02` steps down to `rules.fontScale.min` (never below 0.9× — legibility floor).
4. Reflow to the next page at a legal break point (never inside an entry heading, never orphaning a bullet).
5. If still overflowing → **stop shrinking** and show a non-blocking banner: *"Content exceeds 1 page — 3 bullets over. Trim, or allow a 2nd page."*

Hard invariants, checked by the engine on every layout pass and asserted in tests:
- no box may cross the margin box
- no two boxes on a page may overlap
- effective font size ≥ 9pt for body text
- colour choices are constrained to the template palette unless `allowColor: 'free'`

---

## 7. Verification system

`npm run verify:templates` (Node + CI):

```
fixtures/<case>.json ──► engine ──► generated.pdf ──┐
                            │                       ├─► pdfjs raster @300dpi ─► pixelmatch
                            └──► generated.tex ─────┤                             │
                                    │ (CI: real TeX)│                             ▼
                                    └──► latex.pdf ─┘                    verification_report.md
public/templates/<id>/original.pdf ─────────────────┘
```

Three diffs per template:
- **generated.pdf vs original.pdf** — replication accuracy (the headline number)
- **generated.pdf vs latex.pdf** — proves the `.tex` export is faithful (CI only, real TeX Live)
- **text-run comparison** — every glyph's `(text, x, y, size, font)` compared with tolerance, so we can say *"2px heading spacing difference"* instead of just a percentage

Report format, per the brief:

```markdown
### Harvard Resume
Accuracy: 98.7%  (pixel) · 99.4% (text placement)
Differences:
- §Education heading baseline 2.1px low
- Font substitution: Times New Roman → Tinos (metric-compatible)
```

Thresholds are per-template and committed, so a regression fails CI.

---

## 8. Test matrix

Vitest + a headless layout harness (no browser needed — the engine is pure).

For **every template** × these cases: empty résumé · maximum content (3 pages) · a 400-char project description · every optional section missing · every optional section present · font scale at min and max · sections reordered · unicode/accents · very long single words (URL overflow) · no bullets at all.

Assertions per case: no overlap · nothing outside margins · font ≥ floor · section order respected · `.tex` compiles (CI) · `.docx` opens and round-trips through a validator.

---

## 9. File layout

```
iem-website/
  src/
    app/resources/resume-builder/
      page.tsx                      # static shell + metadata
      builder-client.tsx            # 'use client' island
    resume/
      core/                         # ← framework-free, no React, no template names
        model.ts                    # ResumeDoc types
        schema.ts                   # TemplateDefinition types + zod validation
        fonts.ts                    # fontkit metrics, subsetting, substitution table
        layout/                     # line breaking, tabs, columns, pagination
        render/
          preview.tsx  pdf.ts  latex.ts  docx.ts
        integrity.ts                # overflow cascade + invariant checks
      templates/
        index.ts                    # registry — the ONLY place a template id appears
        harvard/ yale/ stanford/ mit/ columbia/ jakes/ awesome-cv/ altacv/
      editor/                       # React: forms, dnd-kit, controls, preview pane
  public/
    templates/<id>/{thumb.png,original.pdf}
    fonts/resume/*.ttf              # subsetted, self-hosted
  scripts/
    verify-templates.mjs
  docs/resume-builder/
    ARCHITECTURE.md  ADDING-A-TEMPLATE.md  RENDERING.md  EXPORTS.md  DEPLOY.md
    verification_report.md          # generated
```

### New dependencies

| Package | Why | Size |
|---|---|---|
| `pdf-lib` + `@pdf-lib/fontkit` | PDF generation with embedded subset fonts | ~180 KB |
| `docx` | DOCX generation | ~120 KB |
| `fontkit` | font metrics for the layout engine | ~90 KB |
| `@dnd-kit/core` + `/sortable` | section drag-and-drop (React 19 ready) | ~40 KB |
| `zod` | validates template JSON at build time | ~60 KB |
| `pixelmatch`, `pngjs` | **devDependency** — verification only | — |

All lazy-loaded on the builder route; the other nine pages are unaffected.

### Config changes

- `next.config.ts` — add a cache header for `/templates/:path*` and `/fonts/:path*`. **No CSP change required** (preview is DOM, exports are `blob:` downloads).
- `sitemap.ts` — add the new route.
- `src/app/resources/page.tsx` — add a Resume Builder card.

---

## 10. Delivery phases

| Phase | Deliverable | Gate |
|---|---|---|
| 0 | Schema, types, font pipeline, registry, ESLint boundary | types compile, zod validates a stub template |
| 1 | Layout engine + DOM preview + **Harvard** template | Harvard ≥ 97% pixel match vs original |
| 2 | PDF + TEX + DOCX exporters | all three byte-stable across runs; `.tex` compiles in CI |
| 3 | Editor UI — forms, live preview, drag-and-drop, formatting controls | full workflow usable end-to-end |
| 4 | Remaining seven templates | each ≥ 96% vs original, or a documented reason |
| 5 | Verification harness + full test matrix + docs | CI green, `verification_report.md` committed |

---

## 11. Decisions taken

All four were confirmed before implementation:

1. **PDF strategy** — Option C. Layout engine at runtime, real LaTeX in CI.
2. **AltaCV's widgets** — replicated as SVG. Proficiency dots and keyword pills
   are drawn as vectors in all three outputs; the wheel chart has a renderer but
   no template currently emits one.
3. **Canonical samples** — MIT p6 and Stanford p4, as proposed.
4. **Page size** — a per-template Letter/A4 toggle, defaulting to native.

---

## 12. What changed during implementation

Five things the plan got wrong, and what the code does instead.

**Positioning is baseline-based, not line-box based.** The first version tracked
line tops and derived baselines from ascents, which meant every measured number
had to be converted before it could be used — and Jake's 24.79pt name, whose
leading is smaller than its own ascent, printed straight through the contact
line. Working in baseline space throughout means a number read off a PDF goes
into a template definition unchanged. This is the single most useful decision in
the codebase.

**pdf-lib's subsetter cannot be used.** It drops most glyphs from these fonts:
the PDF extracts the right text, so every structural check passes, but only
about a third of the ink renders. fontkit v2 subsets correctly but emits no
`cmap`, which pdf-lib then cannot lay out. The fonts are therefore pre-subset to
a Latin charset with fontTools at maintenance time and embedded whole. Caught by
the pixel comparison, which is precisely what it is for.

**The verifier fits x and y independently.** A single shared scale was actively
misleading: a small systematic error in the leadings pulled the fit off 1.0,
which then displaced every x by two points and reported a horizontal problem
that did not exist.

**Guide chrome is masked by derivation, not by hand.** Hand-picked rectangles
were tried first and quietly ate the candidate's name along with the callout
beside it. The masks now come from the font of each span and from the page's
vector drawings, because a verifier that can be fooled by its own configuration
is not a verifier.

**The Word originals are not as tidy as they look.** Harvard's content width is
540.7pt, not the obvious 540.0 — solved from its line breaks, which pin it to a
0.07pt window. Its dates sit on a tab stop 2.3pt past the text column. Jake's
entry headings live in a 0.97-textwidth tabular, so they stop 5.4pt short of the
margin. Every one of these is in the template as a commented measurement,
because the next person to read the file will otherwise assume it is a mistake.

### Where it landed

| | |
| --- | --- |
| Templates | 8, all rendering PDF / TEX / DOCX |
| Replication accuracy | Harvard **94.3%**, Jake's **94.0%** text placement; 0.8 / 0.6pt RMS |
| Ink overlap | Harvard 84.4%, Jake's 98.8% |
| Tests | 346, covering every template × 10 stress fixtures |
| Route | static; no API route, no database, no environment variable |
| CSP | unchanged |

The residual difference on both scored templates is attributable to specific
quirks of the source documents — a date set at 10.5pt in an otherwise 11pt
sample, trailing spaces past a tab stop — and is itemised in the verification
report rather than averaged away.

Six templates do not yet have a replication fixture: a transcription of their
original sample to score against. They are exercised by the full stress matrix
and the invariant checks; what they lack is a number. That is transcription
work, not engineering work.
