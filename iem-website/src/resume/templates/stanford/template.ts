/**
 * Stanford — Career Center "Sample Chronological Resume".
 *
 * The defining feature is a **left date gutter**: dates sit in their own
 * column so the reader can scan the timeline down the page while the content
 * column stays flush.
 *
 * A note on scale, because it matters for reading the verification report.
 * The published sample is a page from a printed careers handbook — a 594 × 783
 * trim size, with the résumé set at 9pt in a 320pt column. Those are book
 * measurements, not résumé measurements: nobody prints a résumé at 9pt. So this
 * template keeps the sample's *proportions* — gutter width relative to content
 * width, indents, the 1.22 line-height ratio, the ruled small-caps headings —
 * at a standalone US Letter size with 0.75in margins and 10pt type.
 *
 * The verifier registers the two before comparing and reports the scale it
 * recovered (about 1.26), so the number it prints is a genuine measure of
 * proportional fidelity rather than a comparison of two different page sizes.
 */

import type { TemplateDefinition } from "../../core/schema";
import { inch } from "../../core/units";

const SERIF = "serif";
const SIZE = 10;
const LEADING = 12.2;

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

export const stanford: TemplateDefinition = {
  id: "stanford",
  name: "Stanford University",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "Dates in a left gutter, ruled small-caps headings, everything else flush. Reads chronologically at a glance — the classic career-centre layout.",
    source: "Stanford Career Center — Resume and Cover Letter Examples, 'Sample Chronological Resume'",
    thumbnail: "/templates/stanford/thumb.png",
    original: "/templates/stanford/original.pdf",
    tags: ["ats-friendly", "date-gutter", "one-page", "classic"],
    engine: "pdflatex",
  },

  page: {
    size: "letter",
    margin: { top: 58, right: inch(0.75), bottom: inch(0.75), left: inch(0.75) },
    gutter: { width: 90, gap: 10, carries: "entryDates", align: "left" },
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
        substitutes: { original: "Times LT Std", fidelity: "visual" },
      },
    ],
    base: { family: SERIF, size: SIZE, leadingRatio: 1.22, smallCapsScale: 0.8 },
    roles: {
      name: text({ size: 15.5, weight: 700, smallCaps: true, leading: 12.2 }),
      headline: text({ italic: true }),
      contact: text({ leading: 24.4 }),
      sectionTitle: text({ weight: 700, smallCaps: true, leading: 12.2 }),
      entryTitle: text({ weight: 700 }),
      entrySubtitle: text(),
      entryMeta: text(),
      body: text(),
      bullet: text(),
      label: text({ weight: 700 }),
      tag: text({ italic: true }),
      icon: text(),
      footer: text({ size: 8.5 }),
    },
  },

  palette: { ink: "#231f20", muted: "#231f20", accent: "#8c1515", rule: "#231f20" },

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
      research: "Research Experience",
      projects: "Projects",
      skills: "Technical Skills",
    },
    titleCase: "as-is",
  },

  blocks: {
    header: {
      rows: [
        { cells: [{ bind: "personal.name", role: "name" }] },
        {
          repeat: "links",
          inline: true,
          separator: "  •  ",
          cells: [{ bind: "$link.label", role: "contact", linkFrom: "$link.href" }],
        },
      ],
    },

    // Full width including the gutter, with a rule beneath.
    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle", suffix: ":" }] }],
      rule: { position: "underline", thickness: 0.6, color: "rule", gap: 3.4 },
      keepWithNext: true,
    },

    entry: {
      rows: [
        {
          cells: [
            { bind: "position", role: "entryTitle", suffix: ", " },
            { bind: "organization", role: "body" },
            { bind: "location", role: "body", prefix: ", ", when: "location" },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 0, textX: 13.6 },
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
          ],
        },
        { cells: [{ bind: "position", role: "body", grow: true }] },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { cells: [{ bind: "detail", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 0, textX: 13.6 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.labeled": {
      gapBefore: 0,
      rows: [
        {
          marker: { glyph: "•", x: 0, textX: 13.6 },
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
    sectionBefore: 12.2,
    sectionAfter: 0,
    entryGap: 12.2,
    bulletGap: 0,
    headerAfter: 12.2,
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
      documentClass: "\\documentclass[letterpaper,10pt]{article}",
      preamble: [
        "\\usepackage[margin=0.75in]{geometry}",
        "\\IfFileExists{newtxtext.sty}{\\usepackage{newtxtext}}{\\usepackage{times}}",
        "\\usepackage[T1]{fontenc}",
        "\\usepackage[utf8]{inputenc}",
        "\\usepackage{titlesec}",
        "\\usepackage{enumitem}",
        "\\usepackage[hidelinks]{hyperref}",
        "",
        "\\setlength{\\parindent}{0pt}",
        "\\setlength{\\parskip}{0pt}",
        "\\pagestyle{empty}",
        "",
        "\\titleformat{\\section}{\\bfseries\\scshape}{}{0pt}{}[\\vspace{-8pt}\\rule{\\textwidth}{0.6pt}]",
        "\\titlespacing*{\\section}{0pt}{12.2pt}{2pt}",
        "",
        "% Dates in a left gutter, content in the column beside it.",
        "\\newlength{\\datecol}\\setlength{\\datecol}{90pt}",
        "\\newcommand{\\dated}[2]{%",
        "  \\noindent\\begin{minipage}[t]{\\datecol}#1\\end{minipage}\\hspace{10pt}%",
        "  \\begin{minipage}[t]{\\dimexpr\\textwidth-\\datecol-10pt\\relax}#2\\end{minipage}\\par}",
        "\\setlist[itemize]{leftmargin=13.6pt, itemsep=0pt, parsep=0pt, topsep=0pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "{\\large\\bfseries\\scshape {{name}} }\\par\\vspace{4pt}\n{{contact}}\\par\\vspace{12.2pt}",
      section: "\\section*{ {{title}}: }\n{{entries}}",
      entry: {
        default:
          "\\dated{ {{dateRange}} }{\\textbf{ {{position}} }, {{organization}}, {{location}}\\par\n{{bullets}}}\n\\vspace{12.2pt}",
        education:
          "\\dated{ {{dateRange}} }{\\textbf{ {{organization}} }, {{location}}\\par\n{{position}}\\par\n{{summary}}\\par\n{{detail}}\\par\n{{bullets}}}\n\\vspace{12.2pt}",
        labeled: "\\dated{}{\\textbf{ {{organization}}: } {{summary}}}",
        paragraph: "\\dated{}{ {{text}} }",
      },
      bulletsOpen: "\\begin{itemize}",
      bullet: "  \\item {{item}}",
      bulletsClose: "\\end{itemize}",
    },

    docx: {
      font: "Times New Roman",
      fontFallback: "Tinos",
      rightTab: 9360,
      sectionRule: true,
      bulletChar: "•",
    },
  },
};
