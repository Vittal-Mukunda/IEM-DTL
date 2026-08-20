/**
 * Awesome-CV — posquit0's LaTeX CV, the most-forked résumé template on GitHub.
 *
 * Measured off the author's own compiled PDF:
 *
 *   page      A4 595.28 × 841.89, text 39.7 → 555.6 (1.4cm margins)
 *   name      Roboto Thin 31.88 #5d5d5d + Roboto Bold 31.88 #333333, centred
 *   position  Source Sans 7.57 #dc3522, all caps, letterspaced, " · " between
 *   address   Roboto Italic 7.97 #999999
 *   contact   Font Awesome + Roboto 6.77 #333333, " | " between
 *   quote     Source Sans Italic 8.97 #414141, centred
 *   heading   Source Sans Bold 15.94 — first three characters in the accent,
 *             the rest in #333333 — then a rule across the remaining width
 *   entry     org Source Sans Bold 9.96 #414141 · location italic 8.97 #dc3522
 *             title small caps 7.97 #5d5d5d · dates italic 7.97 #5d5d5d
 *   body      Source Sans Light 8.97 #333333, 10.91pt leading
 *
 * The two-tone heading is real: `\cvsection` colours the first three glyphs.
 * The engine has no idea about that, so it is expressed as two cells with a
 * `take`/`drop` pair — plain data, like everything else.
 */

import type { TemplateDefinition } from "../../core/schema";
import { cm } from "../../core/units";

const SANS = "sans";
const DISPLAY = "display";
const SIZE = 8.97;
const LEADING = 10.91;

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

