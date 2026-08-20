/**
 * Harvard — Office of Career Services résumé sample.
 *
 * Every number here was measured off the original PDF, not eyeballed:
 *
 *   page          612 × 792 pt (US Letter)
 *   margins       0.5in all round — text runs x = 36 → 576
 *   body          Times New Roman 11pt  (we ship Tinos, metric-identical)
 *   baseline      13.2pt exactly — successive body lines at 378.6 / 391.8 /
 *                 405.0 / 418.2 → 1.2 × size
 *   name          bold 11pt, centred (x = 257.9, centre 306)
 *   headings      bold 11pt, centred, no rule
 *   section gap   13.2pt — one blank line, confirmed at 695.4 → 708.9
 *   entry gap     13.2pt — 233.4 → 246.6
 *
 * The house style has no bullet glyphs: descriptions are full-width prose
 * paragraphs. Each bullet a student types becomes one such paragraph, which is
 * what the original sample does.
 */

import type { TemplateDefinition } from "../../core/schema";
import { inch } from "../../core/units";

const SERIF = "serif";
const SIZE = 11;
const LEADING = 1.2;

/**
 * Locations and dates are not flush to the text margin — the original sets them
 * with a right tab stop at 7.55in. Every date without trailing whitespace in
 * the sample ends at 579.3–580.0pt, i.e. 543pt past the 36.6pt left margin,
 * while the text column itself stops at 577.3. Two and a bit points, but it is
 * a measured two and a bit points.
 */
const RIGHT_TAB = { tab: 543.0, tabAlign: "right" } as const;

const text = (patch: Partial<TemplateDefinition["typography"]["roles"]["body"]> = {}) => ({
  family: SERIF,
  size: SIZE,
  weight: 400,
  italic: false,
  smallCaps: false,
  allCaps: false,
  color: "ink",
  tracking: 0,
  ...patch,
});

