/**
 * Georgia Tech — Career Center "General Resume Template" (Resume-101.docx).
 *
 * Read from the OOXML, not a render:
 *
 *   pgSz     12240 × 15840 twips  = US Letter
 *   pgMar    720 all round        = 0.5in
 *   name     Times 14pt bold, centred, spacing after 60 twips
 *   contact  Times 11pt centred, " • " separators
 *   heading  Times 11pt bold ALL CAPS, pBdr bottom sz=4 (0.5pt) space=1
 *   tabs     one right stop at 10800 twips = 7.5in
 *   entry    org flush left / location at the tab; italic title + dates
 *   bullets  left=720 hanging=360 twips (18pt marker, 36pt text)
 */

import type { TemplateDefinition } from "../../core/schema";
import { inch, twip } from "../../core/units";

const SERIF = "serif";
const SIZE = 11;
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

const RIGHT_TAB = { tab: twip(10800), tabAlign: "right" } as const;

export const gatech: TemplateDefinition = {
  id: "gatech",
  name: "Georgia Institute of Technology",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "Georgia Tech Career Center's general Word template. Centred 14pt name, ruled all-caps headings, organisation left and city on the right tab.",
    source: "Georgia Tech Career Center — General Resume Template (Resume-101.docx)",
    thumbnail: "/templates/gatech/thumb.png",
    tags: ["ats-friendly", "one-page", "classic", "ruled-headings"],
    engine: "pdflatex",
  },

  page: {
    size: "letter",
    // 0.5in plus the ascent of 14pt Tinos, matching Yale's 14pt header.
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
      name: text({ size: 14, weight: 700, leading: 16.8 }),
      headline: text({ italic: true }),
      contact: text(),
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
      projects: "Project Experience",
      leadership: "Campus & Community Involvement",
      skills: "Skills",
      awards: "Honors and Awards",
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
      rule: { position: "underline", thickness: 0.5, color: "rule", gap: 1 },
      keepWithNext: true,
    },

    entry: {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "location", role: "body", align: RIGHT_TAB },
          ],
        },
        {
          cells: [
            { bind: "position", role: "entrySubtitle" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
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
            { bind: "location", role: "body", align: RIGHT_TAB },
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
        "\\titleformat{\\section}{\\bfseries\\normalsize}{}{0pt}{\\MakeUppercase}[\\vspace{-9pt}\\rule{\\textwidth}{0.5pt}]",
        "\\titlespacing*{\\section}{0pt}{13.2pt}{2pt}",
        "",
        "\\newcommand{\\entryline}[2]{#1\\hfill#2\\par}",
        "\\setlist[itemize]{leftmargin=36pt, itemsep=0pt, parsep=0pt, topsep=0pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "\\begin{center}\n  {\\large\\bfseries {{name}} }\\\\[3pt]\n  {{contact}}\n\\end{center}\\vspace{13.2pt}",
      section: "\\section*{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "\\entryline{\\textbf{ {{organization}} }}{ {{location}} }\n\\entryline{\\textit{ {{position}} }}{ {{dateRange}} }\n{{summary}}\n{{bullets}}",
        education:
          "\\entryline{\\textbf{ {{organization}} }}{ {{location}} }\n\\entryline{\\textit{ {{position}} }}{ {{dateRange}} }\n{{summary}}\n{{detail}}\n{{bullets}}",
        labeled: "\\textbf{ {{organization}}: } {{summary}}\\par",
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