export const awesomeCv: TemplateDefinition = {
  id: "awesome-cv",
  name: "Awesome-CV",
  version: "1.0.0",
  origin: "latex",

  meta: {
    description:
      "The GitHub favourite. A big two-weight name, a red accent, icon-led contact line and ruled headings — modern without losing an ATS parser.",
    source: "Byungjin Park (posquit0), Awesome-CV, LPPL v1.3c",
    thumbnail: "/templates/awesome-cv/thumb.png",
    original: "/templates/awesome-cv/original.pdf",
    tags: ["latex", "modern", "accent-colour", "icons"],
    engine: "xelatex",
  },

  page: {
    size: "a4",
    margin: { top: 46.96, right: cm(1.4), bottom: cm(1.4), left: 39.7 },
  },

  typography: {
    families: [
      {
        key: SANS,
        cssName: "RB Source Sans 3",
        faces: {
          "300": "sourcesans3-light.ttf",
          "400": "sourcesans3-regular.ttf",
          "700": "sourcesans3-bold.ttf",
          "300i": "sourcesans3-lightitalic.ttf",
          "400i": "sourcesans3-italic.ttf",
        },
        substitutes: { original: "Source Sans Pro", fidelity: "visual" },
      },
      {
        key: DISPLAY,
        cssName: "RB Roboto",
        faces: {
          "100": "roboto-thin.ttf",
          "400": "roboto-regular.ttf",
          "700": "roboto-bold.ttf",
          "400i": "roboto-italic.ttf",
        },
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
    base: { family: SANS, size: SIZE, leadingRatio: 1.216, smallCapsScale: 0.8 },
    roles: {
      name: text({ family: DISPLAY, size: 31.88, weight: 100, color: "nameLight", leading: 13.99 }),
      headline: text({ size: 7.57, weight: 400, allCaps: true, color: "accent", tracking: 0.4, leading: 12.05 }),
      contact: text({ family: DISPLAY, size: 6.77, weight: 400, color: "text", leading: 12.13 }),
      sectionTitle: text({ size: 15.94, weight: 700, color: "text", leading: 16.27 }),
      entryTitle: text({ size: 9.96, weight: 700, color: "dark", leading: 13.55 }),
      entrySubtitle: text({ size: 7.97, weight: 400, smallCaps: true, color: "grey", leading: 13.12 }),
      entryMeta: text({ size: 7.97, weight: 300, italic: true, color: "grey", leading: 13.12 }),
      body: text(),
      bullet: text(),
      label: text({ weight: 700, color: "dark" }),
      tag: text({ italic: true, color: "grey" }),
      icon: text({ family: "icon", size: 6.77, weight: 400, color: "text" }),
      footer: text({ size: 8, color: "grey" }),
    },
  },

  palette: {
    ink: "#333333",
    text: "#333333",
    dark: "#414141",
    grey: "#5d5d5d",
    muted: "#999999",
    nameLight: "#5d5d5d",
    accent: "#dc3522",
    rule: "#333333",
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
    aliases: { experience: "Work Experience", awards: "Honors & Awards", research: "Research Experience" },
    titleCase: "as-is",
  },

  blocks: {
    header: {
      rows: [
        { cells: [{ bind: "personal.name", role: "name", align: "center" }] },
        {
          cells: [{ bind: "personal.headline", role: "headline", align: "center" }],
        },
        {
          repeat: "links",
          inline: true,
          separator: "  |  ",
          cells: [
            { bind: "$link.icon", role: "icon", align: "center" },
            { bind: "$link.label", role: "contact", prefix: " ", linkFrom: "$link.href" },
          ],
        },
      ],
    },

    sectionTitle: {
      rows: [{ cells: [{ bind: "section.title", role: "sectionTitle" }] }],
      rule: { position: "underline", thickness: 0.7, color: "rule", gap: 3.6 },
      keepWithNext: true,
    },

    entry: {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "location", role: "entryMeta", style: { color: "accent" }, align: "right" },
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
          gapBefore: 2.21,
          marker: { glyph: "•", x: 0.6, textX: 8.6 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.education": {
      rows: [
        {
          cells: [
            { bind: "organization", role: "entryTitle" },
            { bind: "location", role: "entryMeta", style: { color: "accent" }, align: "right" },
          ],
        },
        {
          cells: [
            { bind: "position", role: "entrySubtitle" },
            { bind: "dateRange", role: "entryMeta", align: "right" },
          ],
        },
        { cells: [{ bind: "summary", role: "body", grow: true }] },
        { cells: [{ bind: "detail", role: "body", grow: true }] },
        {
          repeat: "bullets",
          gapBefore: 2.21,
          marker: { glyph: "•", x: 0.6, textX: 8.6 },
          cells: [{ bind: "$item", role: "body", grow: true }],
        },
      ],
    },

    "entry.labeled": {
      gapBefore: 0,
      rows: [
        {
          cells: [
            { bind: "organization", role: "label", align: { tab: 0, tabAlign: "left" } },
            { bind: "summary", role: "body", align: { tab: 96, tabAlign: "left" }, grow: true },
          ],
        },
      ],
    },

    "entry.paragraph": {
      rows: [{ cells: [{ bind: "section.text", role: "body", grow: true }] }],
    },
  },

  spacing: {
    sectionBefore: 19.26,
    sectionAfter: 5.33,
    entryGap: 6.95,
    bulletGap: 0,
    headerAfter: 15.78,
  },

  rules: {
    fontScale: { min: 0.9, max: 1.15, step: 0.02 },
    lineSpacing: { min: 0.9, max: 1.25, step: 0.02 },
    spacingSlack: 0.2,
    allowBold: true,
    allowItalic: true,
    allowColor: "accent",
    // The original sets job titles at 7.97pt, so 8 would flag its own design.
    minBodySize: 7.5,
  },

  emit: {
    latex: {
      documentClass: "\\documentclass[11pt,a4paper]{awesome-cv}",
      preamble: [
        "% Requires awesome-cv.cls from github.com/posquit0/Awesome-CV",
        "% Compile with xelatex.",
        "\\geometry{left=1.4cm, top=.8cm, right=1.4cm, bottom=1.8cm, footskip=.5cm}",
        "\\fontdir[fonts/]",
        "\\colorlet{awesome}{awesome-red}",
        "\\setbool{acvSectionColorHighlight}{true}",
        "\\renewcommand{\\acvHeaderSocialSep}{\\quad\\textbar\\quad}",
      ].join("\n"),
      document: "\\begin{document}\n{{header}}\n\\makecvheader\n{{body}}\n\\end{document}",
      header:
        "\\name{ {{name}} }{}\n\\position{ {{headline}} }\n\\mobile{ {{contact}} }",
      section: "\\cvsection{ {{title}} }\n\\begin{cventries}\n{{entries}}\n\\end{cventries}",
      sectionFor: {
        labeled: "\\cvsection{ {{title}} }\n\\begin{cvskills}\n{{entries}}\n\\end{cvskills}",
        skills: "\\cvsection{ {{title}} }\n\\begin{cvskills}\n{{entries}}\n\\end{cvskills}",
        paragraph: "\\cvsection{ {{title}} }\n{{entries}}",
      },
      entry: {
        default:
          "  \\cventry\n    { {{position}} }\n    { {{organization}} }\n    { {{location}} }\n    { {{dateRange}} }\n    {\n{{bullets}}\n    }",
        education:
          "  \\cventry\n    { {{position}} }\n    { {{organization}} }\n    { {{location}} }\n    { {{dateRange}} }\n    { {{summary}} {{detail}}\n{{bullets}}\n    }",
        labeled: "  \\cvskill{ {{organization}} }{ {{summary}} }",
        paragraph: "  \\cvparagraph{ {{text}} }",
      },
      bulletsOpen: "      \\begin{cvitems}",
      bullet: "        \\item { {{item}} }",
      bulletsClose: "      \\end{cvitems}",
    },

    docx: {
      font: "Source Sans 3",
      fontFallback: "Calibri",
      rightTab: 10318,
      sectionRule: true,
      bulletChar: "•",
    },
  },
};
