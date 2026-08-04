# Universal Human Values (HS248AT) — Previous-Year Question Bank

Every recorded past paper for HS248AT, retypeset from scans into a single
LaTeX document. **59 questions from 5 papers**, 21 pages.

| File | Contents | Pages |
|---|---|---:|
| `tex/UHV-QuestionBank.tex` | The whole book — self-contained, no custom class | 21 |

The published copy lives at
`iem-website/public/notes/sem4/universal-human-values/previous-year-question-papers-2024-2026.pdf`
and is linked from the Resources page.

## The papers

| # | Assessment | Date | Max marks | Duration | Questions |
|---|---|---|---:|---|---:|
| 1 | Improvement CIE — Quiz and Test | 28 August 2024 | 25 | 60 min | 10 |
| 2 | CIE-II — Quiz and Test | 7 May 2025 | 25 + 5 | 60 min | 10 |
| 3 | Improvement CIE — Quiz and Test | June 2025 | 30 | 60 min | 9 |
| 4 | **Semester End Examination** — Regular/Supplementary | June/July 2025 | 50 | 2 hours | 20 |
| 5 | Improvement CIE — Quiz and Test | 18 June 2026 | 05 + 25 | 10 + 60 min | 10 |

Paper 3 was set by the Department of Mechanical Engineering; the rest carry no
department on their header. Paper 4 is the only SEE and the only paper with
internal choice.

## How it is arranged

Questions are printed **paper by paper, in chronological order**, not merged
under topic headings — a paper's shape (how many marks Part A carries, what
choices Part B offers) is itself worth revising and is lost when questions are
shuffled. Each chapter opens with a metadata panel carrying the date,
assessment type, duration, maximum marks and structure, plus the printed
instructions and marks-distribution footer where the paper had them.

Two appendices put back what chronology leaves out:

- **Appendix A — Question Index by Theme.** All 59 questions regrouped under
  five themes, so everything ever asked on the four orders, or on trust and
  respect, reads together.
- **Appendix B — Questions Set More Than Once.** The six topics that have been
  examined on two or three papers, with every occurrence, mark value and
  Bloom's level.

Every question carries the three codes its paper printed beside it: **M**
(marks), **CO** (course outcome, code only — the full statements are in the
course handout and are not reproduced), and **BT** (Bloom's level, L1–L4 on
these papers).

## Conventions

- **Transcribed as printed.** Spelling is kept per paper where it varies
  (*swabhava* in August 2024, *svabhava* in June/July 2025), as are the
  original's grammatical slips. Nothing is silently corrected, abridged,
  reworded or dropped.
- **The papers' own arithmetic is left alone.** The August 2024 paper sets 30
  marks under a header stating 25; its footer table agrees with the questions
  rather than the header. That is reproduced as printed, with the discrepancy
  noted in place.
- **Placeholders are kept.** Where a paper left a footer cell as the template's
  `xx`, it stays `xx`.
- **No answers.** This is a record of what was asked, not a model-answer book.

## Rebuilding

Requires a TeX distribution with the standard CTAN packages (MiKTeX or
TeX Live). No custom class file.

```bash
cd tex && pdflatex UHV-QuestionBank && pdflatex UHV-QuestionBank && pdflatex UHV-QuestionBank
```

Three passes: the second and third resolve the table of contents and the PDF
bookmarks. A clean build reports no overfull boxes.

After rebuilding, copy the result over the published copy:

```bash
cp tex/UHV-QuestionBank.pdf ../iem-website/public/notes/sem4/universal-human-values/previous-year-question-papers-2024-2026.pdf
```

Then update the file size in the matching entry in
`iem-website/src/lib/data.ts` if it has changed materially.

## Source material

Transcribed from scans of the original question papers. The June/July 2025 SEE
came from a PDF of the printed paper; the four CIE papers from photographs of
the physical papers. Where a scan was cut off or illegible, that is stated in
the book at the point it occurs rather than guessed at.
