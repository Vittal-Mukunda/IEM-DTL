# Adding a template

A template is **data**. Adding one means writing an object and dropping in some
files; it never means editing the engine. An ESLint rule enforces that:
`src/resume/core/**` may not import from `src/resume/templates/**`, so the first
time a template needs engine support, the build tells you.

Budget an afternoon for a template you have a clean PDF of. Most of that time is
measurement, not typing.

---

## 1. Get the original, and get it clean

Put the source PDF at `public/templates/<id>/original.pdf`. If it is one page
out of a careers-guide chapter, extract just that page:

```bash
python -c "import pymupdf; d=pymupdf.open('guide.pdf'); o=pymupdf.open(); o.insert_pdf(d, from_page=5, to_page=5); o.save('public/templates/mine/original.pdf')"
```

Then write `public/templates/<id>/verify.json` describing what on that page
belongs to the résumé:

```json
{
  "page": 1,
  "note": "Why this page, and what else is on it.",
  "includeFontPattern": "Times",
  "maskDrawings": true
}
```

`includeFontPattern` is the reliable way to separate a sample from the guide
around it — annotation callouts are always set in a different family.
`maskDrawings` white-outs vector art, which is right when the résumé itself
draws no rules and wrong when it does.

## 2. Measure it

```bash
python scripts/forensics.py public/templates/mine/original.pdf 1
```

You get one row per line: the baseline, the gap to the previous baseline, and
every run's font, size, colour and x range. That is exactly the shape of a
template definition, so you can read the two side by side.

For a sample printed at reduced size, pass `--scale`. Recover the factor from a
known quantity — the content column of a résumé is almost always 6.5in or 7.5in:

```bash
python scripts/forensics.py original.pdf 1 --scale 0.7028
```

Two measurements deserve care:

**The first baseline.** `page.margin.top` is the y of the first baseline, not
the top of the first line box. Read it straight off the forensics.

**The right edge.** Trailing spaces and tab stops make it unreliable to read
directly. Solve it from the line breaks instead: the content width is the only
value for which every observed break is consistent. For Harvard that pinned it
to a 0.07pt window (540.68–540.75), and the obvious 540.0 was wrong.

For a Word original, read the OOXML rather than the render — it is exact:

```bash
unzip -o template.docx -d /tmp/docx && grep -o '<w:sectPr.*</w:sectPr>' /tmp/docx/word/document.xml
```

## 3. Write the definition

Copy the closest existing template and change the numbers. The shape:

```ts
export const mine: TemplateDefinition = {
  id: "mine",
  name: "My Template",
  version: "1.0.0",
  origin: "word",              // or "latex"
  meta: { description, source, thumbnail, original, tags, engine },
  page: { size, margin, columns?, gutter? },
  typography: { families, base, roles },
  palette: { ink, accent, rule, ... },
  conventions: { dateDash },
  sections: { available, defaultOrder, aliases, titleCase, sideKinds? },
  blocks: { header, sectionTitle, entry, "entry.<kind>"?, ... },
  spacing: { sectionBefore, sectionAfter, entryGap, bulletGap, headerAfter },
  rules: { fontScale, lineSpacing, spacingSlack, allowColor, minBodySize },
  emit: { latex, docx },
};
```

### Everything is baseline-to-baseline

`leading` is the distance to the **next** baseline, and every gap in `spacing`
is measured the same way. So a number from the forensics goes straight into the
definition with no ascent arithmetic in between. If the original shows

```
y= 113.10          Southwestern University
y= 126.60 + 13.50  Bachelor of Arts in Computer Science
```

then `entryTitle.leading` is 13.5. That is the whole rule.

### Rows and cells

A row is a line. Cells are laid out in two passes, because that is what Word and
LaTeX actually do:

1. **Pinned** cells — `align: "right"`, `"center"` or `{ tab }` — are measured
   and placed first, and occupy the row's first line only.
2. **Flowing** cells wrap in whatever space is left, and continue onto further
   lines at full width.

```ts
{
  cells: [
    { bind: "organization", role: "entryTitle" },
    { bind: "location",     role: "entryMeta", align: "right" },
  ],
}
```

