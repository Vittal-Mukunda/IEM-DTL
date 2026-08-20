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

/**
 * pdf-lib has no letter-spacing, so a tracked run is drawn one glyph at a
 * time. Only headings use tracking, so the cost is negligible and the result
 * matches the measured advances exactly.
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
  let cursor = x;
  for (const ch of text) {
    page.drawText(ch, { x: cursor, y, size, font, color });
    cursor += font.widthOfTextAtSize(ch, size) + tracking;
  }
}

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
  const needed = new Set<string>();
  for (const page of layout.pages) {
    for (const item of page.items) {
      if (item.type !== "text") continue;
      for (const piece of item.pieces) {
        for (const run of piece.runs) needed.add(run.face.key);
      }
    }
  }
  for (const face of book.allFaces()) {
    if (!needed.has(face.key)) continue;
    embedded.set(face.key, await doc.embedFont(face.bytes, { subset: false }));
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
        page.drawText(run.text, { x, y: baseline, size: run.size, font, color });
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
