/**
 * UT Austin — Moody College of Communication "IMA LONGHORN" sample
 * (Resume Writing Guide, page 2).
 *
 * Measured off the published page:
 *
 *   page          612 × 792 pt (US Letter)
 *   text          x = 37 → ~578
 *   name          Engravers MT 19.92pt centred (we ship Carlito 18pt caps —
 *                 Engravers is not redistributable)
 *   contact       Calibri 10.8pt centred, " | " separators, +18.72
 *   headings      Calibri Bold 9.84pt ALL CAPS + hairline rule ~3.6pt below
 *   body          Calibri 9.84pt, 12.24pt leading
 *   experience    **Org**, Location  …  dates; italic title; bullets at the
 *                 left margin (no hanging indent)
 *   skills        **Label:** rest of the line
 */

import type { TemplateDefinition } from "../../core/schema";

const SANS = "sans";
const SIZE = 9.84;
const LEADING = 12.24;

const text = (patch: Partial<TemplateDefinition["typography"]["roles"]["body"]> = {}) => ({
  family: SANS,
  size: SIZE,
  weight: 400,
  italic: false,
  smallCaps: false,
  allCaps: false,
  color: "ink",
  tracking: 0,
  leading: LEADING,
  ...patch,
});

const RIGHT_TAB = { tab: 516, tabAlign: "right" } as const;

