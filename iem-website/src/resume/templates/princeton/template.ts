/**
 * Princeton — Center for Career Development "Early College Resume"
 * (Tori Tiger sample, Resume Guide p8).
 *
 * Measured off the published guide page. The résumé itself is full-size
 * EB Garamond 11pt; the Avenir/Rasa banner above it is chapter chrome and is
 * filtered out by verify.json. Every number below is a baseline-to-baseline
 * reading, with no ascent arithmetic.
 *
 *   page          612 × 792 pt (US Letter)
 *   text          x = 41.0 → 572.4  (content width 531.4)
 *   body          EB Garamond Medium 11pt, 13.2pt leading
 *   name          EB Garamond Bold 13pt, centred
 *   headings      Bold 11pt ALL CAPS + 0.5pt underline, 5.96pt below baseline
 *   entry         **Org – Title** left / dates right; `•` bullets at +18pt
 *   section gap   26.4pt after a plain line, 39.6pt after a bullet list —
 *                 the extra 13.2 lives on the bullet-bearing block as gapAfter
 *
 * The original's first heading sits 22.0pt below the contact line (not the
 * 26.4 inter-section rhythm). Contact leading 8.8 + sectionBefore 13.2 is
 * that 22.0; the last-line leading of later sections supplies the rest of
 * each 26.4/39.6 gap. Dates in the sample are written "September 2022-Present"
 * with no spaces around the dash — formatDateRange inserts spaces, so the
 * replication fixture stores the original strings so the verifier can match
 * them. EB Garamond ligatures split "effective" in the PDF extract; that is
 * a face quirk, not a layout error.
 *
 * Verification (guide page, registration scale 1.000×1.0, offset (0, -82)pt):
 * 97.1% text placement, 94.6% ink overlap, 0.37pt RMS. Remaining residuals
 * are date tab drift of ~3pt and EB Garamond ligature splits ("effective").
 */

import type { TemplateDefinition } from "../../core/schema";
import { inch } from "../../core/units";

const SERIF = "serif";
const SIZE = 11;
const LEADING = 13.2;

const text = (patch: Partial<TemplateDefinition["typography"]["roles"]["body"]> = {}) => ({
  family: SERIF,
  size: SIZE,
  weight: 500,
  italic: false,
  smallCaps: false,
  allCaps: false,
  color: "ink",
  tracking: 0,
  leading: LEADING,
  ...patch,
});

