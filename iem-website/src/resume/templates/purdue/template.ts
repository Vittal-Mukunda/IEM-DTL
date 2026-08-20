/**
 * Purdue — Center for Career Opportunities house style.
 *
 * CCO's Career Success Handbook (pages 27 and 30–36) specifies:
 *
 *   margins   top 0.8–1in; sides and bottom 0.5–1in
 *   type      Calibri 10–12pt (we use 11)
 *   order     heading, then education
 *   name      largest on the page, all caps, centred
 *   headings  all caps, no rule (the handbook samples do not underline)
 *   dates     flush right; location on the title line
 *
 * Carlito stands in for Calibri (metric).
 */

import type { TemplateDefinition } from "../../core/schema";
import { inch, twip } from "../../core/units";

const SANS = "sans";
const SIZE = 11;
const LEADING = 13.2;

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

const RIGHT_TAB = { tab: twip(10800), tabAlign: "right" } as const;

export const purdue: TemplateDefinition = {
  id: "purdue",
  name: "Purdue University",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "Purdue CCO's handbook layout. A 0.8in top margin, an all-caps Calibri name, and section titles with no rule — built for ATS uploads.",
    source: "Purdue Center for Career Opportunities — Career Success Handbook, 'Developing a Winning Resume' and sample résumés pp. 30–36",
    thumbnail: "/templates/purdue/thumb.png",
    tags: ["ats-friendly", "one-page", "sans-serif", "classic"],
    engine: "xelatex",
  },

  page: {
    size: "letter",
    // 0.8in Word margin plus the ascent of 16pt Carlito Bold.
    margin: { top: 69.6, right: inch(0.6), bottom: inch(0.5), left: inch(0.6) },
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
    base: { family: SANS, size: SIZE, leadingRatio: 1.2, smallCapsScale: 0.8 },
    roles: {
      name: text({ size: 16, weight: 700, allCaps: true, leading: 19.2 }),
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
      icon: text(),
      footer: text({ size: 9 }),
    },
  },

  palette: { ink: "#000000", muted: "#000000", accent: "#000000", rule: "#000000" },

  conventions: { dateDash: "–" },

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
      experience: "Relevant Experience",
      research: "Research Experience",
      projects: "Projects",
      leadership: "Leadership",
      awards: "Honors and Awards",
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
      keepWithNext: true,
    },

    entry: {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle", suffix: ", " },
            { bind: "location", role: "body" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        { cells: [{ bind: "position", role: "entrySubtitle" }] },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 18, textX: 36 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.education": {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "location", role: "body", prefix: ", ", when: "location" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        {
          cells: [
            { bind: "position", role: "body", grow: true },
            { bind: "summary", role: "body", prefix: " | ", when: "summary" },
          ],
        },
        { cells: [{ bind: "detail", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 18, textX: 36 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.labeled": {
      gapBefore: 0,
      rows: [
        {
          marker: { glyph: "•", x: 18, textX: 36 },
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
    sectionBefore: 13.2,
    sectionAfter: 0,
    entryGap: 10,
    bulletGap: 0,
    headerAfter: 13.2,
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
        "\\usepackage[top=0.8in,bottom=0.5in,left=0.6in,right=0.6in]{geometry}",
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
        "\\titlespacing*{\\section}{0pt}{13.2pt}{0pt}",
        "",
        "\\newcommand{\\entryline}[2]{#1\\hfill#2\\par}",
        "\\setlist[itemize]{leftmargin=36pt, itemsep=0pt, parsep=0pt, topsep=0pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "\\begin{center}\n  {\\LARGE\\bfseries\\MakeUppercase{ {{name}} }}\\\\[4pt]\n  {{contact}}\n\\end{center}\\vspace{13.2pt}",
      section: "\\section*{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "\\entryline{\\textbf{ {{organization}} }, {{location}} }{ {{dateRange}} }\n{{position}}\\par\n{{bullets}}",
        education:
          "\\entryline{\\textbf{ {{organization}} }, {{location}} }{ {{dateRange}} }\n{{position}}\\par\n{{summary}}\\par\n{{detail}}\n{{bullets}}",
        labeled: "\\begin{itemize}\\item \\textbf{ {{organization}}: } {{summary}}\\end{itemize}",
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
      rightTabInset: 21.6,
      sectionRule: false,
      bulletChar: "•",
    },
  },
};
