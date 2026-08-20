/**
 * UC Berkeley — Fung Institute "Resume Sample" (Oski Bear), guide p10.
 *
 * Measured off the published page (Calibri throughout; we ship Carlito):
 *
 *   page          612 × 792 pt (US Letter)
 *   text          x = 24 → 576
 *   name          Calibri 18pt bold, centred; next baseline +15.0
 *   contact       11pt centred, pipe-separated
 *   headings      11pt bold ALL CAPS, no rule
 *   body          11pt, 13.5pt leading
 *   section gap   27pt = one blank 13.5 line
 *   dates         right-aligned, origins at x ≈ 492
 *   bullets       marker 48.8pt into the column, text at 66.8pt
 *
 * Section titles are the only bold on the page — org, title and dates stay
 * regular weight, matching the sample.
 */

import type { TemplateDefinition } from "../../core/schema";

const SANS = "sans";
const SIZE = 11;
const LEADING = 13.5;

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

const RIGHT_TAB = { tab: 552, tabAlign: "right" } as const;

const CARLITO = {
  key: SANS,
  cssName: "RB Carlito",
  faces: {
    "400": "carlito-regular.ttf",
    "700": "carlito-bold.ttf",
    "400i": "carlito-italic.ttf",
    "700i": "carlito-bolditalic.ttf",
  },
  substitutes: { original: "Calibri", fidelity: "metric" as const },
};

export const berkeley: TemplateDefinition = {
  id: "berkeley",
  name: "UC Berkeley",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "Berkeley Engineering / Fung Institute sample. An 18pt centred name, Calibri, no rules, and dates on a right tab — dense without looking decorated.",
    source: "UC Berkeley College of Engineering, Coleman Fung Institute — Resume & Cover Letter Guide, 'Resume Sample' (Oski Bear), p10",
    thumbnail: "/templates/berkeley/thumb.png",
    original: "/templates/berkeley/original.pdf",
    tags: ["ats-friendly", "one-page", "sans-serif", "classic"],
    engine: "xelatex",
  },

  page: {
    size: "letter",
    // Standalone first baseline: 0.5in plus the ~13pt ascent of 18pt Carlito.
    margin: { top: 49.2, right: 36, bottom: 36, left: 24 },
  },

  typography: {
    families: [CARLITO],
    base: { family: SANS, size: SIZE, leadingRatio: 13.5 / 11, smallCapsScale: 0.8 },
    roles: {
      name: text({ size: 18, weight: 700, leading: 15 }),
      headline: text({ italic: true }),
      contact: text(),
      sectionTitle: text({ weight: 700 }),
      entryTitle: text(),
      entrySubtitle: text(),
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
      summary: "Professional Summary",
      experience: "Industry Experience",
      research: "Research Experience",
      projects: "Projects",
      skills: "Technical Skills",
      leadership: "Leadership and Professional Development",
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
          marker: { glyph: "•", x: 48.8, textX: 66.8 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.education": {
      rows: [
        {
          cells: [
            { bind: "organization", role: "body" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        { cells: [{ bind: "position", role: "body", grow: true }] },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { cells: [{ bind: "detail", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 48.8, textX: 66.8 },
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
    sectionBefore: 13.5,
    sectionAfter: 0,
    entryGap: 13.5,
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
        "\\usepackage[top=0.68in,bottom=0.5in,left=0.33in,right=0.5in]{geometry}",
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
        "\\titleformat{\\section}{\\bfseries\\normalsize}{}{0pt}{\\MakeUppercase}",
        "\\titlespacing*{\\section}{0pt}{13.5pt}{0pt}",
        "",
        "\\newcommand{\\entryline}[2]{#1\\hfill#2\\par}",
        "\\setlist[itemize]{leftmargin=66.8pt, itemsep=0pt, parsep=0pt, topsep=0pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "\\begin{center}\n  {\\LARGE\\bfseries {{name}} }\\\\[3pt]\n  {{contact}}\n\\end{center}",
      section: "\\section*{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "\\entryline{ {{organization}}, {{location}} }{ {{dateRange}} }\n{{position}}\\par\n{{bullets}}",
        education:
          "\\entryline{ {{organization}} }{ {{dateRange}} }\n{{position}}\\par\n{{summary}}\\par\n{{detail}}\n{{bullets}}",
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
      sectionRule: false,
      bulletChar: "•",
    },
  },
};
