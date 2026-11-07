/**
 * PDF output.
 *
 * This is a transcription, not a second layout pass: every x and y already
 * exists in the box tree, so the writer only converts the coordinate origin
 * (top-left → bottom-left) and hands pdf-lib the glyphs. Fonts are embedded
 * from the same TTF the preview and the metrics came from, subsetted to the
 * glyphs actually used.
 */

import fontkit from "@pdf-lib/fontkit";
import {
  PDFDocument,
  PDFName,
  PDFString,
  rgb,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import type { FontBook } from "../fonts";
import type { LayoutResult, ShapeItem, TextItem } from "../layout/types";

export interface PdfMeta {
  title?: string;
  author?: string;
  subject?: string;
}

function parseColor(hex: string): RGB {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return rgb(0, 0, 0);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Cluster {
  glyph: any;
  /** The characters this glyph stands for — two or more for a ligature. */
  text: string;
  xAdvance: number;
  xOffset: number;
}

/**
 * Shapes a run and pairs every glyph with the characters it stands for.
 *
 * fontkit's own `glyph.codePoints` cannot be trusted for this: it caches one
 * glyph object per id, so a ligature reports whichever code points first
 * created it — often its presentation form (U+FB01 "ﬁ"), not "f" + "i". Each
 * glyph is instead matched against the text: one character if the cmap gives
 * that glyph for it, otherwise the shortest run of characters that shapes to
 * exactly this glyph. Returns null if the run cannot be mapped back.
 */
function clusters(fk: any, features: any, text: string): Cluster[] | null {
  const run = fk.layout(text, features);
  const chars = Array.from(text);
  const out: Cluster[] = [];
  let ci = 0;
  for (let i = 0; i < run.glyphs.length; i += 1) {
    const glyph = run.glyphs[i];
    const pos = run.positions[i];
    let take = 0;
    if (ci < chars.length && fk.glyphForCodePoint(chars[ci].codePointAt(0)).id === glyph.id) {
      take = 1;
    } else {
      for (let k = 2; k <= 4 && ci + k <= chars.length; k += 1) {
        const shaped = fk.layout(chars.slice(ci, ci + k).join(""), features).glyphs;
        if (shaped.length === 1 && shaped[0].id === glyph.id) {
          take = k;
          break;
        }
      }
      // A one-for-one substitution (a contextual alternate) is still one char.
      if (!take && ci < chars.length) take = 1;
    }
    if (!take) return null;
    out.push({
      glyph,
      text: chars.slice(ci, ci + take).join(""),
      xAdvance: pos.xAdvance,
      xOffset: pos.xOffset ?? 0,
    });
    ci += take;
  }
  return ci === chars.length ? out : null;
}

/**
 * Declares the shaped glyphs a font actually drew — ligatures included.
 *
 * pdf-lib shapes text with the font's GSUB table, so "ti", "fi", "ffl" and the
 * like are drawn as single ligature glyphs. But when it embeds a whole font
 * (`subset: false`, see below) it builds the /W widths array and the ToUnicode
 * map from the font's cmap only, and most ligature glyphs are in no cmap. The
 * result was a PDF whose viewers advanced past each ligature by the default
 * width — "Educati on", "Nati onalInsti tute" — and whose text, copied or read
 * by an applicant-tracking system, came out as garbage.
 *
 * Every drawn glyph goes into the embedder's glyph list with the characters it
 * stands for, so each ligature gets a width and maps to plain letters ("fi",
 * not "ﬁ"). This reaches into pdf-lib internals (`embedder.glyphCache`, pinned
 * at 1.17.1); if they ever move, the guard leaves the font untouched and
 * `engine.test.ts` fails on the extracted text.
 */
function declareShapedGlyphs(font: PDFFont, texts: Iterable<string>) {
  const embedder = (font as any).embedder;
  const cache = embedder?.glyphCache;
  const fk = embedder?.font;
  if (!fk?.layout || typeof cache?.access !== "function") return;

  const byId = new Map<number, any>();
  for (const glyph of cache.access()) byId.set(glyph.id, glyph);
  let changed = false;
  for (const text of texts) {
    for (const c of clusters(fk, embedder.fontFeatures, text) ?? []) {
      const codePoints = Array.from(c.text, (ch) => ch.codePointAt(0)!);
      const known = byId.get(c.glyph.id);
      if (known && (codePoints.length === 1 || known.codePoints?.length > 1)) continue;
      // A plain record, not fontkit's shared glyph object — that one is
      // cached and must not have its code points rewritten.
      byId.set(c.glyph.id, { id: c.glyph.id, codePoints, advanceWidth: c.glyph.advanceWidth });
      changed = true;
    }
  }
  if (changed) cache.value = [...byId.values()].sort((a, b) => a.id - b.id);
}

/**
 * Draws a run at the positions the font's shaper gives it, kerning included.
 *
 * The engine measures every run with fontkit — GPOS kerning and all — but
 * pdf-lib writes only glyph ids, so a viewer advances each glyph by its plain
 * width. Every kerning pair ("Te", "PA", "AV") then made the word wider than
 * measured and it ate the space after it: "B.TechMechanical",
 * "TechnologyKarnataka". So the run is split wherever the shaper moved a glyph
 * off its natural advance, and each piece is drawn at its shaped x. Pieces are
 * whole glyph clusters, so ligatures survive.
 */
function drawShaped(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  x: number,
  y: number,
  color: RGB,
) {
  const embedder = (font as any).embedder;
  const fk = embedder?.font;
  const shaped = fk?.layout ? clusters(fk, embedder.fontFeatures, text) : null;
  if (!shaped) {
    page.drawText(text, { x, y, size, font, color });
    return;
  }
  const scale = size / fk.unitsPerEm;

  let cursor = 0; // font units from the run's start, shaped
  let pieceStart = 0; // shaped x where the current piece begins
  let pieceText = "";
  const flush = () => {
    if (pieceText) page.drawText(pieceText, { x: x + pieceStart * scale, y, size, font, color });
    pieceText = "";
  };
  for (const c of shaped) {
    // An offset glyph (a mark, mostly) must start a piece of its own.
    if (c.xOffset) flush();
    if (!pieceText) pieceStart = cursor + c.xOffset;
    pieceText += c.text;
    cursor += c.xAdvance;
    // Anything the shaper adjusted ends the piece; the next starts where the
    // shaper put it.
    if (c.xAdvance !== c.glyph.advanceWidth || c.xOffset) flush();
  }
  flush();
}
/**
 * pdf-lib has no letter-spacing, so a tracked run is drawn a glyph at a time.
 * Each glyph advances by its *shaped* width — kerning included — plus the
 * tracking for every character it stands for, which is exactly how the engine
 * measured the run (`advance + tracking × length`). Drawing letters at their
 * plain widths used to push tracked headings into the space after them.
 */
function drawTracked(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  tracking: number,
  x: number,
  y: number,
  color: RGB,
) {
  const embedder = (font as any).embedder;
  const fk = embedder?.font;
  const shaped = fk?.layout ? clusters(fk, embedder.fontFeatures, text) : null;
  let cursor = x;
  if (!shaped) {
    for (const ch of text) {
      page.drawText(ch, { x: cursor, y, size, font, color });
      cursor += font.widthOfTextAtSize(ch, size) + tracking;
    }
    return;
  }
  const scale = size / fk.unitsPerEm;
  for (const c of shaped) {
    page.drawText(c.text, { x: cursor + c.xOffset * scale, y, size, font, color });
    cursor += c.xAdvance * scale + tracking * c.text.length;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function addLink(page: PDFPage, url: string, x: number, y: number, w: number, h: number) {
  const doc = page.doc;
  const annotation = doc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [x, y, x + w, y + h],
    Border: [0, 0, 0],
    A: doc.context.obj({ Type: "Action", S: "URI", URI: PDFString.of(url) }),
  });
  const existing = page.node.get(PDFName.of("Annots"));
  if (existing) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (existing as any).push(doc.context.register(annotation));
  } else {
    page.node.set(
      PDFName.of("Annots"),
      doc.context.obj([doc.context.register(annotation)]),
    );
  }
}

function drawShape(page: PDFPage, shape: ShapeItem, pageHeight: number) {
  const y = pageHeight - shape.y;
  if (shape.shape === "dots") {
    const total = shape.total ?? 5;
    const filled = shape.value ?? 0;
    const radius = shape.height / 4;
    const step = (shape.width - radius * 2) / Math.max(1, total - 1);
    for (let i = 0; i < total; i += 1) {
      page.drawCircle({
        x: shape.x + radius + i * step,
        y: y - shape.height / 2,
        size: radius,
        color: parseColor(i < filled ? shape.color : shape.mutedColor),
      });
    }
    return;
  }
  if (shape.shape === "pill") {
    page.drawRectangle({
      x: shape.x,
      y: y - shape.height,
      width: shape.width,
      height: shape.height,
      borderColor: parseColor(shape.mutedColor),
      borderWidth: 0.5,
    });
  }
}

export async function renderPdf(
  layout: LayoutResult,
  book: FontBook,
  meta: PdfMeta = {},
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  doc.setTitle(meta.title ?? "Résumé");
  if (meta.author) doc.setAuthor(meta.author);
  doc.setSubject(meta.subject ?? "Résumé");
  doc.setProducer("IEM RVCE Resume Builder");
  doc.setCreator("IEM RVCE Resume Builder");

  // `subset: false` is deliberate. The shipped faces are already cut down to a
  // Latin charset by `scripts/subset_fonts.py` (~30 kB each), and pdf-lib's own
  // subsetter silently drops most glyphs from these fonts — the PDF extracts
  // the right text but renders about a third of the ink.
  const embedded = new Map<string, PDFFont>();
  // Every run's text, per face — what `declareShapedGlyphs` shapes.
  const needed = new Map<string, Set<string>>();
  for (const page of layout.pages) {
    for (const item of page.items) {
      if (item.type !== "text") continue;
      for (const piece of item.pieces) {
        for (const run of piece.runs) {
          const texts = needed.get(run.face.key) ?? new Set<string>();
          texts.add(run.text);
          needed.set(run.face.key, texts);
        }
      }
    }
  }
  for (const face of book.allFaces()) {
    const texts = needed.get(face.key);
    if (!texts) continue;
    const font = await doc.embedFont(face.bytes, { subset: false });
    declareShapedGlyphs(font, texts);
    embedded.set(face.key, font);
  }

  for (const layoutPage of layout.pages) {
    const page = doc.addPage([layoutPage.width, layoutPage.height]);
    const H = layoutPage.height;

    for (const item of layoutPage.items) {
      if (item.type === "rule") {
        page.drawRectangle({
          x: item.x,
          y: H - item.y - item.thickness,
          width: item.width,
          height: item.thickness,
          color: parseColor(item.color),
        });
        continue;
      }

      if (item.type === "shape") {
        drawShape(page, item, H);
        continue;
      }

      drawText(page, item, embedded, H);
    }
  }

  return doc.save();
}

function drawText(
  page: PDFPage,
  item: TextItem,
  embedded: Map<string, PDFFont>,
  pageHeight: number,
) {
  const baseline = pageHeight - item.y;

  for (const piece of item.pieces) {
    const color = parseColor(piece.color);
    for (const run of piece.runs) {
      const font = embedded.get(run.face.key);
      if (!font) continue;
      const x = piece.x + run.dx;
      if (run.tracking) {
        drawTracked(page, run.text, font, run.size, run.tracking, x, baseline, color);
      } else {
        drawShaped(page, run.text, font, run.size, x, baseline, color);
      }
      if (piece.style.underline) {
        page.drawRectangle({
          x,
          y: baseline - run.size * 0.12,
          width: run.width,
          height: Math.max(0.4, run.size * 0.05),
          color,
        });
      }
    }

    if (piece.href) {
      const height = piece.style.size * 1.1;
      addLink(page, piece.href, piece.x, baseline - height * 0.2, piece.width, height);
    }
  }
}

/** Turns the bytes into something a browser can download. */
export function pdfBlob(bytes: Uint8Array): Blob {
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
