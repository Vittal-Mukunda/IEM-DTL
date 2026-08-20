/**
 * Font metrics — the reason preview, PDF, TEX and DOCX can agree.
 *
 * Every width in the engine comes from the real TTF via fontkit, shaped with
 * the font's own kerning and ligature tables. The browser gets the same file
 * through `@font-face`, and pdf-lib embeds that same file, so a line measured
 * here lands in the same place in all three.
 *
 * (Verified: Tinos reproduces Times New Roman's advance widths exactly, so the
 * Word-derived templates measure identically to the originals.)
 */

import fontkit from "@pdf-lib/fontkit";
import type { FontFamilySpec, TemplateDefinition, TextStyle } from "./schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
type FontkitFont = any;

const create = (bytes: Uint8Array): FontkitFont => (fontkit as any).create(bytes);

/** Faces already installed via `FontBook.registerCssFaces`. */
const registeredCssFaces = new Set<string>();

export type FontLoader = (file: string) => Promise<Uint8Array>;

/** Fetches from `public/fonts/resume/`. Same-origin, so the CSP allows it. */
export const browserFontLoader: FontLoader = async (file) => {
  const res = await fetch(`/fonts/resume/${file}`);
  if (!res.ok) throw new Error(`Font "${file}" failed to load (${res.status}).`);
  return new Uint8Array(await res.arrayBuffer());
};

export interface FaceMetrics {
  unitsPerEm: number;
  ascent: number;
  descent: number;
  lineGap: number;
  capHeight: number;
  xHeight: number;
}

export interface LoadedFace {
  key: string;
  file: string;
  font: FontkitFont;
  bytes: Uint8Array;
  metrics: FaceMetrics;
}

/**
 * A piece of text at one concrete size. Small caps expand into several of
 * these; everything downstream (measuring, DOM, PDF) consumes runs, so the
 * three never disagree about where a small-cap boundary falls.
 */
export interface ShapedRun {
  text: string;
  size: number;
  face: LoadedFace;
  width: number;
  tracking: number;
}

const faceCandidates = (weight: number, italic: boolean): string[] => {
  const i = italic ? "i" : "";
  const ladder = [weight, 400, 700, 300, 100, 500, 600, 900];
  const keys: string[] = [];
  for (const w of ladder) keys.push(`${w}${i}`);
  // Fall back across the italic boundary before giving up entirely.
  for (const w of ladder) keys.push(`${w}${italic ? "" : "i"}`);
  return keys;
};

export class FontBook {
  private faces = new Map<string, LoadedFace>();
  private families = new Map<string, FontFamilySpec>();
  private widthCache = new Map<string, number>();

  private constructor(readonly smallCapsScale: number) {}

  static async load(
    template: TemplateDefinition,
    loader: FontLoader = browserFontLoader,
  ): Promise<FontBook> {
    const book = new FontBook(template.typography.base.smallCapsScale);
    const jobs: Promise<void>[] = [];

    for (const family of template.typography.families) {
      book.families.set(family.key, family);
      for (const [faceKey, file] of Object.entries(family.faces)) {
        const id = `${family.key}/${faceKey}`;
        jobs.push(
          loader(file).then((bytes) => {
            const font = create(bytes);
            book.faces.set(id, {
              key: id,
              file,
              font,
              bytes,
              metrics: {
                unitsPerEm: font.unitsPerEm,
                ascent: font.ascent,
                descent: font.descent,
                lineGap: font.lineGap,
                capHeight: font.capHeight ?? font.ascent * 0.7,
                xHeight: font.xHeight ?? font.ascent * 0.5,
              },
            });
          }),
        );
      }
    }

    await Promise.all(jobs);
    return book;
  }

  /**
   * Installs the already-fetched faces into `document.fonts`.
   *
   * The SVG preview used to rely on a second `@font-face` URL load. Brave (and
   * any browser that stalls or blocks that request) then paints the page with
   * `font-display: block` — which is an empty white sheet. These bytes are
   * already in memory for metrics, so the preview can use them directly.
   */
  async registerCssFaces(): Promise<void> {
    if (typeof document === "undefined" || typeof FontFace === "undefined") return;

    const pending: Promise<unknown>[] = [];
    for (const family of this.families.values()) {
      for (const faceKey of Object.keys(family.faces)) {
        const token = `${family.cssName}::${faceKey}`;
        if (registeredCssFaces.has(token)) continue;
        const loaded = this.faces.get(`${family.key}/${faceKey}`);
        if (!loaded) continue;
        registeredCssFaces.add(token);

        const italic = faceKey.endsWith("i");
        const weight = Number.parseInt(faceKey, 10) || 400;
        const face = new FontFace(family.cssName, loaded.bytes.slice(), {
          weight: String(weight),
          style: italic ? "italic" : "normal",
          display: "swap",
        } as FontFaceDescriptors);
        document.fonts.add(face);
        pending.push(face.load().catch(() => undefined));
      }
    }
    await Promise.all(pending);
  }

