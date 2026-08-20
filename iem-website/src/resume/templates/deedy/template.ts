/**
 * Deedy Resume — Debarghya Das's two-column XeLaTeX template (OpenFonts).
 *
 * The layout the original actually compiles to:
 *
 *   \usepackage[hmargin=1.25cm, vmargin=0.75cm]{geometry}
 *   \begin{minipage}[t]{0.33\textwidth} … \end{minipage}\hfill
 *   \begin{minipage}[t]{0.66\textwidth} …
 *
 * Measured off the author's compiled OpenFonts PDF:
 *
 *   page          612 × 792 pt (US Letter)
 *   margins       35.43pt (1.25cm) left and right
 *   columns       side 0.33 (x=35.43, 178.6pt) + 3.5pt gap + main 0.6635
 *                 main starts at x=217.5, runs to 576.6
 *   name          Lato Hairline 39.85 + Lato Light 39.85, centred at y=49.95
 *   contact       Raleway Medium 10.96 #6a6a6a, two centred lines
 *   name rule     0.398pt #6a6a6a at y=95.63 — original is paperwidth; we
 *                 can only draw the text column (the engine has no page-bleed)
 *   headings      Lato Light 15.94 #6a6a6a, all caps, no rule
 *   org           Lato Bold 11.95 #333333, all caps
 *   title         Raleway Medium 10.96, prefixed "| " on experience rows
 *   dates         Raleway Medium 9.96 #6a6a6a
 *   body          Lato Light 9.96 #2b2b2b, 11.95pt leading
 *   bullets       marker at +14.1, text at +24.9 from the main column edge
 *
 * What still cannot be expressed from data, so they are not fudged:
 *
 *   1. The original sets the first name in Hairline and the last name in Light.
 *      We have one `personal.name` slot. The whole name is Thin (Google Fonts'
 *      closest OFL stand-in for Hairline).
 *   2. `\lastupdated` prints "Last Updated on …" in the top-right. There is no
 *      binding for it; it will show up as unmatched original text.
 *   3. The original hard-wraps the contact line. The replication fixture puts
 *      the first wrapped line in `personal.headline`; a student's tagline uses
 *      the same row.
 *
 * Main-column baselines (name 49.95, contact 71.91/83.87, EXPERIENCE 121.53,
 * FACEBOOK 138.44, RESEARCH 427.35) match the forensics to a few tenths of a
 * point once the first sidebar heading keeps `sectionBefore`.
 */

import type { TemplateDefinition } from "../../core/schema";
import { cm } from "../../core/units";

const SANS = "sans";
const DISPLAY = "display";
const SIZE = 9.96;
const LEADING = 11.95;

const text = (patch: Partial<TemplateDefinition["typography"]["roles"]["body"]> = {}) => ({
  family: SANS,
  size: SIZE,
  weight: 300,
  italic: false,
  smallCaps: false,
  allCaps: false,
  color: "ink",
  tracking: 0,
  leading: LEADING,
  ...patch,
});

