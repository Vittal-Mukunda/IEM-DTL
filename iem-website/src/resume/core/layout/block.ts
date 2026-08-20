/**
 * Block measurement — a template's rows and cells become positioned lines.
 *
 * A row is laid out in two passes because that is how both Word and LaTeX
 * actually behave:
 *
 *   1. **Pinned** cells (right-aligned, or at a tab stop) are measured and
 *      placed first. They occupy the row's first line only.
 *   2. **Flowing** cells wrap in the space the pinned cells left over, and may
 *      run onto further lines at full width.
 *
 * That single rule reproduces Yale's `\t`-to-7.5in dates, Harvard's
 * right-aligned locations, and Jake's `\hfill` — none of which the engine
 * knows by name.
 */

import type { FontBook } from "../fonts";
import type { Entry, ResumeDoc, Section } from "../model";
import { resolveColor, type BlockLayout, type Cell, type CellAlign, type Row, type ShapeSpec, type TemplateDefinition, type TextStyle } from "../schema";
import { bindingHasValue, ICON_FACE, resolveBinding, type BindContext } from "./bind";
import { flowInline, singleLine, type Fragment } from "./inline";
import type { LineBox, ShapeItem, TextPiece } from "./types";

/** Gap kept between a flowing cell and the pinned cell to its right. */
const PIN_GUTTER = 6;

export interface BlockContext {
  template: TemplateDefinition;
  book: FontBook;
  doc: ResumeDoc;
  section?: Section;
  entry?: Entry;
  /** Content box the block is laid out in — already column/gutter adjusted. */
  left: number;
  width: number;
  /** Multiplies every font size in this pass. */
  fontScale: number;
  /** Multiplies every leading in this pass. */
  spacingScale: number;
}

