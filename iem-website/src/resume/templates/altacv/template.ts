/**
 * AltaCV — Liantze Lim's two-column CV.
 *
 * The only template here with a sidebar, and the only one with vector
 * furniture: proficiency dots and keyword pills. Both are drawn as real shapes
 * in the preview, the PDF and the DOCX, so they survive export rather than
 * being flattened to a picture.
 *
 * Measured off a compiled PDF:
 *
 *   page      A4, text 35.43 → 559.84
 *   columns   main 35.43 → 329.67 (294.2pt), sidebar 363.69 → 559.84 (196.2pt)
 *             a 34.0pt gutter between them
 *   name      Roboto Slab Bold 24.79, flush left, baseline 62.60
 *   tagline   Lato Bold 11.96 in the accent, baseline 82.53
 *   contact   Font Awesome + Lato 7.97 #666666, 9.46pt leading
 *   heading   Roboto Slab Bold 17.22 #450808 with a #e6d192 rule 4.9pt below
 *   entry     title Lato 11.96 #2e2e2e · company Lato Bold 9.96 accent
 *             date and location Lato 8.97 #666666 behind icons
 *   bullets   marker at 35.4, text at 45.6
 */

import type { TemplateDefinition } from "../../core/schema";

const SANS = "sans";
const SLAB = "slab";
const SIZE = 9.96;
const LEADING = 11.95;

const text = (patch: Partial<TemplateDefinition["typography"]["roles"]["body"]> = {}) => ({
  family: SANS,
  size: SIZE,
  weight: 400,
  italic: false,
  smallCaps: false,
  allCaps: false,
  color: "muted",
  tracking: 0,
  leading: LEADING,
  ...patch,
});