export const deedy: TemplateDefinition = {
  id: "deedy",
  name: "Deedy",
  version: "1.0.0",
  origin: "latex",

  meta: {
    description:
      "The two-column Overleaf favourite. A huge thin name, a narrow skills column, a wide experience column — dense enough for one page of engineering work.",
    source: "Debarghya Das, Deedy-Resume OpenFonts v1.2 (MIT licence)",
    thumbnail: "/templates/deedy/thumb.png",
    original: "/templates/deedy/original.pdf",
    tags: ["latex", "two-column", "technical", "one-page"],
    engine: "xelatex",
  },

  page: {
    size: "letter",
    // Name baseline measured at 49.95. Hairline/Thin at 40pt has a 39pt
    // ascent, so the glyphs reach to ~11pt from the page top — the same
    // Jake's-style overlap of a large name with a small top margin.
    margin: { top: 49.95, right: cm(1.25), bottom: cm(0.75), left: 35.43 },
    columns: [
      { id: "side", width: 0.33, gap: 3.5 },
      { id: "main", width: 0.6635 },
    ],
  },

  typography: {
    families: [
      {
        key: SANS,
        cssName: "RB Lato",
        faces: {
          "100": "lato-thin.ttf",
          "300": "lato-light.ttf",
          "400": "lato-regular.ttf",
          "700": "lato-bold.ttf",
          "300i": "lato-lightitalic.ttf",
          "400i": "lato-italic.ttf",
        },
        substitutes: { original: "Lato Hairline (name)", fidelity: "visual" },
      },
      {
        key: DISPLAY,
        cssName: "RB Raleway",
        faces: {
          "200": "raleway-extralight.ttf",
          "500": "raleway-medium.ttf",
        },
      },
    ],
    base: { family: SANS, size: SIZE, leadingRatio: 1.2, smallCapsScale: 0.8 },
    roles: {
      name: text({ size: 39.85, weight: 100, color: "black", leading: 21.96 }),
      headline: text({ family: DISPLAY, size: 10.96, weight: 500, color: "headings", leading: 11.96 }),
      contact: text({ family: DISPLAY, size: 10.96, weight: 500, color: "headings", leading: 11.96 }),
      sectionTitle: text({ size: 15.94, color: "headings", allCaps: true, leading: 16.91 }),
      entryTitle: text({ size: 11.95, weight: 700, color: "subheadings", allCaps: true, leading: 12.95 }),
      entrySubtitle: text({ family: DISPLAY, size: 10.96, weight: 500, color: "subheadings", allCaps: true, leading: 11.95 }),
      entryMeta: text({ family: DISPLAY, size: 9.96, weight: 500, color: "headings", leading: 11.95 }),
      body: text(),
      bullet: text(),
      label: text({ size: 11.95, weight: 700, color: "subheadings", allCaps: true, leading: 12.95 }),
      tag: text({ family: DISPLAY, weight: 500, color: "headings" }),
      icon: text(),
      footer: text({ size: 8 }),
    },
  },

  palette: {
    ink: "#2b2b2b",
    black: "#000000",
    headings: "#6a6a6a",
    subheadings: "#333333",
    muted: "#666666",
    accent: "#333333",
    rule: "#6a6a6a",
  },

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
    aliases: { skills: "Skills", awards: "Awards", research: "Research" },
    titleCase: "as-is",
    sideKinds: ["education", "skills", "interests", "certifications", "summary"],
  },

  blocks: {
    header: {
      rows: [
        { cells: [{ bind: "personal.name", role: "name", align: "center" }] },
        { cells: [{ bind: "personal.headline", role: "contact", align: "center" }] },
        {
          repeat: "links",
          inline: true,
          separator: " | ",
          cells: [{ bind: "$link.label", role: "contact", align: "center", linkFrom: "$link.href" }],
        },
      ],
      // Contact baseline 83.87 → rule 95.63 = 11.76pt. Original rule is
      // paperwidth; we draw the text column.
      rule: { position: "underline", thickness: 0.398, color: "rule", gap: 11.76, width: "full" },
    },

    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle" }] }],
      keepWithNext: true,
    },

    // \runsubsection{Facebook}\descript{| Software Engineer}
    // \location{Jan 2015 - Present | New York, NY}
    entry: {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "position", role: "entrySubtitle", prefix: "| ", when: "position" },
          ],
        },
        {
          cells: [
            { bind: "dateRange", role: "entryMeta" },
            { bind: "location", role: "entryMeta", prefix: " | ", when: "location" },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 14.1, textX: 24.9 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.education": {
      rows: [
        { cells: [{ bind: "organization", role: "entryTitle" }] },
        { cells: [{ bind: "position", role: "entrySubtitle" }] },
        {
          cells: [
            { bind: "dateRange", role: "entryMeta" },
            { bind: "location", role: "entryMeta", prefix: " | ", when: "location" },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { cells: [{ bind: "detail", role: "entryMeta", grow: true }] },
        { repeat: "bullets", cells: [{ bind: "$item", role: "body", grow: true }] },
      ],
    },

    "entry.projects": {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "tags", role: "tag", prefix: "| ", when: "tags" },
          ],
        },
        {
          cells: [
            { bind: "dateRange", role: "entryMeta" },
            { bind: "location", role: "entryMeta", prefix: " | ", when: "location" },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 14.1, textX: 24.9 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.awards": {
      gapBefore: 0,
      rows: [
        {
          cells: [
            // Original years start at main+6 (x=223.5), they are not right-tabs.
            // Right-aligning "2014" to that stop put it at x=200 and into the sidebar.
            { bind: "dateRange", role: "body", align: { tab: 6 } },
            { bind: "position", role: "body", align: { tab: 41 } },
            { bind: "organization", role: "body", align: { tab: 107.4 } },
          ],
        },
      ],
    },

    "entry.publications": {
      rows: [
        {
          cells: [
            { bind: "organization", role: "body" },
            { bind: "summary", role: "body", prefix: " ", grow: true },
          ],
        },
      ],
    },

    // Coursework: a bold group title plus a tight un-marked list.
    "entry.custom": {
      rows: [
        { cells: [{ bind: "organization", role: "entryTitle" }] },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { repeat: "bullets", cells: [{ bind: "$item", role: "body", grow: true }] },
      ],
    },

    // Links in the sample (`Facebook:// dd`) — kind is `interests` so this
    // block wins over `entry.labeled` / `entry.custom`. Consecutive lines,
    // no extra entry gap; the 11.95pt body leading is the whole rhythm.
    "entry.interests": {
      gapBefore: 0,
      rows: [
        {
          cells: [
            { bind: "organization", role: "body", style: { allCaps: false } },
            { bind: "summary", role: "body", prefix: " ", style: { weight: 400 } },
          ],
        },
      ],
    },

    // Student skills stay one line (`Languages  Python, C++`) so the example
    // résumé still fits a page. The original sample splits Programming / Over
    // 5000 lines / language lists into separate entries instead.
    "entry.labeled": {
      gapBefore: 0,
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle", suffix: "  " },
            { bind: "summary", role: "body", style: { weight: 400, allCaps: false }, grow: true },
          ],
        },
        { cells: [{ bind: "detail", role: "entryMeta", grow: true }] },
      ],
    },

    "entry.paragraph": {
      rows: [{ cells: [{ bind: "section.text", role: "body", grow: true }] }],
    },
  },

  /**
   *   name 49.95 → contact 71.91     = 21.96  (name leading)
   *   contact 71.91 → 83.87          = 11.96
   *   contact 83.87 → EDUCATION 121.53 = 37.66
   *     = contact leading 11.96 + headerAfter 5.7 + sectionBefore 20.0
   *   \sectionsep is 8pt, which is the gap between entries of one section.
   */
  spacing: {
    sectionBefore: 20.0,
    sectionAfter: 0,
    entryGap: 8.0,
    bulletGap: 0,
    headerAfter: 5.7,
  },

  rules: {
    fontScale: { min: 0.88, max: 1.12, step: 0.02 },
    lineSpacing: { min: 0.88, max: 1.2, step: 0.02 },
    spacingSlack: 0.2,
    allowBold: true,
    allowItalic: true,
    allowColor: "none",
    minBodySize: 8,
  },

  emit: {
    latex: {
      documentClass: "\\documentclass[]{deedy-resume-openfont}",
      preamble: [
        "% Requires deedy-resume-openfont.cls from github.com/deedy/Deedy-Resume.",
        "% Compile with xelatex.",
        "\\usepackage{fancyhdr}",
        "\\pagestyle{fancy}",
        "\\fancyhf{}",
      ].join("\n"),
      document:
        "\\begin{document}\n{{header}}\n\\begin{minipage}[t]{0.33\\textwidth}\n{{side}}\n\\end{minipage}\\hfill\n\\begin{minipage}[t]{0.66\\textwidth}\n{{body}}\n\\end{minipage}\n\\end{document}",
      header:
        "\\namesection{ {{name}} }{}{ {{contact}} }\n",
      section: "\\section{ {{title}} }\n{{entries}}\\sectionsep\n",
      entry: {
        default:
          "\\runsubsection{ {{organization}} }\n\\descript{| {{position}} }\n\\location{ {{dateRange}} | {{location}} }\n{{bullets}}\\sectionsep\n",
        education:
          "\\subsection{ {{organization}} }\n\\descript{ {{position}} }\n\\location{ {{dateRange}} | {{location}} }\n{{summary}}\\\\{{detail}}\n{{bullets}}\\sectionsep\n",
        labeled: "\\subsection{ {{organization}} }\n\\location{ {{detail}} }\n{{summary}}\\sectionsep\n",
        paragraph: "{{text}}\\par",
      },
      bulletsOpen: "\\begin{tightemize}",
      bullet: "  \\item {{item}}",
      bulletsClose: "\\end{tightemize}",
    },

    docx: {
      font: "Lato",
      fontFallback: "Calibri",
      sectionRule: true,
      bulletChar: "•",
    },
  },
};
