/**
 * Columbia IEOR — required one-page Word résumé.
 *
 * The CCE annotated sample this layout started from is sans-serif (Avenir /
 * Libre Franklin) with flush-left ALL-CAPS headings that end in a colon. That
 * structure stays: no rules, colon after each heading, organisation / location
 * / date on one line, italic title below.
 *
 * The typeface does not. Columbia IEOR's published required format for the
 * MSOR résumé book (and for applications that follow it) allows only Times New
 * Roman, Arial, Calibri, Garamond or Tahoma, one family, body 10–12pt, name
 * largest, US Letter, margins ≥ 0.5in, Microsoft Word. Tinos stands in for
 * Times New Roman at identical widths; Word export asks for Times New Roman.
 *
 *   name      Tinos Bold 14pt, centred, all caps
 *   contact   Tinos 10pt, centred
 *   heading   Tinos Bold 12pt, all caps, trailing colon
 *   body      Tinos 10pt
 */

import type { TemplateDefinition } from "../../core/schema";
import { inch } from "../../core/units";

const SERIF = "serif";
const SIZE = 10;
const LEADING = 12;

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

export const columbia: TemplateDefinition = {
  id: "columbia",
  name: "Columbia University",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "Columbia IEOR required format: Times, 10pt body, US Letter, 0.5in margins, one page. Colon headings from the CCE sample; typeface from the IEOR résumé-book rules.",
    source: "Columbia IEOR Required Resume Format + CCE Resume Example (annotated)",
    thumbnail: "/templates/columbia/thumb.png",
    original: "/templates/columbia/original.pdf",
    tags: ["times", "one-page", "ats-friendly", "ieor-required"],
    engine: "pdflatex",
  },

  page: {
    size: "letter",
    margin: { top: 46, right: inch(0.5), bottom: inch(0.5), left: inch(0.5) },
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
      name: text({ size: 14, weight: 700, allCaps: true, leading: 16 }),
      headline: text({ italic: true }),
      contact: text({ size: 10, leading: 12 }),
      sectionTitle: text({ size: 12, weight: 700, allCaps: true, leading: 16 }),
      entryTitle: text({ weight: 700 }),
      entrySubtitle: text({ italic: true }),
      entryMeta: text(),
      body: text(),
      bullet: text(),
      label: text({ weight: 700 }),
      tag: text({ italic: true }),
      icon: text(),
      footer: text({ size: 10 }),
    },
  },

  palette: { ink: "#000000", muted: "#000000", accent: "#00447c", rule: "#000000" },

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
      experience: "Experience",
      research: "Research Experience",
      projects: "Projects",
      leadership: "Leadership & Projects",
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
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle", suffix: ":" }] }],
      keepWithNext: true,
    },

    entry: {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle", suffix: "," },
            { bind: "location", role: "body", prefix: " " },
            { bind: "dateRange", role: "entryMeta", align: "right" },
          ],
        },
        { cells: [{ bind: "position", role: "entrySubtitle" }] },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          gapBefore: 1.05,
          marker: { glyph: "•", x: 13.9, textX: 28.1 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.education": {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle", suffix: "," },
            { bind: "location", role: "body", prefix: " " },
            { bind: "dateRange", role: "entryMeta", align: "right" },
          ],
        },
        { cells: [{ bind: "position", role: "body", grow: true }] },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { cells: [{ bind: "detail", role: "body", grow: true }] },
        {
          repeat: "bullets",
          gapBefore: 1.05,
          marker: { glyph: "•", x: 13.9, textX: 28.1 },
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
    sectionBefore: 14.7,
    sectionAfter: 0,
    entryGap: 14.22,
    bulletGap: 0,
    headerAfter: 18.9,
  },

  rules: {
    fontScale: { min: 0.9, max: 1.12, step: 0.02 },
    lineSpacing: { min: 0.9, max: 1.2, step: 0.02 },
    spacingSlack: 0.15,
    allowBold: true,
    allowItalic: true,
    allowColor: "accent",
    minBodySize: 10,
  },

  emit: {
    latex: {
      documentClass: "\\documentclass[letterpaper,10pt]{article}",
      preamble: [
        "\\usepackage[margin=0.5in]{geometry}",
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
        "% Flush-left caps heading with a trailing colon, no rule.",
        "\\titleformat{\\section}{\\bfseries\\large}{}{0pt}{\\MakeUppercase}[]",
        "\\titlespacing*{\\section}{0pt}{14.7pt}{2pt}",
        "",
        "\\newcommand{\\entryline}[2]{#1\\hfill#2\\par}",
        "\\setlist[itemize]{leftmargin=28.1pt, itemsep=0pt, parsep=0pt, topsep=1.05pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "\\begin{center}\n  {\\large\\bfseries\\MakeUppercase{ {{name}} }}\\\\[2pt]\n  {{contact}}\n\\end{center}\n\\vspace{6pt}",
      section: "\\section*{ {{title}}: }\n{{entries}}",
      entry: {
        default:
          "\\entryline{\\textbf{ {{organization}}, } {{location}} }{ {{dateRange}} }\n\\textit{ {{position}} }\\par\n{{bullets}}\n\\vspace{14.22pt}",
        education:
          "\\entryline{\\textbf{ {{organization}}, } {{location}} }{ {{dateRange}} }\n{{position}}\\par\n{{summary}}\\par\n{{detail}}\\par\n{{bullets}}\n\\vspace{14.22pt}",
        labeled: "\\textbf{ {{organization}}: } {{summary}}\\par",
        paragraph: "{{text}}\\par",
      },
      bulletsOpen: "\\begin{itemize}",
      bullet: "  \\item {{item}}",
      bulletsClose: "\\end{itemize}",
    },

    docx: {
      font: "Times New Roman",
      sectionRule: false,
      bulletChar: "•",
    },
  },
};