export const altacv: TemplateDefinition = {
  id: "altacv",
  name: "AltaCV",
  version: "1.0.0",
  origin: "latex",

  meta: {
    description:
      "Two columns with a sidebar for strengths, languages and achievements. Proficiency dots and keyword pills are drawn as vectors, so they stay sharp at any size.",
    source: "Liantze Lim, AltaCV, LPPL v1.3c",
    thumbnail: "/templates/altacv/thumb.png",
    original: "/templates/altacv/original.pdf",
    tags: ["latex", "two-column", "accent-colour", "graphical"],
    engine: "xelatex",
  },

  page: {
    size: "a4",
    margin: { top: 62.6, right: 35.44, bottom: 35.44, left: 35.43 },
    columns: [
      { id: "main", width: 0.5611, gap: 34.02 },
      { id: "side", width: 0.3741 },
    ],
  },

  typography: {
    families: [
      {
        key: SANS,
        cssName: "RB Lato",
        faces: {
          "400": "lato-regular.ttf",
          "700": "lato-bold.ttf",
          "400i": "lato-italic.ttf",
        },
      },
      {
        key: SLAB,
        cssName: "RB Roboto Slab",
        faces: { "400": "robotoslab-regular.ttf", "700": "robotoslab-bold.ttf" },
      },
      {
        key: "icon",
        cssName: "RB FA Solid",
        faces: { "400": "fontawesome-solid.ttf", "700": "fontawesome-solid.ttf" },
      },
      {
        key: "iconBrands",
        cssName: "RB FA Brands",
        faces: { "400": "fontawesome-brands.ttf", "700": "fontawesome-brands.ttf" },
      },
    ],
    base: { family: SANS, size: SIZE, leadingRatio: 1.2, smallCapsScale: 0.8 },
    roles: {
      // 19.93pt is the original's single-line advance; a longer name wraps, so
      // the leading has to clear the type or the two lines collide.
      name: text({ family: SLAB, size: 24.79, weight: 700, allCaps: true, color: "ink", leading: 26.5 }),
      headline: text({ size: 11.96, weight: 700, color: "accent", leading: 16.54 }),
      contact: text({ size: 7.97, color: "muted", leading: 9.46 }),
      sectionTitle: text({ family: SLAB, size: 17.22, weight: 700, allCaps: true, color: "heading", leading: 26.83 }),
      entryTitle: text({ size: 11.96, color: "body", leading: 14.94 }),
      entrySubtitle: text({ size: 9.96, weight: 700, color: "accent", leading: 14.94 }),
      entryMeta: text({ size: 8.97, color: "muted", leading: 14.94 }),
      body: text({ leading: 11.95 }),
      bullet: text({ size: 8.97 }),
      label: text({ weight: 700, color: "body" }),
      tag: text({ size: 8.97, color: "muted" }),
      icon: text({ family: "icon", size: 7.97, color: "accent" }),
      footer: text({ size: 8 }),
    },
  },

  palette: {
    ink: "#000000",
    body: "#2e2e2e",
    muted: "#666666",
    accent: "#8f0d0d",
    heading: "#450808",
    rule: "#e6d192",
    faint: "#cccccc",
  },

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
    defaultOrder: ["research", "projects", "education", "skills"],
    aliases: { skills: "Strengths", awards: "Most Proud Of", summary: "My Life Philosophy", research: "Research" },
    titleCase: "upper",
    // The sidebar carries the short, scannable sections.
    sideKinds: ["skills", "awards", "interests", "certifications", "summary", "publications"],
  },

  blocks: {
    header: {
      rows: [
        { cells: [{ bind: "personal.name", role: "name" }] },
        { cells: [{ bind: "personal.headline", role: "headline" }] },
        {
          repeat: "links",
          inline: true,
          separator: "   ",
          cells: [
            { bind: "$link.icon", role: "icon" },
            { bind: "$link.label", role: "contact", prefix: " ", linkFrom: "$link.href" },
          ],
        },
      ],
    },

    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle" }] }],
      rule: { position: "underline", thickness: 1.6, color: "rule", gap: 4.9 },
      keepWithNext: true,
    },

    entry: {
      rows: [
        { cells: [{ bind: "position", role: "entryTitle" }] },
        { cells: [{ bind: "organization", role: "entrySubtitle" }] },
        {
          // Right-aligned rather than tabbed: the same row is laid out in the
          // narrower sidebar, where a fixed stop would sit outside the column.
          cells: [
            { bind: "dateRange", role: "entryMeta" },
            { bind: "location", role: "entryMeta", align: "right" },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        {
          repeat: "bullets",
          gapBefore: 3,
          marker: { glyph: "•", x: 0, textX: 10.2 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.education": {
      rows: [
        { cells: [{ bind: "position", role: "entryTitle" }] },
        { cells: [{ bind: "organization", role: "entrySubtitle" }] },
        { cells: [{ bind: "dateRange", role: "entryMeta" }] },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { cells: [{ bind: "detail", role: "body", grow: true }] },
      ],
    },

    // \cvskill — label on the left, five dots on the right.
    "entry.ratings": {
      gapBefore: 6,
      rows: [
        {
          shape: { kind: "dots", align: "right", total: 5, size: 4.5, gap: 4, color: "accent", mutedColor: "faint" },
          cells: [{ bind: "organization", role: "label" }],
        },
      ],
    },

    // \cvtag — one pill per keyword, wrapping across the column.
    "entry.tags": {
      gapBefore: 4,
      rows: [
        {
          repeat: "tags",
          inline: true,
          separator: "   ",
          cells: [{ bind: "$item", role: "tag" }],
        },
      ],
    },

    "entry.labeled": {
      gapBefore: 2,
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
      rows: [{ cells: [{ bind: "section.text", role: "body", style: { italic: true, color: "accent", size: 11.96 }, grow: true }] }],
    },
  },

  spacing: {
    sectionBefore: 20.1,
    sectionAfter: 0,
    entryGap: 8.6,
    bulletGap: 0,
    headerAfter: 24.55,
  },

  rules: {
    fontScale: { min: 0.9, max: 1.15, step: 0.02 },
    lineSpacing: { min: 0.9, max: 1.25, step: 0.02 },
    spacingSlack: 0.2,
    allowBold: true,
    allowItalic: true,
    allowColor: "accent",
    minBodySize: 8.5,
  },

  emit: {
    latex: {
      documentClass: "\\documentclass[10pt,a4paper,ragged2e,withhyper]{altacv}",
      preamble: [
        "% Requires altacv.cls from github.com/liantze/AltaCV. Compile with xelatex.",
        "\\geometry{left=1.25cm,right=1.25cm,top=1.25cm,bottom=1.25cm,columnsep=1.2cm}",
        "\\usepackage{paracol}",
        "\\usepackage[default]{lato}",
        "",
        "\\definecolor{VividPurple}{HTML}{450808}",
        "\\definecolor{SlateGrey}{HTML}{2E2E2E}",
        "\\definecolor{LightGrey}{HTML}{666666}",
        "\\definecolor{DarkPastelRed}{HTML}{8F0D0D}",
        "\\definecolor{GoldenEarth}{HTML}{E6D192}",
        "\\colorlet{name}{black}",
        "\\colorlet{tagline}{DarkPastelRed}",
        "\\colorlet{heading}{VividPurple}",
        "\\colorlet{headingrule}{GoldenEarth}",
        "\\colorlet{accent}{DarkPastelRed}",
        "\\colorlet{emphasis}{SlateGrey}",
        "\\colorlet{body}{LightGrey}",
        "",
        "\\renewcommand{\\itemmarker}{{\\small\\textbullet}}",
        "\\renewcommand{\\ratingmarker}{\\faCircle}",
      ].join("\n"),
      document:
        "\\begin{document}\n{{header}}\n\\columnratio{0.6}\n\\begin{paracol}{2}\n{{body}}\n\\switchcolumn\n{{side}}\n\\end{paracol}\n\\end{document}",
      header:
        "\\name{ {{name}} }\n\\tagline{ {{headline}} }\n\\personalinfo{ {{contact}} }\n\\makecvheader",
      section: "\\cvsection{ {{title}} }\n{{entries}}",
      entry: {
        default:
          "\\cvevent{ {{position}} }{ {{organization}} }{ {{dateRange}} }{ {{location}} }\n{{bullets}}\n\\divider",
        education:
          "\\cvevent{ {{position}} }{ {{organization}} }{ {{dateRange}} }{ {{location}} }\n{{summary}} {{detail}}\n{{bullets}}\n\\divider",
        ratings: "\\cvskill{ {{organization}} }{ {{rating}} }",
        tags: "\\cvtag{ {{tags}} }",
        labeled: "\\textbf{ {{organization}}: } {{summary}}\\par\\divider",
        paragraph: "\\quote{ {{text}} }",
      },
      bulletsOpen: "\\begin{itemize}",
      bullet: "  \\item {{item}}",
      bulletsClose: "\\end{itemize}",
    },

    docx: {
      font: "Lato",
      fontFallback: "Calibri",
      rightTab: 5884,
      sectionRule: true,
      bulletChar: "•",
    },
  },
};
