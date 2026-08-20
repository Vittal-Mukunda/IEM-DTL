/**
 * MIT — Careers Office "Undergraduate resume" sample.
 *
 * The distinctive move is a **left label column**: section names sit in a
 * gutter beside the content rather than above it, which buys back a line per
 * section and lets the reader scan the categories vertically.
 *
 * Measured from p6 of the composite sample pack (A4, as distributed):
 *
 *   page      595 × 842 pt
 *   gutter    labels at x = 28.8, content at x = 99.7 → 65pt wide, 6pt gap
 *   content   99.7 → 569, so the right margin is 26.3
 *   name      bold small caps, cap 19.92 / small 15.12 → 0.759 scale
 *   addresses bold 10.08, School flush left, Home flush right
 *   email     bold 12, centred; phone bold 12 on the next line
 *   body      10.08pt, 11.52pt leading
 *   bullets   Symbol marker at 103.0, text at 121.0
 *   entry gap 21.6 · section gap 21.36
 */

import type { TemplateDefinition } from "../../core/schema";

const SERIF = "serif";
const SIZE = 10.08;
const LEADING = 11.52;

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

export const mit: TemplateDefinition = {
  id: "mit",
  name: "Massachusetts Institute of Technology",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "MIT CAPD undergraduate sample: section titles in a left gutter. Dense enough for an ORC SM/PhD CV — list publications and awards. Times metrics, A4.",
    source: "MIT Career Advising & Professional Development — Sample Resumes, 'Undergraduate resume'",
    thumbnail: "/templates/mit/thumb.png",
    original: "/templates/mit/original.pdf",
    tags: ["ats-friendly", "label-column", "dense", "classic"],
    engine: "pdflatex",
  },

  page: {
    size: "a4",
    margin: { top: 39.84, right: 26.3, bottom: 36, left: 28.8 },
    gutter: { width: 65, gap: 5.9, carries: "sectionTitle", align: "left" },
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
    base: { family: SERIF, size: SIZE, leadingRatio: 1.143, smallCapsScale: 0.759 },
    roles: {
      name: text({ size: 19.92, weight: 700, smallCaps: true, leading: 15.36 }),
      headline: text({ italic: true }),
      contact: text({ size: 12, weight: 700, leading: 14.16 }),
      sectionTitle: text({ weight: 700 }),
      entryTitle: text({ weight: 700, allCaps: true }),
      entrySubtitle: text({ weight: 700 }),
      entryMeta: text({ italic: true }),
      body: text(),
      bullet: text(),
      label: text({ weight: 700 }),
      tag: text({ italic: true }),
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
    defaultOrder: ["education", "research", "projects", "experience", "awards", "skills"],
    aliases: {
      research: "Research",
      projects: "Projects",
      awards: "Awards",
      skills: "Skills",
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
          separator: " • ",
          cells: [{ bind: "$link.label", role: "contact", align: "center", linkFrom: "$link.href" }],
        },
      ],
    },

    // Rendered into the gutter beside the first entry, not above it.
    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle" }] }],
      keepWithNext: true,
    },

    entry: {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "location", role: "entryTitle", align: "right" },
          ],
        },
        {
          cells: [
            { bind: "position", role: "entrySubtitle" },
            { bind: "dateRange", role: "entryMeta", align: "right" },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          gapBefore: 0.72,
          marker: { glyph: "•", x: 3.3, textX: 21.3 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.education": {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "location", role: "entryTitle", align: "right" },
          ],
        },
        {
          cells: [
            { bind: "position", role: "body" },
            { bind: "summary", role: "body", prefix: ", ", when: "summary" },
            { bind: "dateRange", role: "entryMeta", align: "right" },
          ],
        },
        {
          cells: [{ bind: "detail", role: "body", prefix: "Relevant Coursework: ", grow: true }],
        },
        {
          repeat: "bullets",
          gapBefore: 0.72,
          marker: { glyph: "•", x: 3.3, textX: 21.3 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.labeled": {
      gapBefore: 0,
      rows: [{ cells: [{ bind: "summary", role: "body", grow: true }] }],
    },

    "entry.paragraph": {
      rows: [{ cells: [{ bind: "section.text", role: "body", grow: true }] }],
    },
  },

  spacing: {
    sectionBefore: 9.84,
    sectionAfter: 0,
    entryGap: 10.08,
    bulletGap: 0,
    headerAfter: 9.36,
  },

  rules: {
    fontScale: { min: 0.9, max: 1.12, step: 0.02 },
    lineSpacing: { min: 0.9, max: 1.2, step: 0.02 },
    spacingSlack: 0.15,
    allowBold: true,
    allowItalic: true,
    allowColor: "none",
    minBodySize: 9,
  },

  emit: {
    latex: {
      documentClass: "\\documentclass[a4paper,10pt]{article}",
      preamble: [
        "\\usepackage[top=0.55in,bottom=0.5in,left=0.4in,right=0.37in]{geometry}",
        "\\IfFileExists{newtxtext.sty}{\\usepackage{newtxtext}}{\\usepackage{times}}",
        "\\usepackage[T1]{fontenc}",
        "\\usepackage[utf8]{inputenc}",
        "\\usepackage{enumitem}",
        "\\usepackage{tabularx}",
        "\\usepackage[hidelinks]{hyperref}",
        "",
        "\\setlength{\\parindent}{0pt}",
        "\\setlength{\\parskip}{0pt}",
        "\\pagestyle{empty}",
        "",
        "% The label column: section name on the left, content on the right.",
        "\\newlength{\\labelcol}\\setlength{\\labelcol}{65pt}",
        "\\newenvironment{resumesection}[1]{%",
        "  \\vspace{9.84pt}\\noindent",
        "  \\begin{minipage}[t]{\\labelcol}\\textbf{#1}\\end{minipage}%",
        "  \\hspace{5.9pt}%",
        "  \\begin{minipage}[t]{\\dimexpr\\textwidth-\\labelcol-5.9pt\\relax}%",
        "}{\\end{minipage}\\par}",
        "",
        "\\newcommand{\\entryline}[2]{#1\\hfill#2\\par}",
        "\\setlist[itemize]{leftmargin=21.3pt, itemsep=0pt, parsep=0pt, topsep=0.72pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "\\begin{center}\n  {\\Large\\bfseries\\scshape {{name}} }\\\\[2pt]\n  \\textbf{ {{contact}} }\n\\end{center}\n\\vspace{9.36pt}",
      section: "\\begin{resumesection}{ {{title}} }\n{{entries}}\n\\end{resumesection}",
      entry: {
        default:
          "  \\entryline{\\textbf{\\MakeUppercase{ {{organization}} }}}{\\textbf{\\MakeUppercase{ {{location}} }}}\n"
          + "  \\entryline{\\textbf{ {{position}} }}{\\textit{ {{dateRange}} }}\n{{bullets}}\n\\vspace{10.08pt}",
        education:
          "  \\entryline{\\textbf{\\MakeUppercase{ {{organization}} }}}{\\textbf{\\MakeUppercase{ {{location}} }}}\n"
          + "  \\entryline{ {{position}}, {{summary}} }{\\textit{ {{dateRange}} }}\n{{detail}}\n{{bullets}}\n\\vspace{10.08pt}",
        labeled: "  {{summary}}\\par",
        paragraph: "  {{text}}\\par",
      },
      bulletsOpen: "  \\begin{itemize}",
      bullet: "    \\item {{item}}",
      bulletsClose: "  \\end{itemize}",
    },

    docx: {
      font: "Times New Roman",
      fontFallback: "Tinos",
      sectionRule: false,
      bulletChar: "•",
    },
  },
};
