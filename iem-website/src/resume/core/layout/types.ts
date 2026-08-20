/**
 * The box tree — the single artefact every renderer consumes.
 *
 * The DOM preview, the PDF writer and the DOCX writer all read *this*, never
 * the résumé or the template directly. That is what makes "what you see is
 * what you download" structurally true rather than a thing we keep re-checking.
 *
 * Coordinates are absolute points from the top-left of the page. `y` on a text
 * item is its **baseline**, matching PDF and LaTeX; the renderers convert.
 */

import type { ShapedRun } from "../fonts";
import type { TextRole, TextStyle } from "../schema";

export interface PositionedRun extends ShapedRun {
  /** Offset from the text piece's own x. */
  dx: number;
}

export interface TextPiece {
  x: number;
  width: number;
  runs: PositionedRun[];
  style: TextStyle;
  /** Which role produced this piece — the integrity checks need it. */
  role: TextRole;
  /** Resolved to `#rrggbb` — palette lookups happen during layout. */
  color: string;
  href?: string;
}

export interface TextItem {
  type: "text";
  /** Baseline y. */
  y: number;
  pieces: TextPiece[];
}

export interface RuleItem {
  type: "rule";
  x: number;
  y: number;
  width: number;
  thickness: number;
  color: string;
}

/** Proficiency dots, keyword pills and AltaCV's wheel chart. */
export interface ShapeItem {
  type: "shape";
  shape: "dots" | "pill" | "wheel";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  mutedColor: string;
  /** dots: filled count out of `total`. wheel: slice fractions. */
  value?: number;
  total?: number;
  slices?: { fraction: number; label: string; color: string }[];
  label?: TextItem;
}

export type LayoutItem = TextItem | RuleItem | ShapeItem;

export interface LayoutPage {
  width: number;
  height: number;
  items: LayoutItem[];
}

export interface LayoutWarning {
  code:
    | "overflow"
    | "font-scaled"
    | "spacing-compressed"
    | "section-empty"
    | "text-clipped";
  message: string;
  sectionId?: string;
}

export interface LayoutResult {
  pages: LayoutPage[];
  /** Font scale actually used after the overflow cascade. */
  appliedFontScale: number;
  /** Spacing multiplier actually used after the overflow cascade. */
  appliedSpacing: number;
  warnings: LayoutWarning[];
  /** Height by which the last page overshoots, in points. 0 when it fits. */
  overflowBy: number;
}

/* ------------------------------------------------------------------ *
 * Intermediate shapes, used while measuring
 * ------------------------------------------------------------------ */

export interface LineBox {
  /** Baseline offset from the line box's top. */
  ascent: number;
  /** Advance to the next line's top. */
  height: number;
  pieces: TextPiece[];
}

/**
 * A measured, not-yet-placed block. Pagination moves these around; nothing
 * inside one is re-measured when it moves, which is what keeps re-layout fast
 * enough to run on every keystroke.
 */
export interface MeasuredBlock {
  id: string;
  kind: "header" | "sectionTitle" | "entry" | "footer";
  sectionId?: string;
  lines: LineBox[];
  shapes: ShapeItem[];
  height: number;
  gapBefore: number;
  gapAfter: number;
  rule?: {
    thickness: number;
    color: string;
    gap: number;
    x: number;
    width: number;
    position: "before" | "after" | "underline";
  };
  keepWithNext: boolean;
  /** Lines that must stay with the block's first line — heading rows. */
  atomicLines: number;
  /** Text for the gutter, when the template has one. */
  gutter?: { lines: LineBox[]; align: "left" | "right"; width: number };
  column: "main" | "side";
}
