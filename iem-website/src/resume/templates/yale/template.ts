/**
 * Yale College — the general résumé template published by the Office of Career
 * Strategy, as a Word document.
 *
 * Read straight out of the OOXML rather than off a rendered page, which makes
 * this the most exactly-specified template of the set:
 *
 *   sectPr   pgSz 12240 × 15840 twips  = US Letter
 *            pgMar 720 on all four sides = 0.5in
 *   Normal1  sz 22 half-points = 11pt, line 240 = single
 *   name     14pt bold, all caps, flush left
 *   heading  bold + smallCaps, with pBdr bottom single sz 6 = 0.75pt
 *   tabs     one right stop at 10800 twips = 7.5in — the full content width
 *   entry    spacing before 100 twips = 5pt on the first entry of a section
 *   bullets  numId 5
 */

import type { TemplateDefinition } from "../../core/schema";
import { inch, twip } from "../../core/units";

const SERIF = "serif";
const SIZE = 11;
/** Word's "single" for Times New Roman at 11pt, confirmed against Harvard. */
const LEADING = 13.2;

const text = (patch: Partial<TemplateDefinition["typography"]["roles"]["body"]> = {}) => ({
  family: SERIF,
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

/** The document's single tab stop, at 10800 twips. */
const RIGHT_TAB = { tab: twip(10800), tabAlign: "right" } as const;

export const yale: TemplateDefinition = {
  id: "yale",
  name: "Yale College",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "Yale's official Word template. Ruled small-caps headings, a summary section, and one clean tab stop for dates — the most structured of the conservative layouts.",
    source: "Yale Office of Career Strategy — Yale College General Template v.2",
    thumbnail: "/templates/yale/thumb.png",
    tags: ["ats-friendly", "one-page", "classic", "ruled-headings"],
    engine: "pdflatex",
  },

  page: {
    size: "letter",
    // First baseline: 0.5in margin plus the ascent of 14pt Tinos.
    margin: { top: 48.5, right: inch(0.5), bottom: inch(0.5), left: inch(0.5) },
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
    base: { family: SERIF, size: SIZE, leadingRatio: 1.2, smallCapsScale: 0.8 },
    roles: {
      name: text({ size: 14, weight: 700, allCaps: true, leading: 16.8 }),
      headline: text({ italic: true }),
      contact: text(),
      sectionTitle: text({ weight: 700, smallCaps: true }),
      entryTitle: text({ weight: 700 }),
      entrySubtitle: text({ italic: true }),
      entryMeta: text(),
      body: text(),
      bullet: text(),
      label: text({ italic: true }),
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
      experience: "Professional Experience",
      research: "Research Experience",
      projects: "Projects",
      skills: "Technical Skills",
      summary: "Summary",
    },
    titleCase: "upper",
  },

  blocks: {
    header: {
      rows: [
        { cells: [{ bind: "personal.name", role: "name" }] },
        {
          repeat: "links",
          inline: true,
          separator: " | ",
          cells: [{ bind: "$link.label", role: "contact", linkFrom: "$link.href" }],
        },
      ],
    },

    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle" }] }],
      rule: { position: "underline", thickness: 0.75, color: "rule", gap: 3.2 },
      keepWithNext: true,
    },

    // "**Employer,** *Your Title*, City, State →tab Dates"
    entry: {
      rows: [
        {
          gapBefore: 5,
          cells: [
            { bind: "organization", role: "entryTitle", suffix: ", " },
            { bind: "position", role: "entrySubtitle", suffix: ", ", when: "position" },
            { bind: "location", role: "body" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 10.8, textX: 21.6 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.education": {
      rows: [
        {
          gapBefore: 5,
          cells: [
            { bind: "organization", role: "entryTitle", suffix: ", " },
            { bind: "location", role: "body" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        { cells: [{ bind: "position", role: "entrySubtitle" }] },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { cells: [{ bind: "detail", role: "label", prefix: "Relevant Coursework: ", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 10.8, textX: 21.6 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.labeled": {
      gapBefore: 0,
      rows: [
        {
          marker: { glyph: "•", x: 10.8, textX: 21.6 },
          cells: [
            { bind: "organization", role: "label", suffix: ": " },
            { bind: "summary", role: "body", grow: true },
          ],
        },
      ],
    },

    "entry.paragraph": {
      rows: [{ gapBefore: 5, cells: [{ bind: "section.text", role: "body", grow: true }] }],
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
        "\\IfFileExists{newtxtext.sty}{\\usepackage{newtxtext}}{\\usepackage{times}}",
        "\\usepackage[T1]{fontenc}",
        "\\usepackage[utf8]{inputenc}",
        "\\usepackage{titlesec}",
        "\\usepackage{enumitem}",
        "\\usepackage[hidelinks]{hyperref}",
        "",
        "\\linespread{0.9706}",
        "\\setlength{\\parindent}{0pt}",
        "\\setlength{\\parskip}{0pt}",
        "\\pagestyle{empty}",
        "",
        "% Small-caps heading with a rule under it, matching the Word template's",
        "% single 0.75pt bottom border.",
        "\\titleformat{\\section}{\\bfseries\\scshape\\normalsize}{}{0pt}{}[\\vspace{-9pt}\\rule{\\textwidth}{0.75pt}]",
        "\\titlespacing*{\\section}{0pt}{13.2pt}{5pt}",
        "",
        "\\newcommand{\\entryline}[2]{#1\\hfill#2\\par}",
        "\\setlist[itemize]{leftmargin=21.6pt, itemsep=0pt, parsep=0pt, topsep=0pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header: "\\textbf{\\large {{name}}}\\par\n{{contact}}\\par\n\\vspace{13.2pt}",
      section: "\\section*{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "\\entryline{\\textbf{ {{organization}} }, \\textit{ {{position}} }, {{location}} }{ {{dateRange}} }\n{{summary}}\n{{bullets}}",
        education:
          "\\entryline{\\textbf{ {{organization}} }, {{location}} }{ {{dateRange}} }\n\\textit{ {{position}} }\\par\n{{summary}}\n{{bullets}}",
        labeled: "\\begin{itemize}\\item \\textit{ {{organization}}: } {{summary}}\\end{itemize}",
        paragraph: "{{text}}\\par",
      },
      bulletsOpen: "\\begin{itemize}",
      bullet: "  \\item {{item}}",
      bulletsClose: "\\end{itemize}",
    },

    docx: {
      font: "Times New Roman",
      fontFallback: "Tinos",
      sectionRule: true,
      bulletChar: "•",
    },
  },
};
