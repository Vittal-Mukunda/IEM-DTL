/**
 * UChicago — Career Advancement undergraduate sample (guide p4).
 *
 * A Garamond page whose section headings are synthesised small caps — the
 * first letter at 11.52pt, the rest at 9.0pt — and whose dates live on the
 * title line rather than at a right tab. That last choice is the whole
 * personality of the layout: the reader never has to jump to the margin.
 *
 *   page          612 × 792 pt (US Letter)
 *   text          x = 50.4 → 554.5  (0.7in left, 0.8in right)
 *   first baseline 60.36 — 0.7in plus the ascent of 11.52pt Garamond Bold
 *   body          11.04pt, 12.36pt leading
 *   name          small-caps, centred
 *   headings      small-caps + a hairline underline 0.84pt below the baseline
 *   entry         **Org,** Location / *Title,* dates / `•` bullets at +18pt
 *
 * The original is Adobe Garamond. We ship EB Garamond (OFL) and declare the
 * substitution; advance widths are not identical, so wraps differ and the
 * verifier's unique-word registration is pulled off 1.0. Report the number
 * honestly rather than chasing a metric-compatible face we cannot ship.
 */

import type { TemplateDefinition } from "../../core/schema";

const SERIF = "serif";
const SIZE = 11.04;
const LEADING = 12.36;

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

export const uchicago: TemplateDefinition = {
  id: "uchicago",
  name: "UChicago",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "UChicago Career Advancement's undergraduate sample. Garamond, small-caps headings, dates on the title line — academic without being a CV.",
    source: "University of Chicago Career Advancement — Writing Resumes: A Guide for Undergrads, p4",
    thumbnail: "/templates/uchicago/thumb.png",
    original: "/templates/uchicago/original.pdf",
    tags: ["ats-friendly", "one-page", "academic", "small-caps"],
    engine: "pdflatex",
  },

  page: {
    size: "letter",
    margin: { top: 60.36, right: 57.48, bottom: 50.4, left: 50.4 },
  },

  typography: {
    families: [
      {
        key: SERIF,
        cssName: "RB EB Garamond",
        faces: {
          "400": "ebgaramond-regular.ttf",
          "500": "ebgaramond-medium.ttf",
          "700": "ebgaramond-bold.ttf",
          "400i": "ebgaramond-italic.ttf",
        },
        substitutes: { original: "Adobe Garamond", fidelity: "visual" },
      },
    ],
    // 9.0 / 11.52 = 0.781 — the small-cap scale read off EDUCATION / EXPERIENCE.
    base: { family: SERIF, size: SIZE, leadingRatio: 1.12, smallCapsScale: 0.781 },
    roles: {
      name: text({ size: 11.52, weight: 700, smallCaps: true, leading: 14.28 }),
      headline: text({ italic: true }),
      contact: text({ size: 11.52, leading: 14.28 }),
      // Education heading → first org is 12.48; experience/leadership are 15.48.
      // 15.48 is the repeated value (EXPERIENCE 215.54 → first job 231.02).
      sectionTitle: text({ size: 11.52, weight: 700, smallCaps: true, leading: 15.48 }),
      entryTitle: text({ weight: 700 }),
      entrySubtitle: text({ italic: true }),
      entryMeta: text(),
      body: text(),
      bullet: text(),
      label: text({ weight: 700, size: 11.52 }),
      tag: text(),
      icon: text(),
      footer: text({ size: 9 }),
    },
  },

  palette: { ink: "#000000", muted: "#000000", accent: "#800000", rule: "#000000" },

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
      research: "Research Experience",
      projects: "Projects",
      skills: "Technical Skills",
      leadership: "Leadership & Activities",
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
          separator: "  |  ",
          cells: [{ bind: "$link.label", role: "contact", align: "center", linkFrom: "$link.href" }],
        },
      ],
    },

    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle" }] }],
      // Heading 103.10 → rule 103.94. The original stroke is a hairline.
      rule: { position: "underline", thickness: 0.4, color: "rule", gap: 0.84 },
      keepWithNext: true,
    },

    // **Org,** Location
    // *Title,* dates
    // • bullet
    entry: {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle", suffix: ", " },
            { bind: "location", role: "body" },
          ],
        },
        {
          cells: [
            { bind: "position", role: "entrySubtitle" },
            { bind: "dateRange", role: "entryMeta", prefix: ", ", when: "dateRange" },
          ],
        },
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
        {
          cells: [
            { bind: "organization", role: "entryTitle", suffix: ", " },
            { bind: "location", role: "body" },
          ],
        },
        {
          cells: [
            { bind: "position", role: "entrySubtitle" },
            { bind: "dateRange", role: "entryMeta", prefix: ", ", when: "dateRange" },
          ],
        },
        { cells: [{ bind: "summary", role: "body", prefix: "GPA: ", grow: true }] },
        { cells: [{ bind: "detail", role: "body", prefix: "Honors: ", grow: true }] },
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

  /**
   *   name 60.36 → contact 74.64            = 14.28  (name leading)
   *   contact 74.64 → EDUCATION 103.10      = 28.46  = 14.28 + sectionBefore 14.18
   *   last honors 189.74 → EXPERIENCE 215.54 = 25.80  ≈ body leading + sectionBefore
   *   between education entries             = 24.72  ≈ 2 × 12.36
   */
  spacing: {
    sectionBefore: 14.18,
    sectionAfter: 0,
    entryGap: 12.36,
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
        "\\usepackage[top=0.84in,bottom=0.7in,left=0.7in,right=0.8in]{geometry}",
        "\\IfFileExists{ebgaramond.sty}{\\usepackage{ebgaramond}}{}",
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
        "\\titleformat{\\section}{\\bfseries\\scshape\\normalsize}{}{0pt}{}[\\vspace{-10pt}\\rule{\\textwidth}{0.4pt}]",
        "\\titlespacing*{\\section}{0pt}{14.18pt}{3pt}",
        "",
        "\\setlist[itemize]{leftmargin=18pt, itemsep=0pt, parsep=0pt, topsep=0pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "\\begin{center}\n  {\\bfseries\\scshape {{name}} }\\\\[2.8pt]\n  {{contact}}\n\\end{center}",
      section: "\\section*{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "{\\textbf{ {{organization}}, } {{location}} }\\par\n{\\textit{ {{position}} }, {{dateRange}} }\\par\n{{bullets}}",
        education:
          "{\\textbf{ {{organization}}, } {{location}} }\\par\n{\\textit{ {{position}} }, {{dateRange}} }\\par\n{{summary}}\\par\n{{detail}}\\par\n{{bullets}}",
        labeled: "\\textbf{ {{organization}}: } {{summary}}\\par",
        paragraph: "{{text}}\\par",
      },
      bulletsOpen: "\\begin{itemize}",
      bullet: "  \\item {{item}}",
      bulletsClose: "\\end{itemize}",
    },

    docx: {
      font: "EB Garamond",
      fontFallback: "Garamond",
      sectionRule: true,
      bulletChar: "•",
    },
  },
};
