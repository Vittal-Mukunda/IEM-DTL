# Marketing Management (IM345AT) — The Study Text

Five PDFs, one per syllabus unit, rewritten from the source notes into a
professional textbook format in LaTeX.

| File | Unit | Pages | Figures | Tables |
|---|---|---:|---:|---:|
| `unit1.pdf` | I — Introduction to Digital Marketing and Content Marketing | 95 | 22 | 28 |
| `unit2.pdf` | II — Social Media Marketing and Search Engine Optimization | 85 | 13 | 27 |
| `unit3.pdf` | III — Web Analytics, Google Analytics and E-mail Marketing | 65 | 7 | 22 |
| `unit4.pdf` | IV — Web Design and Mobile Marketing | 69 | 7 | 16 |
| `unit5.pdf` | V — Conversion Optimization and Digital Analytics | 61 | 7 | 13 |

Plus a consolidated question bank built from the same sources:

| File | Contents | Pages |
|---|---|---:|
| `MM-QuestionBank.pdf` | All 165 previous-year questions from 13 papers — three SEE and ten CIE — arranged unit-wise with model answers written to each paper's marking scheme | 107 |

## What each volume contains

Identical apparatus in all five, so the layout is learned once:

- Half-title, full title page, colophon
- Preface to the volume
- **How to Use This Study Text** — the panel types and the bracket convention
- **Official syllabus for the whole course** (all five units, verbatim), course
  outcomes and prescribed reference books
- **Assessment scheme** — the CIE and SEE rubrics, verbatim
- Table of contents, list of figures, list of tables
- Numbered chapters, mapped one-to-one onto the unit's syllabus phrases
- **Appendix A — Syllabus-to-Chapter Concordance**: every syllabus phrase against
  the chapter and section that carries it, so coverage can be audited
- **Appendix B — Previous-Year Question Bank** for that unit, with model answers
- **Appendix C — Supplementary Examined Topics** (Volumes 1 and 2 only)
- **Glossary** and **Framework Quick-Reference Sheet**
- Back-of-book **index**

## Conventions

- **Previous-year questions are recorded only as bracketed source tags** —
  `[CIE-I, 3 Apr 2025; SEE, Jun/Jul 2025 — 2 M]` — never as narrative prose.
- The numbered chapters carry the syllabus and nothing else. Material that is
  genuinely examined but sits outside the literal descriptor wording (the product
  life cycle, pricing strategies, segmentation-versus-mix in Unit I; Search
  Everywhere Optimization in Unit II) is placed in a clearly flagged appendix
  rather than silently inserted or silently dropped.
- Where a topic has two taught versions (the customer lifecycle orbit and the
  4 Rs in Unit II), both are given, labelled, and a safe answer recommended.
- Every figure is drawn in TikZ/pgfplots — no imported images.

## Rebuilding

Requires a TeX distribution with the standard CTAN packages (MiKTeX or TeX Live).

```bash
cd tex && pdflatex unit1 && pdflatex unit1 && pdflatex unit1
```

Three passes: the third resolves the table of contents, cross-references and the
index. Repeat for `unit2` … `unit5`.

The question bank is self-contained — it uses only standard CTAN packages and
does **not** need `MMTextbook.cls` — and needs two passes:

```bash
cd tex && pdflatex MM-QuestionBank && pdflatex MM-QuestionBank
```

Its sources are `MM-QuestionBank.tex` (preamble and front matter),
`qb-unit1.tex` … `qb-unit5.tex` (one file per unit) and `qb-appendix.tex`
(the paper-wise concordance).

## Built PDFs are not tracked

`.gitignore` excludes every generated PDF and LaTeX artefact, because all of
them are reproducible from `tex/`. The copies actually served by the site are
tracked separately under
`iem-website/public/notes/sem4/marketing-management/`, so after rebuilding,
copy the output there to publish it — the site links to that path, not to this
folder.

`MMTextbook.cls` holds the whole design. Its visual language is derived from
*The Legrand Orange Book* by Mathias Legrand (LaTeXTemplates.com, CC BY-NC-SA
4.0), re-implemented on standard CTAN packages so the series compiles on an
unmodified TeX installation with no vendored template files.

## Status

Unofficial student-compiled study material. Not issued, endorsed or verified by
the Department of Industrial Engineering and Management or by RV College of
Engineering.
