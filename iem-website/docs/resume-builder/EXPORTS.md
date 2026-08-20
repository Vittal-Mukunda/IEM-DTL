# How exports work

Three formats, all produced in the browser. Nothing is uploaded and no server is
involved, so a student's address and marks never leave their machine.

| Format | Built from | Library | Typical size |
| --- | --- | --- | --- |
| **PDF** | the box tree | `pdf-lib` | 60–220 kB |
| **TEX** | the résumé + the template's macros | none | 3–8 kB |
| **DOCX** | the résumé + the template's blocks | `docx` | 8–15 kB |

Each exporter is lazy-loaded when its button is first pressed, so the builder's
initial payload carries none of them.

---

## PDF

A transcription, not a second layout pass. Every x and y already exists in the
box tree; the writer converts the origin (top-left to bottom-left) and hands
pdf-lib the glyphs. It also emits link annotations for contact details, draws
rules as filled rectangles, and draws proficiency dots and pills as vectors.

Fonts are embedded whole, with `subset: false`, and that is deliberate:

- The shipped faces are **already** cut to a Latin charset by
  `scripts/subset_fonts.py`, so "whole" is 30–180 kB, not 500.
- pdf-lib's own subsetter **silently drops most glyphs** from these fonts. The
  PDF still extracts the right text, so it looks fine to a script — but only
  about a third of the ink renders. It was caught by the pixel comparison, which
  is the kind of bug that otherwise reaches a student's printer.

Letter-spaced runs are drawn one glyph at a time, because pdf-lib has no
letter-spacing. Only headings use tracking, so the cost is nil and the result
matches the measured advances exactly.

## TEX

Clean, editable LaTeX that a student can take to Overleaf. Each template ships
its own preamble and a set of `{{slot}}` macro strings; the emitter fills them
in and knows nothing about any particular template.

```ts
entry: {
  default: "\\resumeSubheading{ {{organization}} }{ {{dateRange}} }{ {{position}} }{ {{location}} }\n{{bullets}}",
  education: "...",
  labeled: "...",
}
```

Placeholders are the entry slots, plus `{{dateRange}}`, `{{tags}}`,
`{{bullets}}` (expanded via `profile.bullet`), `{{name}}`, `{{contact}}`,
`{{title}}`, `{{entries}}`, `{{header}}` and `{{body}}`. A line left holding
nothing but whitespace is dropped, so an entry without a location does not leave
a blank line behind.

Student text is escaped: `& % $ # _ { } ~ ^` plus curly quotes, en and em
dashes, bullets and ellipses. A test feeds `R&D 100% #1 $$ _x^2 {braces}`
through every template and checks the output, and another counts braces to make
sure they balance.

Templates whose original is a real LaTeX class emit against that class —
Awesome-CV against `awesome-cv.cls`, AltaCV against `altacv.cls`, Jake's against
plain `article` with its own macros. The header comment says which engine to
compile with.

**Two of the eight need their class file.** Awesome-CV and AltaCV are
distributed as `.cls` files we do not redistribute; the emitted `.tex` names the
repository to get them from. Overleaf has both as gallery templates, so in
practice a student uploads the `.tex` into the gallery template and it compiles.

## DOCX

The one exporter that does **not** read the box tree — and that is the right
call. A Word document reflows, so absolute coordinates would be exactly the
wrong thing to give it. Instead the emitter walks the same template block
definitions the layout engine walks, and translates each construct:

| Construct | Word equivalent |
| --- | --- |
| right-aligned cell | right tab stop at the content width |
| `{ tab }` cell | tab stop at that position |
| marker row | bullet character with a hanging indent |
| block rule | paragraph bottom border |
| `leading` | exact line spacing, in twips |
| small caps / all caps | `w:smallCaps` / `w:caps` |
| tracking | `w:spacing` character spacing |

The result opens with real, editable styles rather than a picture of a résumé —
a student can keep working on it, and a recruiter's parser can read it.

`docx.font` names the font Word should **ask for** — "Times New Roman", not our
substitute "Tinos" — because the reader's machine probably has the real one.
`fontFallback` covers the case where it does not.

## Filenames

`ananya-krishnamurthy.pdf`, from the name field, slugified. An unnamed résumé
downloads as `resume.pdf`.

## Saving and loading

*Save a copy* writes the résumé as JSON; *Load a saved copy* reads one back.
That is the backup story, and the way to move between machines, given there is
no account. The format is versioned and migrated on read, so a file saved today
still opens after the schema changes.

## What is not exported

No PNG or JPEG. A résumé should be sent as a PDF — an image is unreadable to
every applicant tracking system, and sending one costs a student interviews.
