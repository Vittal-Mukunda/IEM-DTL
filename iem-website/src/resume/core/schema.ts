/**
 * The template definition — a declarative box model the engine interprets.
 *
 * Nothing in `core/` may import from `templates/`. A template is *data*: page
 * geometry, a font book, a set of text roles, and a small tree of rows and
 * cells describing where each slot of a résumé entry lands. Adding template #9
 * through #100 means writing one of these objects, not touching the engine.
 *
 * All lengths are points (see `units.ts`).
 */

import type { SectionKind, SectionLayout } from "./model";
import type { Insets, PageSizeName } from "./units";

/* ------------------------------------------------------------------ *
 * Typography
 * ------------------------------------------------------------------ */

/** `400`, `700`, `300i` … weight, optionally suffixed `i` for italic. */
export type FaceKey = string;

export interface FontFamilySpec {
  /** How rows refer to it: `serif`, `sans`, `heading`, `icon`. */
  key: string;
  /** CSS `font-family` name declared by `public/fonts/resume/fonts.css`. */
  cssName: string;
  /** Face key → filename under `public/fonts/resume/`. */
  faces: Record<FaceKey, string>;
  /**
   * Set when this family stands in for one we cannot ship. The verifier
   * reports every substitution rather than letting it pass silently.
   */
  substitutes?: {
    original: string;
    /** `metric` keeps advance widths identical; `visual` only looks alike. */
    fidelity: "metric" | "visual";
  };
}

export type TextRole =
  | "name"
  | "headline"
  | "contact"
  | "sectionTitle"
  | "entryTitle"
  | "entrySubtitle"
  | "entryMeta"
  | "body"
  | "bullet"
  | "label"
  | "tag"
  | "icon"
  | "footer";

export interface TextStyle {
  family: string;
  size: number;
  weight: number;
  italic: boolean;
  /** Rendered by uppercasing lowercase letters at `smallCapsScale`. */
  smallCaps: boolean;
  allCaps: boolean;
  /** Palette key, or a literal `#rrggbb`. */
  color: string;
  /** Extra letter spacing, in points. */
  tracking: number;
  /** Baseline-to-baseline distance. Defaults to `size × base.leadingRatio`. */
  leading?: number;
  underline?: boolean;
}

/* ------------------------------------------------------------------ *
 * Blocks — the geometry
 * ------------------------------------------------------------------ */

/**
 * Where a cell sits on its row.
 *  - `left`    flows after the previous cell
 *  - `right`   flush to the content right edge
 *  - `center`  centred in the content width
 *  - `{ tab }` left edge pinned at x, or right-aligned to it with `tabAlign`
 */
export type CellAlign =
  | "left"
  | "right"
  | "center"
  | { tab: number; tabAlign?: "left" | "right" };

/**
 * What a cell prints. Recognised bindings:
 *  - entry slots: `organization` `position` `location` `summary` `detail` `url` `rating`
 *  - computed:    `dateRange`
 *  - document:    `personal.name` `personal.headline` `section.title`
 *  - inside a repeated row: `$item`, and for `links`: `$link.label` `$link.icon`
 */
export interface Cell {
  bind?: string;
  /** A literal, used for separators and punctuation. */
  text?: string;
  role?: TextRole;
  style?: Partial<TextStyle>;
  align?: CellAlign;
  prefix?: string;
  suffix?: string;
  /** Only render when this binding resolves to something non-empty. */
  when?: string;
  /** Absorbs the leftover width and wraps onto further lines. */
  grow?: boolean;
  /** Makes the cell a link in PDF/DOCX when the slot carries a URL. */
  linkFrom?: string;
}

export interface MarkerSpec {
  glyph: string;
  style?: Partial<TextStyle>;
  /** Marker x, measured from the block's left edge. */
  x: number;
  /** Text x, measured from the block's left edge. */
  textX: number;
}

/**
 * Non-text furniture on a row: AltaCV's proficiency dots and keyword pills.
 * Drawn as vector shapes by every renderer, so they survive export rather than
 * degrading to a screenshot.
 */