export const harvard: TemplateDefinition = {
  id: "harvard",
  name: "Harvard",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "The Harvard OCS sample. Centred headings, Times New Roman, and prose descriptions instead of bullets — the most conservative, most ATS-safe layout of the set.",
    source: "Harvard Office of Career Services — Resumes and Cover Letters guide",
    thumbnail: "/templates/harvard/thumb.png",
    original: "/templates/harvard/original.pdf",
    tags: ["ats-friendly", "one-page", "classic", "no-bullets"],
    engine: "pdflatex",
  },

  /**
   * The margins are asymmetric because the original is.
   *
   * Left is 36.6pt, read straight off the text origins. The right edge is not
   * measurable the same way — trailing spaces in the source overhang it — so it
   * was solved from the line breaks instead: every observed break in the sample
   * is consistent with a content width of 540.68–540.75pt and no other value.
   * Taking 540.7 reproduces all fourteen wrapped lines exactly.
   *
   * A clean 0.5in/0.5in (540.0pt) would move "social" onto the next line and
   * cascade every subsequent section down by 13.2pt, so replication wins here.
   */
  page: {
    size: "letter",
    // `top` is the first baseline: 0.5in of margin plus the 9.8pt ascent of
    // 11pt Tinos.
    margin: { top: 45.8, right: 34.7, bottom: inch(0.5), left: 36.6 },
  },

  typography: {
    families: [
      {
        key: SERIF,
        cssName: "RB Tinos",
        faces: {
          "400": "tinos-regular.ttf",
          "700": "tinos-bold.ttf",
          "400i": "tinos-italic.ttf",
          "700i": "tinos-bolditalic.ttf",
        },
        substitutes: { original: "Times New Roman", fidelity: "metric" },
      },
    ],
    base: { family: SERIF, size: SIZE, leadingRatio: LEADING, smallCapsScale: 0.8 },
    roles: {
      name: text({ weight: 700 }),
      headline: text({ italic: true }),
      contact: text(),
      sectionTitle: text({ weight: 700 }),
      entryTitle: text({ weight: 700 }),
      entrySubtitle: text(),
      entryMeta: text(),
      body: text(),
      bullet: text(),
      label: text({ weight: 700 }),
      tag: text(),
      icon: text({ family: "serif" }),
      footer: text({ size: 9 }),
    },
  },

  palette: {
    ink: "#000000",
    muted: "#000000",
    accent: "#000000",
    rule: "#000000",
  },

  // The original writes "May - August 2025", not an en dash.
  conventions: { dateDash: "-" },

  sections: {
    available: [
      "summary",
      "education",
      "experience",
      "research",
      "publications",
      "projects",
      "leadership",
      "activities",
      "awards",
      "certifications",
      "skills",
      "interests",
      "custom",
    ],
    defaultOrder: ["education", "research", "projects", "experience", "skills"],
    aliases: {
      education: "Education",
      research: "Research Experience",
      projects: "Projects",
      experience: "Experience",
      skills: "Technical Skills",
      leadership: "Leadership",
    },
    titleCase: "as-is",
  },

  blocks: {
    header: {
      rows: [
        { cells: [{ bind: "personal.name", role: "name", align: "center" }] },
        {
          repeat: "links",
          inline: true,
          separator: " \u2022 ",
          gapBefore: 13.2,
          cells: [{ bind: "$link.label", role: "contact", align: "center", linkFrom: "$link.href" }],
        },
      ],
    },

    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle", align: "center" }] }],
      keepWithNext: true,
    },

    // Experience, Leadership, Projects, Research — bold title on line two.
    entry: {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "location", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        {
          cells: [
            { bind: "position", role: "entryTitle" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { repeat: "bullets", cells: [{ bind: "$item", role: "body", grow: true }] },
        { cells: [{ bind: "tags", role: "body", prefix: "Technologies: ", grow: true }] },
      ],
    },

    // Education keeps the degree line in regular weight, per the original.
    "entry.education": {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "location", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        {
          cells: [
            { bind: "position", role: "entrySubtitle" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { cells: [{ bind: "detail", role: "body", grow: true }] },
        { repeat: "bullets", cells: [{ bind: "$item", role: "body", grow: true }] },
      ],
    },

    // "Technical: Stata, SQL, R (intermediate), SPSS (beginner)."
    // Consecutive lines in the original — 718.4 / 731.6 / 744.9, exactly 13.2
    // apart — so this block overrides the 13.2pt entry gap with none.
    "entry.labeled": {
      gapBefore: 0,
      rows: [
        {
          cells: [
            { bind: "organization", role: "label", suffix: ":" },
            { bind: "summary", role: "body", prefix: " ", grow: true },
          ],
        },
      ],
    },

    "entry.paragraph": {
      rows: [{ cells: [{ bind: "section.text", role: "body", grow: true }] }],
    },
  },

  /**
   * One blank line everywhere, and only one: the section rhythm in the original
   * is 26.4pt between blocks, which is a 13.2pt line plus a 13.2pt gap. Adding
   * `headerAfter` on top of `sectionBefore` would make it 39.6.
   */
  spacing: {
    sectionBefore: 13.2,
    sectionAfter: 0,
    entryGap: 13.2,
    bulletGap: 0,
    headerAfter: 0,
  },

  rules: {
    fontScale: { min: 0.9, max: 1.1, step: 0.02 },
    lineSpacing: { min: 0.9, max: 1.2, step: 0.02 },
    spacingSlack: 0.15,
    allowBold: true,
    allowItalic: true,
    allowColor: "none",
    minBodySize: 9,
  },

  emit: {
    latex: {
      documentClass: "\\documentclass[letterpaper,11pt]{article}",
      preamble: [
        "\\usepackage[margin=0.5in]{geometry}",
        "\\IfFileExists{newtxtext.sty}{\\usepackage{newtxtext}}{\\usepackage{times}}  % Times metrics",
        "\\usepackage[T1]{fontenc}",
        "\\usepackage[utf8]{inputenc}",
        "\\usepackage{titlesec}",
        "\\usepackage{enumitem}",
        "\\usepackage{tabularx}",
        "\\usepackage[hidelinks]{hyperref}",
        "",
        "% Baseline measured off the original: 13.2pt at 11pt type.",
        "\\linespread{0.9706}",
        "\\setlength{\\parindent}{0pt}",
        "\\setlength{\\parskip}{0pt}",
        "\\pagestyle{empty}",
        "",
        "% Centred bold headings, no rule — the Harvard house style.",
        "\\titleformat{\\section}{\\bfseries\\normalsize\\centering}{}{0pt}{}",
        "\\titlespacing*{\\section}{0pt}{13.2pt}{0pt}",
        "",
        "% Organisation flush left, location flush right.",
        "\\newcommand{\\entryline}[2]{\\makebox[\\textwidth][s]{#1\\hfill#2}\\par}",
        "\\newcommand{\\entryhead}[4]{%",
        "  \\entryline{\\textbf{#1}}{#2}%",
        "  \\entryline{#3}{#4}%",
        "}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "\\begin{center}\n  \\textbf{ {{name}} }\\\\[13.2pt]\n  {{contact}}\n\\end{center}\n\\vspace{13.2pt}",
      section: "\\section*{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "\\entryhead{ {{organization}} }{ {{location}} }{\\textbf{ {{position}} }}{ {{dateRange}} }\n{{summary}}\n{{bullets}}\n\\vspace{13.2pt}",
        education:
          "\\entryhead{ {{organization}} }{ {{location}} }{ {{position}} }{ {{dateRange}} }\n{{summary}}\n{{detail}}\n{{bullets}}\n\\vspace{13.2pt}",
        labeled: "\\textbf{ {{organization}}: } {{summary}}\\par",
        paragraph: "{{text}}\\par\\vspace{13.2pt}",
      },
      bullet: "{{item}}\\par",
    },

    docx: {
      font: "Times New Roman",
      fontFallback: "Tinos",
      sectionRule: false,
      bulletChar: "",
    },
  },
};