export interface MeasuredRows {
  lines: LineBox[];
  shapes: ShapeItem[];
  height: number;
  /** Extra space above the block's first baseline, from a leading row gap. */
  leadIn?: number;
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

export function styleFor(ctx: BlockContext, cell: Cell): TextStyle {
  const role = cell.role ?? "body";
  const base = ctx.template.typography.roles[role];
  const merged: TextStyle = { ...base, ...cell.style };
  return {
    ...merged,
    size: merged.size * ctx.fontScale,
    leading: merged.leading ? merged.leading * ctx.fontScale * ctx.spacingScale : undefined,
    tracking: merged.tracking * ctx.fontScale,
  };
}

function scaleStyle(ctx: BlockContext, style: TextStyle): TextStyle {
  return {
    ...style,
    size: style.size * ctx.fontScale,
    leading: style.leading ? style.leading * ctx.fontScale * ctx.spacingScale : undefined,
    tracking: style.tracking * ctx.fontScale,
  };
}

/* ------------------------------------------------------------------ *
 * Cells → fragments
 * ------------------------------------------------------------------ */

function cellFragment(ctx: BlockContext, cell: Cell, bindCtx: BindContext): Fragment | null {
  if (cell.when && !bindingHasValue(cell.when, bindCtx)) return null;

  const value = cell.bind ? resolveBinding(cell.bind, bindCtx) : (cell.text ?? "");
  if (cell.bind && !value.trim()) return null;
  if (!cell.bind && !cell.text) return null;

  const style = styleFor(ctx, cell);
  const href = cell.linkFrom ? resolveBinding(cell.linkFrom, bindCtx) || undefined : undefined;

  return {
    text: `${cell.prefix ?? ""}${value}${cell.suffix ?? ""}`,
    style,
    role: cell.role ?? "body",
    color: resolveColor(ctx.template, cell.style?.color ?? style.color),
    href,
  };
}

/**
 * Icon cells resolve to a Font Awesome glyph, which lives in a different face
 * from the surrounding text — `solid` for most, `brands` for GitHub/LinkedIn.
 */
function iconFragment(ctx: BlockContext, cell: Cell, bindCtx: BindContext): Fragment | null {
  const glyph = resolveBinding("$link.icon", bindCtx);
  if (!glyph || !bindCtx.link) return null;
  if (!ctx.doc.options.showIcons) return null;
  const base = styleFor(ctx, cell);
  const family = ICON_FACE[bindCtx.link.kind] === "brands" ? "iconBrands" : "icon";
  return {
    text: glyph,
    style: { ...base, family },
    role: "icon",
    color: resolveColor(ctx.template, cell.style?.color ?? base.color),
  };
}

const isPinned = (align: CellAlign | undefined): boolean =>
  align === "right" || align === "center" || (typeof align === "object" && align !== null);

/* ------------------------------------------------------------------ *
 * Row measurement
 * ------------------------------------------------------------------ */

function measureRow(ctx: BlockContext, row: Row, bindCtx: BindContext): MeasuredRows {
  const { book, template } = ctx;
  const leadingRatio = template.typography.base.leadingRatio * ctx.spacingScale;
  const indent = (row.indent ?? 0) * ctx.fontScale;
  const marker = row.marker;
  const textOffset = marker ? marker.textX * ctx.fontScale : 0;
  const startX = ctx.left + indent + textOffset;
  const contentRight = ctx.left + ctx.width;

  const flowing: Fragment[] = [];
  const pinned: { fragments: Fragment[]; align: CellAlign }[] = [];

  for (const cell of row.cells) {
    const fragment =
      cell.bind === "$link.icon" ? iconFragment(ctx, cell, bindCtx) : cellFragment(ctx, cell, bindCtx);
    if (!fragment) continue;
    if (isPinned(cell.align)) {
      pinned.push({ fragments: [fragment], align: cell.align! });
    } else {
      flowing.push(fragment);
    }
  }

  const shapes: ShapeItem[] = [];
  if (!flowing.length && !pinned.length && !row.shape) {
    return { lines: [], shapes, height: 0 };
  }

  // Pass 1 — place pinned cells and find how far the flowing text may run.
  let flowLimit = contentRight;
  const pinnedLines: { line: LineBox; x: number }[] = [];
  const overflowPinLines: LineBox[] = [];
  const pinMeasure = Math.max(ctx.width, 24);

  for (const pin of pinned) {
    const width = pin.fragments.reduce((sum, f) => sum + book.measure(f.text, f.style), 0);

    const wrapPin = () => {
      const wrapped = flowInline(book, pin.fragments, {
        firstWidth: pinMeasure,
        restWidth: pinMeasure,
        startX: ctx.left,
        leadingRatio,
      });
      if (pin.align === "center") centreLines(wrapped, ctx.left, ctx.width);
      else if (pin.align === "right") rightAlignLines(wrapped, contentRight);
      else if (typeof pin.align === "object" && pin.align) {
        const tab = pin.align.tab;
        const tabAlign = pin.align.tabAlign ?? "left";
        for (const line of wrapped) {
          const span = lineWidth(line);
          const absolute = ctx.left + tab;
          let x =
            tabAlign === "right" ? absolute - span : Math.min(absolute, contentRight - span);
          x = Math.max(ctx.left, Math.min(x, contentRight - span));
          shiftLine(line, x - lineStart(line));
        }
      }
      overflowPinLines.push(...wrapped);
    };

    // A centred name or right-aligned date that is wider than the column
    // cannot sit on one line. Wrap it inside the measure rather than letting
    // singleLine place it off the page.
    if (width > ctx.width + 0.5) {
      wrapPin();
      continue;
    }

    let x: number;
    if (pin.align === "right") {
      x = contentRight - width;
    } else if (pin.align === "center") {
      x = ctx.left + (ctx.width - width) / 2;
    } else {
      const tab = (pin.align as { tab: number; tabAlign?: string }).tab;
      const tabAlign = (pin.align as { tabAlign?: string }).tabAlign ?? "left";
      const absolute = ctx.left + tab;
      if (tabAlign === "right") {
        // A right tab defines its own edge — that is the point of it, and
        // Harvard's sits two points past the text column deliberately.
        x = absolute - width;
      } else {
        // A left tab must not push text out of the column. AltaCV declares a
        // 150pt stop that suits its 294pt main column and overshoots its 196pt
        // sidebar; the same row is used in both.
        x = Math.min(absolute, contentRight - width);
      }
    }
    if (x < ctx.left - 0.5) {
      wrapPin();
      continue;
    }
    const line = singleLine(book, pin.fragments, x, leadingRatio);
    if (line) pinnedLines.push({ line, x });
    if (x > startX) flowLimit = Math.min(flowLimit, x - PIN_GUTTER);
  }

  // Pass 2 — flow the rest.
  const flowLines =
    flowing.length > 0
      ? flowInline(book, flowing, {
          firstWidth: Math.max(flowLimit - startX, 24),
          restWidth: Math.max(contentRight - startX, 24),
          startX,
          leadingRatio,
          noWrap: row.wrap === false,
        })
      : [];

  const lines: LineBox[] = flowLines.length ? flowLines : [];

  // Merge the pinned cells onto the first line, creating one if the row has
  // nothing flowing (a lone right-aligned date, for instance).
  if (pinnedLines.length) {
    if (!lines.length) {
      const first = pinnedLines[0].line;
      lines.push({ ascent: first.ascent, height: first.height, pieces: [] });
    }
    for (const { line } of pinnedLines) {
      lines[0].pieces.push(...line.pieces);
      lines[0].ascent = Math.max(lines[0].ascent, line.ascent);
      lines[0].height = Math.max(lines[0].height, line.height);
    }
  }

  if (overflowPinLines.length) lines.push(...overflowPinLines);

  // The bullet marker rides on the first line's baseline.
  if (marker && lines.length) {
    const markerStyle = scaleStyle(ctx, { ...template.typography.roles.bullet, ...marker.style } as TextStyle);
    const markerPiece = singleLine(
      book,
      [
        {
          text: marker.glyph,
          style: markerStyle,
          role: "bullet",
          color: resolveColor(template, marker.style?.color ?? markerStyle.color),
        },
      ],
      ctx.left + indent + marker.x * ctx.fontScale,
      leadingRatio,
    );
    if (markerPiece) lines[0].pieces.unshift(...markerPiece.pieces);
  }

  if (row.shape) {
    const shape = buildShape(ctx, row.shape, bindCtx, lines, contentRight);
    if (shape) {
      shapes.push(shape);
      if (!lines.length) {
        lines.push({ ascent: shape.height, height: shape.height, pieces: [] });
      }
    }
  }

  return { lines, shapes, height: lines.reduce((sum, l) => sum + l.height, 0) };
}

function buildShape(
  ctx: BlockContext,
  spec: ShapeSpec,
  bindCtx: BindContext,
  lines: LineBox[],
  contentRight: number,
): ShapeItem | null {
  const size = (spec.size ?? 5) * ctx.fontScale;
  const gap = (spec.gap ?? 3) * ctx.fontScale;
  const color = resolveColor(ctx.template, spec.color ?? "accent");
  const mutedColor = resolveColor(ctx.template, spec.mutedColor ?? "muted");

  if (spec.kind === "dots") {
    const total = spec.total ?? 5;
    const value = Number(resolveBinding("rating", bindCtx)) || 0;
    const width = total * size * 2 + (total - 1) * gap;
    const x = spec.align === "right" ? contentRight - width : ctx.left;
    const lineHeight = lines[0]?.height ?? size * 2;
    return {
      type: "shape",
      shape: "dots",
      x,
      y: 0,
      width,
      height: Math.max(size * 2, lineHeight),
      color,
      mutedColor,
      value,
      total,
    };
  }
  return null;
}

/* ------------------------------------------------------------------ *
 * Block measurement
 * ------------------------------------------------------------------ */

/**
 * Expands a block's rows — including `repeat` rows, one per bullet or tag —
 * and stacks the resulting lines.
 */
export function measureBlock(ctx: BlockContext, block: BlockLayout): MeasuredRows {
  const lines: LineBox[] = [];
  const shapes: ShapeItem[] = [];
  const bindCtx: BindContext = {
    doc: ctx.doc,
    section: ctx.section,
    entry: ctx.entry,
    dateDash: ctx.template.conventions.dateDash,
  };

  let leadIn = 0;

  /** A row gap lengthens the previous line's advance, or leads the block in. */
  const applyGap = (row: Row) => {
    const gap = (row.gapBefore ?? 0) * ctx.spacingScale;
    if (!gap) return;
    if (lines.length) lines[lines.length - 1].height += gap;
    else leadIn += gap;
  };

  for (const row of block.rows) {
    if (row.when && !bindingHasValue(row.when, bindCtx)) continue;

    if (!row.repeat) {
      const measured = measureRow(ctx, row, bindCtx);
      if (measured.lines.length) applyGap(row);
      lines.push(...measured.lines);
      shapes.push(...measured.shapes);
      continue;
    }

    const items = itemsFor(row.repeat, ctx);
    if (!items.length) continue;

    if (row.inline) {
      // One line built from every item, joined by the row's separator.
      const merged = mergeInline(ctx, row, items, bindCtx);
      if (merged.lines.length) applyGap(row);
      lines.push(...merged.lines);
      shapes.push(...merged.shapes);
      continue;
    }

    items.forEach((item, index) => {
      const measured = measureRow(ctx, row, {
        ...bindCtx,
        item: typeof item === "string" ? item : undefined,
        link: typeof item === "string" ? undefined : item,
        index,
      });
      // Only the first repeated row leads in; the rest are separated by their
      // own leading, which is what a bullet list looks like.
      if (measured.lines.length && index === 0) applyGap(row);
      lines.push(...measured.lines);
      shapes.push(...measured.shapes);
    });
  }

  return { lines, shapes, height: lines.reduce((sum, l) => sum + l.height, 0), leadIn };
}

type RepeatItem = string | ResumeDoc["personal"]["links"][number];

function itemsFor(repeat: NonNullable<Row["repeat"]>, ctx: BlockContext): RepeatItem[] {
  switch (repeat) {
    case "bullets":
      return (ctx.entry?.bullets ?? []).filter((b) => b.trim());
    case "tags":
      return (ctx.entry?.tags ?? []).filter((t) => t.trim());
    case "links":
      return ctx.doc.personal.links.filter((l) => l.label.trim());
  }
}

/**
 * Contact lines and technology lists: every item on one wrapping line with a
 * separator between. The separator is styled like the row's first cell so a
 * template can make it faint without touching the values.
 */
function mergeInline(
  ctx: BlockContext,
  row: Row,
  items: RepeatItem[],
  bindCtx: BindContext,
): MeasuredRows {
  const fragments: Fragment[] = [];
  const separator = row.separator ?? " · ";

  items.forEach((item, index) => {
    const itemCtx: BindContext = {
      ...bindCtx,
      item: typeof item === "string" ? item : undefined,
      link: typeof item === "string" ? undefined : item,
      index,
    };

    if (index > 0 && separator) {
      // Never the icon cell. Awesome-CV's contact line is icon + label pairs,
      // and taking the first cell's style set the " | " separators in Font
      // Awesome, where they came out as empty boxes.
      const sepCell =
        row.cells.find((c) => !c.bind) ??
        row.cells.find((c) => c.bind !== "$link.icon") ??
        row.cells[0];
      const style = styleFor(ctx, { ...sepCell, style: sepCell.style });
      fragments.push({
        text: separator,
        style,
        role: sepCell.role ?? "body",
        color: resolveColor(ctx.template, "muted" in ctx.template.palette ? "muted" : style.color),
      });
    }

    for (const cell of row.cells) {
      if (!cell.bind) continue;
      const fragment =
        cell.bind === "$link.icon" ? iconFragment(ctx, cell, itemCtx) : cellFragment(ctx, cell, itemCtx);
      if (fragment) fragments.push(fragment);
    }
  });

  if (!fragments.length) return { lines: [], shapes: [], height: 0 };

  const leadingRatio = ctx.template.typography.base.leadingRatio * ctx.spacingScale;
  const align = row.cells.find((c) => isPinned(c.align))?.align;
  const startX = ctx.left + (row.indent ?? 0) * ctx.fontScale;
  const contentRight = ctx.left + ctx.width;
  const measure = Math.max(contentRight - startX, 24);

  const lines = flowInline(ctx.book, fragments, {
    firstWidth: measure,
    restWidth: measure,
    startX,
    leadingRatio,
  });

  if (align === "center") centreLines(lines, ctx.left, ctx.width);
  else if (align === "right") rightAlignLines(lines, ctx.left + ctx.width);

  return { lines, shapes: [], height: lines.reduce((sum, l) => sum + l.height, 0) };
}

export function centreLines(lines: LineBox[], left: number, width: number) {
  const right = left + width;
  for (const line of lines) {
    if (!line.pieces.length) continue;
    const span = lineWidth(line);
    let x = span >= width ? left : left + (width - span) / 2;
    if (x < left) x = left;
    if (x + span > right) x = right - span;
    shiftLine(line, x - lineStart(line));
  }
}

export function rightAlignLines(lines: LineBox[], right: number) {
  for (const line of lines) {
    shiftLine(line, right - lineEnd(line));
  }
}

const lineStart = (line: LineBox) => Math.min(...line.pieces.map((p) => p.x));
const lineEnd = (line: LineBox) => Math.max(...line.pieces.map((p) => p.x + p.width));
const lineWidth = (line: LineBox) => (line.pieces.length ? lineEnd(line) - lineStart(line) : 0);

function shiftLine(line: LineBox, dx: number) {
  if (!line.pieces.length || !Number.isFinite(dx)) return;
  for (const piece of line.pieces) piece.x += dx;
}

export function shiftPieces(pieces: TextPiece[], dx: number) {
  for (const piece of pieces) piece.x += dx;
}