  family(key: string): FontFamilySpec {
    const f = this.families.get(key);
    if (!f) throw new Error(`Font family "${key}" was never loaded.`);
    return f;
  }

  /** Nearest available face, walking the weight ladder then the italic axis. */
  face(family: string, weight: number, italic: boolean): LoadedFace {
    for (const candidate of faceCandidates(weight, italic)) {
      const found = this.faces.get(`${family}/${candidate}`);
      if (found) return found;
    }
    throw new Error(`Font family "${family}" has no usable face.`);
  }

  faceForStyle(style: TextStyle): LoadedFace {
    return this.face(style.family, style.weight, style.italic);
  }

  allFaces(): LoadedFace[] {
    return [...this.faces.values()];
  }

  /** Raw advance width of a string in one face, at one size. */
  advance(face: LoadedFace, text: string, size: number): number {
    if (!text) return 0;
    const key = `${face.key}|${size}|${text}`;
    const hit = this.widthCache.get(key);
    if (hit !== undefined) return hit;
    const run = face.font.layout(text);
    const width = (run.advanceWidth / face.metrics.unitsPerEm) * size;
    this.widthCache.set(key, width);
    return width;
  }

  /**
   * Splits styled text into concrete runs.
   *
   * Small caps are synthesised: lowercase letters are uppercased and set at
   * `smallCapsScale` of the nominal size. Computer Modern, Tinos and Source
   * Sans have no true small-cap face we can ship, and synthesising them here
   * means the preview, the PDF and the DOCX all place the boundary identically
   * — which a real small-cap face in only one of the three would not.
   */
  shape(text: string, style: TextStyle): ShapedRun[] {
    if (!text) return [];

    const face = this.faceForStyle(style);
    const emit = (t: string, size: number): ShapedRun => ({
      text: t,
      size,
      face,
      width: this.advance(face, t, size) + style.tracking * t.length,
      tracking: style.tracking,
    });

    if (style.allCaps) return [emit(text.toUpperCase(), style.size)];
    if (!style.smallCaps) return [emit(text, style.size)];

    const small = style.size * this.smallCapsScale;
    const runs: ShapedRun[] = [];
    let buffer = "";
    let bufferIsSmall = text[0] >= "a" && text[0] <= "z";

    for (const ch of text) {
      const isSmall = ch >= "a" && ch <= "z";
      if (isSmall !== bufferIsSmall && buffer) {
        runs.push(emit(bufferIsSmall ? buffer.toUpperCase() : buffer, bufferIsSmall ? small : style.size));
        buffer = "";
      }
      bufferIsSmall = isSmall;
      buffer += ch;
    }
    if (buffer) {
      runs.push(emit(bufferIsSmall ? buffer.toUpperCase() : buffer, bufferIsSmall ? small : style.size));
    }
    return runs;
  }

  measure(text: string, style: TextStyle): number {
    return this.shape(text, style).reduce((sum, r) => sum + r.width, 0);
  }

  /**
   * Height of one line: `leading` when the style declares it, otherwise the
   * font's own ascent + descent + gap, which is what Word uses for "single".
   */
  lineHeight(style: TextStyle, leadingRatio: number): number {
    if (style.leading) return style.leading;
    return style.size * leadingRatio;
  }

  /** Distance from the line's top to its baseline. */
  ascentOf(style: TextStyle): number {
    const m = this.faceForStyle(style).metrics;
    return (m.ascent / m.unitsPerEm) * style.size;
  }

  /**
   * Greedy word wrap — the same algorithm Word uses, and near enough to
   * LaTeX's paragraph breaker for single-column résumé prose that the two
   * agree on where lines end in every fixture we test.
   *
   * A word longer than the whole measure is broken mid-word rather than
   * allowed to overhang the margin (long URLs, mostly).
   */
  wrap(text: string, style: TextStyle, maxWidth: number): string[] {
    const trimmed = text.trim();
    if (!trimmed) return [];
    if (maxWidth <= 0) return [trimmed];

    const words = trimmed.split(/\s+/);
    const spaceWidth = this.measure(" ", style);
    const lines: string[] = [];
    let line = "";
    let lineWidth = 0;

    for (const word of words) {
      const wordWidth = this.measure(word, style);
      const withSpace = line ? lineWidth + spaceWidth + wordWidth : wordWidth;

      if (line && withSpace > maxWidth) {
        lines.push(line);
        line = "";
        lineWidth = 0;
      }

      if (!line && wordWidth > maxWidth) {
        // Hard-break an unbreakable token so nothing escapes the margin.
        let chunk = "";
        for (const ch of word) {
          const next = chunk + ch;
          if (this.measure(next, style) > maxWidth && chunk) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk = next;
          }
        }
        line = chunk;
        lineWidth = this.measure(chunk, style);
        continue;
      }

      line = line ? `${line} ${word}` : word;
      lineWidth = line === word ? wordWidth : lineWidth + spaceWidth + wordWidth;
    }

    if (line) lines.push(line);
    return lines;
  }
}
