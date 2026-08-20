/**
 * UW–Madison — SuccessWorks first-year / early-college sample (Maynard Duck).
 *
 * The published PDF is Calibri, one column, all-caps headings, no rule:
 *
 *   name      16pt bold, centred
 *   contact   11pt centred, " • " separators
 *   headings  11pt bold ALL CAPS
 *   education school left / graduation date right; degree on the next line
 *   experience org left / dates right; title left / city right
 *   bullets   Word hanging indent, 18pt / 36pt
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

export const wisconsin: TemplateDefinition = {
  id: "wisconsin",
  name: "University of Wisconsin–Madison",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "SuccessWorks' early-college sample. Calibri, centred name, all-caps headings, and dates on a right tab — the L&S house style.",
    source: "UW–Madison SuccessWorks — First- or Second-Year Student Resume Example (Maynard Duck)",
    thumbnail: "/templates/wisconsin/thumb.png",
    tags: ["ats-friendly", "one-page", "sans-serif", "classic"],
    engine: "xelatex",
  },

  page: {
    size: "letter",
    margin: { top: 50.5, right: inch(0.5), bottom: inch(0.5), left: inch(0.5) },
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
      name: text({ size: 16, weight: 700, leading: 19.2 }),
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
      experience: "Work Experience",
      research: "Research Experience",
      projects: "Projects",
      leadership: "Campus Involvement",
      activities: "Volunteer Experience",
      skills: "Technical Skills",
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
          separator: " • ",
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
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        {
          cells: [
            { bind: "position", role: "entrySubtitle" },
            { bind: "location", role: "body", align: RIGHT_TAB },
          ],
        },
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
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        { cells: [{ bind: "position", role: "body", grow: true }] },
        { cells: [{ bind: "summary", role: "body", prefix: "GPA: ", grow: true }] },
        { cells: [{ bind: "detail", role: "body", prefix: "Relevant Coursework: ", grow: true }] },
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
    entryGap: 13.2,
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
        "\\usepackage[margin=0.5in]{geometry}",
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
        "\\begin{center}\n  {\\LARGE\\bfseries {{name}} }\\\\[4pt]\n  {{contact}}\n\\end{center}\\vspace{13.2pt}",
      section: "\\section*{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "\\entryline{\\textbf{ {{organization}} }}{ {{dateRange}} }\n\\entryline{ {{position}} }{ {{location}} }\n{{bullets}}",
        education:
          "\\entryline{\\textbf{ {{organization}} }}{ {{dateRange}} }\n{{position}}\\par\n{{summary}}\\par\n{{detail}}\n{{bullets}}",
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