`repeat: "bullets" | "tags" | "links"` emits one row per item, or one line for
all of them with `inline: true`.

### Bindings

Entry slots `organization` `position` `location` `summary` `detail` `url`
`rating`; computed `dateRange` and `tags`; document-level `personal.name`
`personal.headline` `section.title` `section.text`; and inside a repeat, `$item`
plus `$link.label` / `$link.icon`.

### The four block keys that matter

`entry` is the fallback. `entry.education`, `entry.projects` and so on override
it per section kind; `entry.labeled`, `entry.tags`, `entry.ratings` and
`entry.paragraph` override it per section *layout*. Lookup order is kind, then
layout, then `entry`.

## 4. Register it

```ts
// src/resume/templates/index.ts
import { mine } from "./mine/template";
const registry = { ..., mine };
export const templateOrder = [..., "mine"];
```

This file is the only place in the application where a template id appears.

## 5. Verify

```bash
npm run verify:templates
```

Read `docs/resume-builder/verification_report.md`. The **registration** line
tells you whether the comparison is fair: scale near 1.0 and a plausible offset
means the two are aligned, and everything after it is a real measurement. Then
read the worst residuals — they name the exact words that are misplaced and by
how much, which usually points straight at the wrong number.

Vertical residuals that grow down the page mean a `leading` or a `spacing` value
is off. A constant horizontal offset on one kind of row means a tab or an indent
is off. A single line that drifts within itself means the wrong face or size.

To score against the original you also need a replication fixture: a transcript
of the sample as a `ResumeDoc`, at `src/resume/fixtures/<id>-original.ts`,
registered in `fixtures/index.ts`. Without one the template still runs the whole
stress matrix — it just has nothing to be scored against.

## 6. Add the thumbnail

```bash
npm run resume:thumbs
```

Renders every template's `typical` fixture to `public/templates/<id>/thumb.png`.
The same résumé in every template, so the picker compares layouts rather than
invented content.

## 7. Check the tests

```bash
npm test
```

The matrix picks the new template up automatically: ten stress fixtures, the
invariant checks, determinism, and all three exports.

One of those tests is worth knowing about. The builder opens on a complete
example résumé (`src/resume/exampleResume.ts`), and the test asserts it fits
**one page in every template, at full size, with no warnings** — because that is
the first thing every student sees. If a new template is tighter than the others,
that test is where you will find out.

The example is built from the template's own `sections.defaultOrder`, so a
template only gets the sections it wants. Content exists for `summary`,
`education`, `experience`, `projects`, `leadership`, `research`, `awards`,
`skills` and `interests`; a kind outside that list opens with one blank entry.

---

## Fonts

If the template needs a face we do not already ship:

1. Add it to `googleFonts` or `directFonts` in `scripts/fetch-resume-fonts.mjs`,
   with its licence in the `licences` map. **Only OFL, Apache 2.0 or an
   equivalent redistributable licence** — this is a public university site.
2. `npm run fonts:resume` downloads to `public/fonts/resume/_source/`
   (gitignored) and writes a Latin subset to `public/fonts/resume/` (committed).
3. Declare it in the template's `typography.families`. If it stands in for a
   font we cannot ship, say so:

```ts
substitutes: { original: "Avenir LT Std", fidelity: "visual" }
```

`metric` means the advance widths are identical, so the layout is unchanged.
`visual` means it only looks similar. The verifier reports every substitution,
and the builder shows it under the preview, because a student comparing our
output to a sample they found online deserves to know which it is.

## Two-column templates

Declare `page.columns`, then `sections.sideKinds` for the kinds that default to
the sidebar. A student can still move any section with `section.column`. The
header always spans the full content width, and the sidebar starts below it.

## Gutter templates

`page.gutter` puts either the section title (MIT) or each entry's dates
(Stanford) in a column beside the content:

```ts
gutter: { width: 65, gap: 5.9, carries: "sectionTitle", align: "left" }
```

With `carries: "entryDates"` the engine synthesises the date block itself, so
the entry's rows should not also print `dateRange`.