export interface ShapeSpec {
  kind: "dots" | "pill" | "wheel";
  align?: CellAlign;
  /** dots: how many to draw. Filled count comes from the entry's `rating`. */
  total?: number;
  size?: number;
  gap?: number;
  color?: string;
  mutedColor?: string;
  /** pill: padding inside the outline. */
  padding?: number;
  radius?: number;
}

export interface Row {
  cells: Cell[];
  shape?: ShapeSpec;
  /** Emit one copy of this row per item in the named collection. */
  repeat?: "bullets" | "tags" | "links";
  /** With `repeat`, join the items on one line instead of one row each. */
  inline?: boolean;
  /** Separator between inline repeated items. */
  separator?: string;
  marker?: MarkerSpec;
  /** Left inset for the whole row. */
  indent?: number;
  /** Space above this row, added to the natural leading. */
  gapBefore?: number;
  when?: string;
  /** Rows wrap by default; set false to force a single line (clipped). */
  wrap?: boolean;
}

export interface RuleSpec {
  /**
   * `before` / `after` measure from the block's top or bottom edge.
   * `underline` measures from its **last baseline**, which is how LaTeX's
   * `	itlerule` and Word's paragraph border both behave — and it means a
   * template can state the number it measured (4.38pt below the baseline)
   * rather than one derived from the line height.
   */
  position: "before" | "after" | "underline";
  thickness: number;
  color: string;
  gap: number;
  /** `content` spans the text column; `full` ignores the gutter. */
  width?: "content" | "full";
  /** Inset from each end. */
  inset?: number;
}

export interface BlockLayout {
  rows: Row[];
  gapBefore?: number;
  gapAfter?: number;
  rule?: RuleSpec;
  /** Never leave this block stranded at the foot of a page. */
  keepWithNext?: boolean;
}

/**
 * Block keys the engine looks up, most specific first:
 *   `entry.education` → `entry.<layout>` → `entry`
 */
export type BlockKey =
  | "header"
  | "sectionTitle"
  | "entry"
  | "footer"
  | `entry.${SectionKind}`
  | `entry.${SectionLayout}`;

/* ------------------------------------------------------------------ *
 * Emission profiles
 * ------------------------------------------------------------------ */

/**
 * LaTeX templates use `{{slot}}` for a value and `{{#bullets}}…{{/bullets}}`
 * for a loop — see `render/latex.ts`. Keeping them as strings means a new
 * template ships its own macros without the emitter learning about it.
 */
export interface LatexProfile {
  documentClass: string;
  preamble: string;
  /** Wraps the whole body. `{{body}}` is the main column; `{{side}}` is optional. */
  document: string;
  header: string;
  section: string;
  /**
   * Override `section` for a kind or layout. Awesome-CV skills live in
   * `cvskills`, not `cventries`; without this the .tex will not compile.
   */
  sectionFor?: Partial<Record<SectionKind | SectionLayout, string>>;
  entry: Partial<Record<SectionKind | SectionLayout | "default", string>>;
  bulletsOpen?: string;
  bullet?: string;
  bulletsClose?: string;
  /** Escapes beyond the default set, for templates with unusual macros. */
  extraEscapes?: Record<string, string>;
}

export interface DocxProfile {
  /** Real font name Word should ask for — not the substitute we ship. */
  font: string;
  /** Fallback when the primary is missing on the reader's machine. */
  fontFallback?: string;
  /** Right tab stop, in twips. Usually the content width. */
  rightTab: number;
  /** Draw the section rule as a paragraph bottom border. */
  sectionRule: boolean;
  bulletChar: string;
}

/* ------------------------------------------------------------------ *
 * The template
 * ------------------------------------------------------------------ */

export interface ColumnSpec {
  id: "main" | "side";
  /** Fraction of the content width. */
  width: number;
  /** Gap to the next column. */
  gap?: number;
}

export interface GutterSpec {
  width: number;
  gap: number;
  /** MIT puts section titles here; Stanford puts entry dates here. */
  carries: "sectionTitle" | "entryDates";
  align: "left" | "right";
}