export const utaustin: TemplateDefinition = {
  id: "utaustin",
  name: "University of Texas at Austin",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "Moody College's sample. A wide all-caps name, Calibri body, hairline-ruled headings, and italic job titles — the communication-school layout.",
    source: "UT Austin Moody College of Communication Career Services — Resume Writing Guide, sample résumé p2 (IMA LONGHORN)",
    thumbnail: "/templates/utaustin/thumb.png",
    original: "/templates/utaustin/original.pdf",
    tags: ["ats-friendly", "one-page", "sans-serif", "ruled-headings"],
    engine: "xelatex",
  },

  page: {
    size: "letter",
    margin: { top: 55.43, right: 34, bottom: 36, left: 37 },
  },

  typography: {
    families: [
      {
        key: SANS,
        cssName: "RB Carlito",
        faces: {
          "400": "carlito-regular.ttf",
          "700": "carlito-bold.ttf",
          "400i": "carlito-italic.ttf",
          "700i": "carlito-bolditalic.ttf",
        },
        substitutes: { original: "Calibri", fidelity: "metric" },
      },
    ],
    base: { family: SANS, size: SIZE, leadingRatio: 12.24 / 9.84, smallCapsScale: 0.8 },
    roles: {
      // Engravers MT is not redistributable; Carlito caps at 18pt is the
      // visual stand-in. The body face is a metric Calibri substitute.
      name: text({ size: 18, weight: 700, allCaps: true, leading: 18.72 }),
      headline: text({ italic: true, size: 10.8, leading: 12.72 }),
      contact: text({ size: 10.8, leading: 12.72 }),
      sectionTitle: text({ weight: 700 }),
      entryTitle: text({ weight: 700 }),
      entrySubtitle: text({ italic: true }),
      entryMeta: text(),
      body: text(),
      bullet: text(),
      label: text({ weight: 700 }),
      tag: text(),
      icon: text(),
      footer: text({ size: 9 }),
    },
  },

  palette: { ink: "#000000", muted: "#000000", accent: "#000000", rule: "#000000" },

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
      experience: "Experience",
      research: "Research Experience",
      projects: "Academic Projects",
      leadership: "Additional Experience",
      skills: "Skills",
    },
    titleCase: "upper",
  },

  blocks: {
    header: {
      rows: [
        { cells: [{ bind: "personal.name", role: "name", align: "center" }] },
        {
          repeat: "links",
          inline: true,
          separator: " | ",
          cells: [{ bind: "$link.label", role: "contact", align: "center", linkFrom: "$link.href" }],
        },
      ],
    },

    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle" }] }],
      rule: { position: "underline", thickness: 0.5, color: "rule", gap: 3.6 },
      keepWithNext: true,
    },

    entry: {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "location", role: "body", prefix: ", ", when: "location" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        { cells: [{ bind: "position", role: "entrySubtitle" }] },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 0, textX: 12 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.education": {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        {
          cells: [
            { bind: "position", role: "body" },
            { bind: "location", role: "entrySubtitle", prefix: " - ", when: "location" },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { cells: [{ bind: "detail", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 0, textX: 12 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.projects": {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "position", role: "body", prefix: " - ", when: "position" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 0, textX: 12 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.labeled": {
      gapBefore: 0,
      rows: [
        {
          cells: [
            { bind: "organization", role: "label", suffix: ": " },
            { bind: "summary", role: "body", grow: true },
          ],
        },
      ],
    },

    "entry.paragraph": {
      rows: [{ cells: [{ bind: "section.text", role: "body", grow: true }] }],
    },
  },

  spacing: {
    sectionBefore: 10,
    sectionAfter: 0,
    entryGap: 10,
    bulletGap: 0,
    headerAfter: 0,
  },

  rules: {
    fontScale: { min: 0.9, max: 1.12, step: 0.02 },
    lineSpacing: { min: 0.9, max: 1.2, step: 0.02 },
    spacingSlack: 0.15,
    allowBold: true,
    allowItalic: true,
    allowColor: "none",
    minBodySize: 8.5,
  },

  emit: {
    latex: {
      documentClass: "\\documentclass[letterpaper,10pt]{article}",
      preamble: [
        "\\usepackage[top=0.77in,bottom=0.5in,left=0.51in,right=0.47in]{geometry}",
        "\\usepackage{iftex}",
        "\\iftutex",
        "  \\usepackage{fontspec}",
        "  \\IfFontExistsTF{Carlito}{\\setmainfont{Carlito}}{\\IfFontExistsTF{Calibri}{\\setmainfont{Calibri}}{}}",
        "\\else",
        "  \\usepackage[T1]{fontenc}",
        "  \\usepackage[utf8]{inputenc}",
        "  \\usepackage{helvet}",
        "  \\renewcommand{\\familydefault}{\\sfdefault}",
        "\\fi",
        "\\usepackage{titlesec}",
        "\\usepackage{enumitem}",
        "\\usepackage[hidelinks]{hyperref}",
        "",
        "\\setlength{\\parindent}{0pt}",
        "\\setlength{\\parskip}{0pt}",
        "\\pagestyle{empty}",
        "",
        "\\titleformat{\\section}{\\bfseries\\normalsize}{}{0pt}{\\MakeUppercase}[\\vspace{-8pt}\\rule{\\textwidth}{0.4pt}]",
        "\\titlespacing*{\\section}{0pt}{10pt}{4pt}",
        "",
        "\\newcommand{\\entryline}[2]{#1\\hfill#2\\par}",
        "\\setlist[itemize]{leftmargin=12pt, itemsep=0pt, parsep=0pt, topsep=0pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "\\begin{center}\n  {\\LARGE\\bfseries\\MakeUppercase{ {{name}} }}\\\\[4pt]\n  {{contact}}\n\\end{center}",
      section: "\\section*{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "\\entryline{\\textbf{ {{organization}} }, {{location}} }{ {{dateRange}} }\n\\textit{ {{position}} }\\par\n{{bullets}}",
        education:
          "\\entryline{\\textbf{ {{organization}} }, {{location}} }{ {{dateRange}} }\n{{position}}\\par\n{{summary}}\\par\n{{detail}}\n{{bullets}}",
        projects:
          "\\entryline{\\textbf{ {{organization}} } -- {{position}} }{ {{dateRange}} }\n{{bullets}}",
        labeled: "\\textbf{ {{organization}}: } {{summary}}\\par",
        paragraph: "{{text}}\\par",
      },
      bulletsOpen: "\\begin{itemize}",
      bullet: "  \\item {{item}}",
      bulletsClose: "\\end{itemize}",
    },

    docx: {
      font: "Calibri",
      fontFallback: "Carlito",
      // The sample pulls its date column in from the margin.
      rightTabInset: 25,
      sectionRule: true,
      bulletChar: "•",
    },
  },
};
