/**
 * Jake's Resume — the Overleaf template most engineering students arrive with.
 *
 * Measured off a compiled PDF, which pins the source exactly:
 *
 *   \documentclass[letterpaper,11pt]{article}
 *     — \Huge is 24.79pt and \large is 11.96pt only in the 11pt class
 *   margins      0.5in left and right; the \titlerule runs x = 36 → 576
 *   name         CMBX12 24.79pt, centred at baseline 58.60
 *   contact      CMR10 9.96pt (\small), " | " separators in CMSY10
 *   section      CMCSC10 11.96pt (\large\scshape) with \titlerule 0.398pt
 *                4.38pt below the baseline
 *   entry line 1 CMBX10 10.91pt at x = 46.8 — a 10.8pt indent from the margin
 *   entry line 2 CMTI10 9.96pt, 13.3pt below
 *   bullets      marker at x = 61.5, text at x = 70.8, 13.95pt apart
 *
 * Small caps are synthesised. Computer Modern's true \scshape face is not among
 * the four CMU Serif weights we can redistribute, and synthesising them in the
 * engine keeps the preview, the PDF and the DOCX identical — which shipping a
 * real small-cap face in only one of the three would not.
 */

import type { TemplateDefinition } from "../../core/schema";
import { inch } from "../../core/units";

const SERIF = "serif";

const text = (patch: Partial<TemplateDefinition["typography"]["roles"]["body"]> = {}) => ({
  family: SERIF,
  size: 9.96,
  weight: 400,
  italic: false,
  smallCaps: false,
  allCaps: false,
  color: "ink",
  tracking: 0,
  ...patch,
});

/**
 * Not the right margin.
 *
 * The original sets each entry heading in a tabular* of 0.97 textwidth
 * inside an itemize with a 0.15in left margin, so the right column ends at
 * 46.8 + 0.97 x 540 = 570.6pt, five and a half points short of the 576pt text
 * edge. Every date in the sample confirms it: "Present" starts at 534.91 and is
 * 35.7 wide; "2021" starts at 548.91 and is 21.7 wide. Both land on 570.6.
 */
const RIGHT = { tab: 534.6, tabAlign: "right" } as const;