export interface TemplateDefinition {
  id: string;
  name: string;
  version: string;
  origin: "word" | "latex";

  meta: {
    description: string;
    /** Where the original came from, for the docs and the verifier. */
    source: string;
    thumbnail: string;
    /** The original PDF the verifier diffs against, if we have one. */
    original?: string;
    tags: string[];
    engine: "pdflatex" | "xelatex";
  };

  page: {
    size: PageSizeName;
    /**
     * `top` is the **first text baseline**, not the top of the first line box.
     * Everything downstream works in baseline space, so this is the number the
     * forensics actually produce — no ascent arithmetic to get it wrong.
     */
    margin: Insets;
    columns?: ColumnSpec[];
    gutter?: GutterSpec;
  };

  typography: {
    families: FontFamilySpec[];
    base: {
      family: string;
      size: number;
      /** Baseline-to-baseline as a multiple of size, when a role omits it. */
      leadingRatio: number;
      /** Cap height ratio used to synthesise small caps. */
      smallCapsScale: number;
    };
    roles: Record<TextRole, TextStyle>;
  };

  palette: Record<string, string>;

  /** Punctuation habits of the original document, kept out of the block tree. */
  conventions: {
    /** Separator inside a date range: Harvard uses " - ", Jake's an en dash. */
    dateDash: string;
  };

  sections: {
    available: SectionKind[];
    defaultOrder: SectionKind[];
    /** Heading text per kind — "experience" → "PROFESSIONAL EXPERIENCE". */
    aliases: Partial<Record<SectionKind, string>>;
    /** Applied to every heading after aliasing. */
    titleCase?: "upper" | "title" | "as-is";
    /**
     * For two-column templates: kinds that default to the sidebar. A section
     * can still be moved by setting its own `column`, but without this every
     * section would pile into the main column and leave the sidebar empty.
     */
    sideKinds?: SectionKind[];
  };

  blocks: Partial<Record<BlockKey, BlockLayout>> & {
    header: BlockLayout;
    sectionTitle: BlockLayout;
    entry: BlockLayout;
  };

  spacing: {
    /** Above a section title, beyond the previous block's `gapAfter`. */
    sectionBefore: number;
    /** Between a section title and its first entry. */
    sectionAfter: number;
    entryGap: number;
    bulletGap: number;
    /** Below the header block. */
    headerAfter: number;
  };

  rules: {
    fontScale: { min: number; max: number; step: number };
    lineSpacing: { min: number; max: number; step: number };
    /** How much `spacing` may be compressed before font size is touched. */
    spacingSlack: number;
    allowBold: boolean;
    allowItalic: boolean;
    allowColor: "none" | "accent" | "free";
    /** Absolute floor for body text, in points, after every adjustment. */
    minBodySize: number;
  };

  emit: {
    latex: LatexProfile;
    docx: DocxProfile;
  };
}

/* ------------------------------------------------------------------ *
 * Lookup helpers
 * ------------------------------------------------------------------ */

/** Most specific block wins: `entry.education` → `entry.labeled` → `entry`. */
export function blockFor(
  template: TemplateDefinition,
  kind: SectionKind,
  layout: SectionLayout,
): BlockLayout {
  return (
    template.blocks[`entry.${kind}` as BlockKey] ??
    template.blocks[`entry.${layout}` as BlockKey] ??
    template.blocks.entry
  );
}

export function resolveColor(template: TemplateDefinition, value: string): string {
  if (value.startsWith("#")) return value;
  return template.palette[value] ?? "#000000";
}

export function familyFor(template: TemplateDefinition, key: string): FontFamilySpec {
  const found = template.typography.families.find((f) => f.key === key);
  if (!found) {
    throw new Error(
      `Template "${template.id}" refers to font family "${key}", which it does not declare.`,
    );
  }
  return found;
}

/** Every substitution this template makes, for the verification report. */
export function substitutions(template: TemplateDefinition) {
  return template.typography.families
    .filter((f) => f.substitutes)
    .map((f) => ({
      family: f.cssName,
      original: f.substitutes!.original,
      fidelity: f.substitutes!.fidelity,
    }));
}