export const princeton: TemplateDefinition = {
  id: "princeton",
  name: "Princeton",
  version: "1.0.0",
  origin: "word",

  meta: {
    description:
      "Princeton CCD's early-college sample. Centred name, ruled all-caps headings, organisation and title on one line — a conservative, ATS-safe layout.",
    source: "Princeton Center for Career Development — Resume Guide, 'Early College Resume' (Tori Tiger), p8",
    thumbnail: "/templates/princeton/thumb.png",
    original: "/templates/princeton/original.pdf",
    tags: ["ats-friendly", "one-page", "classic", "ruled-headings"],
    engine: "pdflatex",
  },

  page: {
    size: "letter",
    // First baseline of a standalone page: 0.5in plus the 13.09pt ascent of
    // 13pt EB Garamond Bold. The guide page puts the same name at y=131.17
    // under a banner; the verifier recovers that offset.
    margin: { top: 49.1, right: 39.6, bottom: inch(0.5), left: 41.0 },
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
      },
    ],
    base: { family: SERIF, size: SIZE, leadingRatio: 1.2, smallCapsScale: 0.8 },
    roles: {
      name: text({ size: 13, weight: 700, leading: 15.6 }),
      headline: text({ italic: true }),
      // Contact is 13pt like the name (forensics), not 11pt body. Its leading
      // is the remainder of contact→EDUCATION 22.0 after sectionBefore 13.2.
      contact: text({ size: 13, leading: 8.8 }),
      sectionTitle: text({ weight: 700, allCaps: true, leading: 23.0 }),
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

  palette: { ink: "#231f20", muted: "#231f20", accent: "#f58025", rule: "#221f1f" },

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
      leadership: "Leadership and Service",
      skills: "Skills",
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
          separator: " / ",
          cells: [{ bind: "$link.label", role: "contact", align: "center", linkFrom: "$link.href" }],
        },
      ],
    },

    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle" }] }],
      // Heading baseline 168.77 → rule 174.73 = 5.96pt. Thickness 0.5pt.
      rule: { position: "underline", thickness: 0.5, color: "rule", gap: 5.96 },
      keepWithNext: true,
    },

    // "Firestone Library, Princeton University – Student Assistant"  …  dates
    // gapAfter 13.2 is the extra blank line a bullet list leaves before the
    // next *section* and, with entryGap 0, also the 26.4 between two
    // experience entries (13.2 last-line leading + 13.2 gapAfter).
    entry: {
      gapAfter: 13.2,
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "position", role: "entryTitle", prefix: " – ", when: "position" },
            { bind: "dateRange", role: "entryMeta", align: "right" },
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
      gapBefore: 13.2,
      gapAfter: 0,
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle", suffix: ", " },
            { bind: "location", role: "body" },
            { bind: "dateRange", role: "entryMeta", align: "right" },
          ],
        },
        { cells: [{ bind: "position", role: "body", grow: true }] },
        { cells: [{ bind: "summary", role: "body", prefix: "Honors: ", grow: true }] },
        { cells: [{ bind: "detail", role: "body", prefix: "Relevant Coursework: ", grow: true }] },
        {
          repeat: "bullets",
          marker: { glyph: "•", x: 0, textX: 18 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.labeled": {
      gapBefore: 0,
      gapAfter: 0,
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

  /**
   * Baseline-to-baseline, last-line leading already counted:
   *   contact 146.77 → EDUCATION 168.77 = 22.0  (= contact leading 8.8 + sectionBefore 13.2)
   *   last education 270.97 → WORK 297.37     = 26.4  (= 13.2 leading + 13.2 sectionBefore)
   *   last work bullet 425.97 → LEADERSHIP 465.57 = 39.6  (= 13.2 + gapAfter 13.2 + sectionBefore 13.2)
   *   between work entries 346.77 → 373.17    = 26.4  (= 13.2 leading + gapAfter 13.2)
   *   between education    231.37 → 257.77    = 26.4  (= 13.2 leading + education gapBefore 13.2)
   *
   * entryGap is 0 because experience/leadership already separate themselves
   * with gapAfter; adding both was the 13.2pt extra that stretched the page
   * and pulled registration scaleY to 1.19.
   */
  spacing: {
    sectionBefore: 13.2,
    sectionAfter: 0,
    entryGap: 0,
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
        "\\usepackage[top=0.68in,bottom=0.5in,left=0.57in,right=0.55in]{geometry}",
        "\\IfFileExists{ebgaramond.sty}{\\usepackage{ebgaramond}}{}",
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
        "\\titleformat{\\section}{\\bfseries\\normalsize}{}{0pt}{\\MakeUppercase}[\\vspace{-8pt}\\rule{\\textwidth}{0.5pt}]",
        "\\titlespacing*{\\section}{0pt}{26.4pt}{5pt}",
        "",
        "\\newcommand{\\entryline}[2]{#1\\hfill#2\\par}",
        "\\setlist[itemize]{leftmargin=18pt, itemsep=0pt, parsep=0pt, topsep=0pt, label=\\textbullet}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n{{body}}\n\\end{document}",
      header:
        "\\begin{center}\n  {\\large\\bfseries {{name}} }\\\\[2.6pt]\n  {{contact}}\n\\end{center}",
      section: "\\section*{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "\\entryline{\\textbf{ {{organization}} } -- \\textbf{ {{position}} }}{ {{dateRange}} }\n{{bullets}}\\vspace{13.2pt}",
        education:
          "\\entryline{\\textbf{ {{organization}}, } {{location}} }{ {{dateRange}} }\n{{position}}\\par\n{{summary}}\\par\n{{detail}}\\par\n{{bullets}}",
        labeled: "\\begin{itemize}\\item \\textbf{ {{organization}}: } {{summary}}\\end{itemize}",
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
