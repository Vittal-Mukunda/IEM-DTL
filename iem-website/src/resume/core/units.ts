/**
 * Everything in the résumé engine is measured in **PostScript points**.
 *
 * That is the unit PDF uses natively, the unit LaTeX reports in, and the unit
 * every measurement in the template forensics was taken in. Converting once at
 * the edges (Word's twips, a designer's inches) and never again is what keeps
 * the layout engine, the PDF writer and the verifier all agreeing.
 */

export const PT_PER_INCH = 72;
export const PT_PER_CM = 28.346456692913385;
export const PT_PER_MM = PT_PER_CM / 10;
/** Word measures in twentieths of a point. */
export const PT_PER_TWIP = 0.05;

export const inch = (n: number) => n * PT_PER_INCH;
export const cm = (n: number) => n * PT_PER_CM;
export const mm = (n: number) => n * PT_PER_MM;
export const twip = (n: number) => n * PT_PER_TWIP;

export const toInch = (pt: number) => pt / PT_PER_INCH;

export interface PageDimensions {
  width: number;
  height: number;
}

export const PAGE_SIZES = {
  letter: { width: 612, height: 792 },
  a4: { width: 595.2756, height: 841.8898 },
} as const satisfies Record<string, PageDimensions>;

export type PageSizeName = keyof typeof PAGE_SIZES;

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Shorthand for symmetric margins, CSS-style. */
export function insets(top: number, right = top, bottom = top, left = right): Insets {
  return { top, right, bottom, left };
}

/** Round to a tenth of a point — below the threshold any renderer can express. */
export const q = (n: number) => Math.round(n * 10) / 10;

export function clamp(n: number, min: number, max: number) {
  return n < min ? min : n > max ? max : n;
}