export const jakes: TemplateDefinition = {
  id: "jakes",
  name: "Jake's Resume",
  version: "1.0.0",
  origin: "latex",

  meta: {
    description:
      "The Overleaf classic. Computer Modern, ruled small-caps headings, tight bullets — the layout most software and engineering recruiters have seen a thousand times, and read quickly.",
    source: "Jake Gutierrez, 'Jake's Resume' (Overleaf template gallery), MIT licence",
    thumbnail: "/templates/jakes/thumb.png",
    original: "/templates/jakes/original.pdf",
    tags: ["latex", "one-page", "technical", "ats-friendly"],
    engine: "pdflatex",
  },

  page: {
    size: "letter",
    // First baseline measured at 53.2pt.
    margin: { top: 53.2, right: inch(0.5), bottom: inch(0.5), left: inch(0.5) },
  },

  typography: {
    families: [
      {
        key: SERIF,
        cssName: "RB CMU Serif",
        faces: {
          "400": "cmuserif-regular.ttf",
          "700": "cmuserif-bold.ttf",
          "400i": "cmuserif-italic.ttf",
          "700i": "cmuserif-bolditalic.ttf",
        },
        substitutes: { original: "Computer Modern", fidelity: "metric" },
      },
    ],
    base: { family: SERIF, size: 9.96, leadingRatio: 1.2, smallCapsScale: 0.8 },
    roles: {
      // `{\Huge \scshape Name}` in bold — CM has no bold small caps, so TeX
      // falls back to CMBX12, which is what the original PDF contains.
      name: text({ size: 24.79, weight: 700, leading: 14.3 }),
      headline: text({ italic: true, leading: 12 }),
      contact: text({ leading: 12 }),
      sectionTitle: text({ size: 11.96, smallCaps: true, leading: 17.9 }),
      entryTitle: text({ size: 10.91, weight: 700, leading: 13.55 }),
      entrySubtitle: text({ italic: true, leading: 13.6 }),
      entryMeta: text({ size: 10.91, leading: 13.55 }),
      body: text({ leading: 13.95 }),
      bullet: text({ size: 5.98 }),
      label: text({ weight: 700, leading: 11.95 }),
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
      "projects",
      "research",
      "publications",
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
      rule: { position: "underline", thickness: 0.398, color: "rule", gap: 4.38 },
      keepWithNext: true,
    },

    entry: {
      // Closing an itemize costs 3.25pt of extra air before whatever follows.
      gapAfter: 3.25,
      rows: [
        {
          indent: 10.8,
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT },
          ],
        },
        {
          indent: 10.8,
          cells: [
            { bind: "position", role: "entrySubtitle" },
            { bind: "location", role: "entrySubtitle", align: RIGHT },
          ],
        },
        { indent: 10.8, cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          gapBefore: 0.3,
          marker: { glyph: "•", x: 25.5, textX: 34.8 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    // Education puts the degree on the left of line two and the dates on the
    // right, mirroring the original's \resumeSubheading argument order.
    "entry.education": {
      gapBefore: 5.0,
      rows: [
        {
          indent: 10.8,
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "location", role: "entryMeta", align: RIGHT },
          ],
        },
        {
          indent: 10.8,
          cells: [
            { bind: "position", role: "entrySubtitle" },
            { bind: "dateRange", role: "entrySubtitle", align: RIGHT },
          ],
        },
        { indent: 10.8, cells: [{ bind: "summary", role: "entrySubtitle", grow: true }] },
        { indent: 10.8, cells: [{ bind: "detail", role: "body", grow: true }] },
        {
          repeat: "bullets",
          gapBefore: 0.3,
          marker: { glyph: "•", x: 25.5, textX: 34.8 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    // \resumeProjectHeading: **Name** | *Tech stack*  …  dates
    "entry.projects": {
      // 2.8pt between entries in total, of which the row's own 2.0pt lead-in
      // supplies most; the same lead-in is what puts the first entry 19.9pt
      // below the heading rather than 17.9.
      gapBefore: 0.8,
      gapAfter: 3.25,
      rows: [
        {
          // The projects macro omits the 2pt of negative space that the
          // experience macro carries, so its first line sits 2pt lower.
          gapBefore: 2.0,
          indent: 10.8,
          cells: [
            { bind: "organization", role: "entryTitle", style: { size: 9.96 } },
            { bind: "tags", role: "tag", prefix: " | ", when: "tags" },
            { bind: "dateRange", role: "entryMeta", align: RIGHT },
          ],
        },
        { indent: 10.8, cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          gapBefore: 0.3,
          marker: { glyph: "•", x: 25.5, textX: 34.8 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    // "**Languages**: Java, Python, C/C++, SQL…" on consecutive lines.
    "entry.labeled": {
      gapBefore: 0,
      rows: [
        {
          indent: 10.8,
          cells: [
            { bind: "organization", role: "label", suffix: ": " },
            { bind: "summary", role: "body", style: { leading: 12 }, grow: true },
          ],
        },
      ],
    },

    "entry.paragraph": {
      rows: [{ indent: 10.8, cells: [{ bind: "section.text", role: "body", grow: true }] }],
    },
  },

  /**
   * Measured baseline to baseline, straight off the original:
   *   name 53.2 → contact 67.5       = 14.3   (name leading)
   *   contact 67.5 → Education 95.2  = 27.7   = 12 + 9.0 + before 6.7
   *   Education 95.2 → entry 113.1   = 17.9   (section title leading)
   *   entry 113.1 → 126.6            = 13.55
   *   bullet to bullet               = 13.95
   *
   * The one subtlety: a section that closes a bullet list needs 3.25pt more
   * before the next heading than one that ends on a plain line, because
   * `
esumeItemListEnd` carries a `space{-5pt}`. Rather than average the two
   * and be wrong twice, `sectionBefore` takes the plain-line value and the
   * bullet-bearing blocks declare the extra as their own `gapAfter` — which
   * then lands every section heading in the document exactly.
   */
  spacing: {
    sectionBefore: 6.7,
    sectionAfter: 0,
    entryGap: 0.8,
    bulletGap: 0,
    headerAfter: 9.0,
  },

  rules: {
    fontScale: { min: 0.88, max: 1.12, step: 0.02 },
    lineSpacing: { min: 0.88, max: 1.2, step: 0.02 },
    spacingSlack: 0.2,
    allowBold: true,
    allowItalic: true,
    allowColor: "none",
    minBodySize: 8.5,
  },

  emit: {
    latex: {
      documentClass: "\\documentclass[letterpaper,11pt]{article}",
      preamble: [
        "\\usepackage{latexsym}",
        "\\usepackage[empty]{fullpage}",
        "\\usepackage{titlesec}",
        "\\usepackage{marvosym}",
        "\\usepackage[usenames,dvipsnames]{color}",
        "\\usepackage{verbatim}",
        "\\usepackage{enumitem}",
        "\\usepackage[hidelinks]{hyperref}",
        "\\usepackage{fancyhdr}",
        "\\usepackage[english]{babel}",
        "\\usepackage{tabularx}",
        "",
        "\\pagestyle{fancy}",
        "\\fancyhf{}",
        "\\renewcommand{\\headrulewidth}{0pt}",
        "\\renewcommand{\\footrulewidth}{0pt}",
        "",
        "\\addtolength{\\oddsidemargin}{-0.5in}",
        "\\addtolength{\\evensidemargin}{-0.5in}",
        "\\addtolength{\\textwidth}{1.0in}",
        "\\addtolength{\\topmargin}{-.5in}",
        "\\addtolength{\\textheight}{1.0in}",
        "",
        "\\urlstyle{same}",
        "\\raggedbottom",
        "\\raggedright",
        "\\setlength{\\tabcolsep}{0in}",
        "",
        "\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]",
        "",
        "% Machine-readable output for applicant tracking systems (pdfTeX only).",
        "\\ifdefined\\pdfgentounicode",
        "  \\input{glyphtounicode}",
        "  \\pdfgentounicode=1",
        "\\fi",
        "",
        "\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}",
        "\\newcommand{\\resumeSubheading}[4]{%",
        "  \\vspace{-2pt}\\item",
        "    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}",
        "      \\textbf{#1} & #2 \\\\",
        "      \\textit{\\small#3} & \\textit{\\small #4} \\\\",
        "    \\end{tabular*}\\vspace{-7pt}",
        "}",
        "\\newcommand{\\resumeProjectHeading}[2]{%",
        "  \\item",
        "    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}",
        "      \\small#1 & #2 \\\\",
        "    \\end{tabular*}\\vspace{-7pt}",
        "}",
        "\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}",
        "\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}",
        "\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}",
        "\\newcommand{\\resumeItemListStart}{\\begin{itemize}}",
        "\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}",
      ].join("\n"),
      document: "\\begin{document}\n\n{{header}}\n\n{{body}}\n\n\\end{document}",
      header:
        "\\begin{center}\n  \\textbf{\\Huge \\scshape {{name}}} \\\\ \\vspace{1pt}\n  \\small {{contact}}\n\\end{center}",
      section: "\\section{ {{title}} }\n  \\resumeSubHeadingListStart\n{{entries}}\n  \\resumeSubHeadingListEnd",
      entry: {
        default:
          "    \\resumeSubheading{ {{organization}} }{ {{dateRange}} }{ {{position}} }{ {{location}} }\n{{bullets}}",
        education:
          "    \\resumeSubheading{ {{organization}} }{ {{location}} }{ {{position}} }{ {{dateRange}} }\n{{summary}}\\par\n{{detail}}\n{{bullets}}",
        projects:
          "    \\resumeProjectHeading{\\textbf{ {{organization}} } $|$ \\emph{ {{tags}} }}{ {{dateRange}} }\n{{bullets}}",
        labeled: "    \\item\\small{\\textbf{ {{organization}} }{: {{summary}} }}",
        paragraph: "    \\item\\small{ {{text}} }",
      },
      bulletsOpen: "      \\resumeItemListStart",
      bullet: "        \\resumeItem{ {{item}} }",
      bulletsClose: "      \\resumeItemListEnd",
    },

    docx: {
      font: "CMU Serif",
      fontFallback: "Latin Modern Roman",
      sectionRule: true,
      bulletChar: "•",
    },
  },
};
