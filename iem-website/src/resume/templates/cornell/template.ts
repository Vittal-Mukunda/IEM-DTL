/**
 * Cornell — College of Human Ecology Career Exploration Center
 * "Writing Resumes" schematic (August 2024 guide, page 2).
 *
 * Measured off the published page:
 *
 *   page          612 × 792 pt (US Letter)
 *   text          x = 36 → 576  (0.5in)
 *   name          Times 18pt bold, centred (first baseline 48.19)
 *   contact       Times 11pt bold, centred, +13.2
 *   headings      Times 14pt bold, Title Case, 2pt rule 2.68pt below baseline
 *   body          Times 11pt, 13.2pt leading
 *   experience    **Company**, City, State  …  dates at the right tab
 *                 italic Position; bullets at the left edge, text +18pt
 *   dates         em dash, "Month 20XX — Present"
 */

import type { TemplateDefinition } from "../../core/schema";
import { inch } from "../../core/units";

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

const RIGHT_TAB = { tab: 540, tabAlign: "right" } as const;

export const cornell: TemplateDefinition = {
  id: "cornell",
  name: "Cornell University",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "Cornell Human Ecology's career-centre schematic. An 18pt centred name, 14pt ruled headings, italic titles, and an em dash in the dates.",
    source: "Cornell College of Human Ecology Career Exploration Center — Writing Resumes (August 2024), p2",
    thumbnail: "/templates/cornell/thumb.png",
    original: "/templates/cornell/original.pdf",
    tags: ["ats-friendly", "one-page", "classic", "ruled-headings"],
    engine: "pdflatex",
  },

  page: {
    size: "letter",
    margin: { top: 48.19, right: inch(0.5), bottom: inch(0.5), left: inch(0.5) },
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
      name: text({ size: 18, weight: 700, leading: 13.2 }),
      headline: text({ italic: true }),
      contact: text({ weight: 700 }),
      sectionTitle: text({ size: 14, weight: 700, leading: 16.8 }),
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

  palette: { ink: "#030405", muted: "#030405", accent: "#030405", rule: "#221f1f" },

  conventions: { dateDash: "—" },

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
      leadership: "Extracurricular Activities",
      skills: "Technical Skills",
      awards: "Honors and Awards",
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
          separator: " · ",
          cells: [{ bind: "$link.label", role: "contact", align: "center", linkFrom: "$link.href" }],
        },
      ],
    },

    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle" }] }],
      rule: { position: "underline", thickness: 2, color: "rule", gap: 2.68 },
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
          marker: { glyph: "•", x: 0, textX: 18 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.education": {
      rows: [
        { cells: [{ bind: "organization", role: "body", grow: true }] },
        { cells: [{ bind: "position", role: "body", grow: true }] },
        {
          cells: [
            { bind: "summary", role: "body", grow: true },
            { bind: "dateRange", role: "entryMeta", align: RIGHT_TAB },
          ],
        },
        { cells: [{ bind: "detail", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 0, textX: 18 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.labeled": {
      gapBefore: 0,
      rows: [
        {
          marker: { glyph: "•", x: 0, textX: 18 },
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
        "\\titleformat{\\section}{\\bfseries\\large}{}{0pt}{}[\\vspace{-6pt}\\rule{\\textwidth}{2pt}]",
        "\\titlespacing*{\\section}{0pt}{13.2pt}{4pt}",
        "",
        "\\newcommand{\\entryline}[2]{#1\\hfill#2\\par}",
        "\\setlist[itemize]{leftmargin=18pt, itemsep=0pt, parsep=0pt, topsep=0pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "\\begin{center}\n  {\\LARGE\\bfseries {{name}} }\\\\[2pt]\n  \\textbf{ {{contact}} }\n\\end{center}\\vspace{13.2pt}",
      section: "\\section*{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "\\entryline{\\textbf{ {{organization}} }, {{location}} }{ {{dateRange}} }\n\\textit{ {{position}} }\\par\n{{bullets}}",
        education:
          "{{organization}}\\par\n{{position}}\\par\n\\entryline{ {{summary}} }{ {{dateRange}} }\n{{detail}}\n{{bullets}}",
        labeled: "\\begin{itemize}\\item \\textbf{ {{organization}}: } {{summary}}\\end{itemize}",
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
