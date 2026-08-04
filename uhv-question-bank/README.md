# Universal Human Values (HS248AT) — The Complete Question Bank

The whole of HS248AT in one LaTeX document: **150 questions from 9 papers,
every one answered**, plus every past paper for which a scan survives
reproduced in full. 91 pages.

| File | Contents |
|---|---|
| `tex/UHV-Complete.tex` | Master — preamble, title page, part structure |
| `tex/uhv-howtouse.tex` | How the book is arranged; sources; tag legend |
| `tex/uhv-unit1.tex` | Part I, Unit I — Q1–Q26 (Chapters 1–7) |
| `tex/uhv-unit2.tex` | Part I, Unit II — Q27–Q49, Q67–Q70 (Chapters 8–9) |
| `tex/uhv-unit3.tex` | Part I, Unit III — Q50–Q66, Q71–Q74 (Chapter 10) |
| `tex/uhv-objective.tex` | Part II — 36 MCQ, 35 fill-in-the-blank, 5 short answers |
| `tex/uhv-papers.tex` | Part III — the five reproducible papers, in full |
| `tex/uhv-appendix.tex` | Appendices A (paper index), B (repeats), C (revision) |

The published copy lives at
`iem-website/public/notes/sem4/universal-human-values/complete-question-bank-with-answers.pdf`
and is linked from the Resources page.

## Structure

Three parts, because there are three ways to use it.

- **Part I — descriptive question bank.** 74 long-answer questions arranged
  *unit-wise* against the syllabus, each with a model answer. This is the part
  to revise from.
- **Part II — objective question bank.** 76 items: every MCQ, fill-in-the-blank
  and one-mark short answer, with the answer beside it.
- **Part III — the question papers.** Five papers reproduced question-for-question
  with their date, assessment type, duration, marks, printed instructions and
  marks-distribution footers. Every question points to its answer in Part I or II,
  so a past paper can be worked end to end and then marked.

Part I is arranged by topic because that is how you learn; Part III is arranged
by paper because that is how you are examined.

## The nine papers

| Assessment | Date | Max marks | Questions | Where |
|---|---|---:|---:|---|
| SEE (21HSU48) | October 2023 | 50 | 23 | Appendix A.3 |
| CIE 1 | 22 June 2024 | 25 | 4 | Appendix A.1 |
| CIE 2 | 24 July 2024 | 5 + 25 | 10 | Appendix A.2 |
| Improvement CIE / CIE 3 | 28 August 2024 | 25 | 10 | **Part III** |
| SEE | Sept/Oct 2024 | 50 | 23 | Appendix A.3 |
| CIE-II | 7 May 2025 | 25 + 5 | 10 | **Part III** |
| Improvement CIE | June 2025 | 30 | 9 | **Part III** |
| **SEE** Regular/Suppl. | June/July 2025 | 50 | 20 | **Part III** |
| Improvement CIE | 18 June 2026 | 05 + 25 | 10 | **Part III** |

Five papers are reproduced in full because scans of the whole paper were
available. For the other four only the question list survives, so they appear
in the Appendix A index — but every one of their questions is answered in
Parts I and II just the same.

## Where the answers come from

Every answer is written **strictly from the prescribed material and nothing
else**: the three unit notes for this course (*A Foundation Course in Human
Values and Professional Ethics*, Chapters 1–10, as published under
`public/notes/sem4/universal-human-values/`) and the official RVCE
*Scheme & Solution* documents for CIE 2 (2022–23) and Quiz-3/CIE 3 (2023–24).
Where a scheme gives the model answer, that wording is followed in substance.

Nothing has been imported from outside those sources. Where a past-paper
question uses a term the notes do not define in that form, the answer says so
and answers from the nearest thing the notes do define, rather than filling the
gap from elsewhere.

## Conventions

- **Question numbering is stable.** Q1–Q66 are the numbers the earlier question
  bank used, kept unchanged so existing cross-references still resolve.
  Q67–Q74 are the questions first set in the 2025–2026 papers, added at the end
  of their unit under a clearly flagged section.
- **Tags name provenance.** Each question carries pills naming the papers it
  has actually appeared in — `CIE 2`, `SEE`, `SEE 2025`, `Impr. CIE 2026` —
  and `Scheme` where the answer follows the official RVCE scheme verbatim in
  substance. An untagged question has not yet appeared in a paper we hold.
- **Answers are written to the length the marks buy.** Roughly one scoring
  point per mark, since that is how the valuation scheme for this course works.
- **Two known warnings are stated in the book**, not buried: the circulating
  Unit II answer-set defines justice using legal categories
  (distributive/procedural/retributive/restorative), which contradicts the
  official scheme; and two SEE questions belong to Chapters 11–13, which are
  outside the supplied material and are therefore listed but not answered.
- **The papers' own errors are reproduced, not tidied.** The 28 August 2024
  paper sets 30 marks under a header stating 25; that is left as printed with
  the discrepancy noted in place.
- Every figure is drawn in TikZ — no imported images.

## Rebuilding

Requires a TeX distribution with the standard CTAN packages (MiKTeX or
TeX Live). No custom class file.

```bash
cd tex && pdflatex UHV-Complete && pdflatex UHV-Complete && pdflatex UHV-Complete
```

Three passes: the second and third resolve the table of contents and the PDF
bookmarks. A clean build reports **no overfull boxes**.

After rebuilding, copy the result over the published copy:

```bash
cp tex/UHV-Complete.pdf ../iem-website/public/notes/sem4/universal-human-values/complete-question-bank-with-answers.pdf
```

Then update the file size in the matching entry in
`iem-website/src/lib/data.ts` if it has changed materially.

## Source material

Transcribed from the three unit-notes PDFs and from scans of the original
question papers. The June/July 2025 SEE came from a PDF of the printed paper;
the four CIE papers from photographs of the physical papers. Where a scan was
cut off or illegible, that is stated in the book at the point it occurs rather
than guessed at.
