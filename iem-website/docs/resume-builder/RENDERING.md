# How rendering works

The whole design rests on one decision: **there is exactly one layout pass**.
It produces a box tree, and the preview, the PDF, the LaTeX and the DOCX are all
transcriptions of that same tree. Nothing measures text twice, so nothing can
disagree about where it goes.

```
ResumeDoc  ─┐
            ├─► layoutResume() ─► BoxTree ─┬─► preview.tsx   (SVG in the browser)
Template   ─┘         ▲                    ├─► pdf.ts        (pdf-lib)
                      │                    ├─► latex.ts      (.tex source)
                 FontBook                  └─► docx.ts       (Word)
              (fontkit + real TTFs)
```

---

## Font metrics

`FontBook` loads the actual TTF files the browser will render with, and measures
through fontkit — real advance widths, real kerning, real ligatures. It is the
only thing in the system that knows how wide a string is.

That matters more than it sounds. Tinos reproduces Times New Roman's advance
widths *exactly* (verified glyph by glyph: space 512, `A` 1479, `M` 1821, …), so
the Word-derived templates measure identically to the documents they came from.
When the Harvard sample breaks a line after "social", so do we — and every line
below it stays where the original put it.

**Small caps are synthesised**, not taken from a small-cap face: lowercase
letters are uppercased and set at `smallCapsScale` of the nominal size. We
cannot redistribute a small-cap Computer Modern, and synthesising in the engine
means the preview, the PDF and the DOCX place the boundary identically — which
shipping a real face in only one of the three would not.

## Layout

### Baseline space

Everything is positioned by **baseline**. `page.margin.top` is the first
baseline; `leading` is the distance to the next one; every gap in `spacing` is
baseline-to-baseline. There is no line-box arithmetic anywhere, which is what
lets a number measured off a PDF go straight into a template definition.

### Inline flow

`flowInline` greedily fills lines from a sequence of styled fragments. Greedy is
what Word does, and on résumé prose in a narrow measure it agrees with LaTeX's
paragraph breaker on every fixture we test. Whitespace runs keep their real
width, so a double space after a full stop stays a double space. A token longer
than the whole measure is broken mid-word rather than allowed to overhang — long
URLs, mostly.

### Row layout, in two passes

1. **Pinned** cells (right, centre, or a tab stop) are measured and placed
   first, and take the row's first line only.
2. **Flowing** cells wrap in what is left, then continue at full width.

That one rule reproduces Yale's tab-stop dates, Harvard's right-aligned
locations and Jake's `\hfill` without the engine knowing any of their names.

A **left** tab is clamped so it cannot push text out of its column; a **right**
tab is not, because a right tab *defines* an edge. Harvard's dates sit 2.3pt
past the text column because the Word original puts them there.

### Pagination

Blocks are placed in order. A block marked `keepWithNext` — every section
heading — moves to the next page rather than being stranded at the foot of one.
An entry that does not fit may split, but never within its heading rows
(`atomicLines`) and never leaving a single orphan line behind.

Two-column templates paginate each column independently and merge, which is how
`paracol` behaves. The header spans both, and the sidebar starts below it.

### The overflow cascade

When content exceeds the page limit the engine adjusts in a fixed order, and
stops at the first step that fits:

1. **Fits** → done.
2. **Tighten spacing** within the template's declared `spacingSlack`.
3. **Shrink type** in `fontScale.step` increments, never below the floor.
4. **Still too long** → stop, and say so: *"Content runs about 3 lines past the
   page limit. Trim some text, or allow another page."*

Spacing before type, because a reader notices smaller text long before they
notice a tighter gap. Nothing is ever truncated.

The floor is `rules.minBodySize`, measured against the **smallest** role that
carries reading text — not against `body`. Awesome-CV sets job titles two points
below its body size, and scaling from the larger of the two would take them
under the floor. The floor also clamps the student's own size slider, not just
the automatic cascade.

## The box tree

```ts
interface LayoutResult {
  pages: { width, height, items: LayoutItem[] }[];
  appliedFontScale: number;    // after the cascade
  appliedSpacing: number;
  warnings: LayoutWarning[];   // shown above the preview
  overflowBy: number;          // points past the limit; 0 when it fits
}
```

An item is text (a baseline plus positioned pieces, each carrying its style,
role, colour and any link), a rule, or a shape (proficiency dots, keyword pills,
AltaCV's wheel).

## Why the preview is SVG

SVG `<text>` is positioned by its baseline — the same anchor PDF uses. Absolutely
positioned HTML would need us to guess at line-box behaviour and would drift.

Each run also carries `textLength`, pinning it to the width the engine measured.
So even if the browser's shaper disagreed with fontkit by a fraction of a point,
the run still occupies exactly the space the PDF will give it. The preview is
not an approximation of the download; it is the same geometry, drawn twice.

## Integrity

`checkIntegrity` asserts, on every template × every stress fixture:

- nothing crosses the margin box (or the furthest tab stop the template declares)
- no two lines on a page overlap by more than 30% of the smaller
- reading text stays above the template's floor
- nothing lands off the page

These run in `npm test`. They are the difference between "the layout usually
looks fine" and "the layout cannot break".

## Performance

Layout is pure and synchronous — a full résumé measures in a few milliseconds,
so the preview recomputes on every keystroke with no debounce. Text widths are
memoised per (face, size, string). The overflow cascade is the only expensive
path, and it only runs when content actually overflows.
