/**
 * The layout engine.
 *
 * `layoutResume` is the only entry point anything outside `core/` should call.
 * It measures every block once per attempt, paginates, and — when the result
 * overruns — walks the integrity cascade (tighten spacing, then shrink type,
 * never below the template's floor) before giving up and reporting an overflow
 * the student can act on.
 */

import { FontBook } from "../fonts";
import { isSectionEmpty, sectionColumn, type ResumeDoc, type Section } from "../model";
import {
  blockFor,
  resolveColor,
  type BlockLayout,
  type TemplateDefinition,
} from "../schema";
import { clamp, PAGE_SIZES, q } from "../units";
import { measureBlock, type BlockContext } from "./block";
import type {
  LayoutItem,
  LayoutPage,
  LayoutResult,
  LayoutWarning,
  LineBox,
  MeasuredBlock,
  ShapeItem,
  TextItem,
} from "./types";

export * from "./types";

export interface LayoutInput {
  doc: ResumeDoc;
  template: TemplateDefinition;
  book: FontBook;
}

interface Frame {
  pageWidth: number;
  pageHeight: number;
  top: number;
  bottom: number;
  columns: { id: "main" | "side"; left: number; width: number }[];
  gutter?: { left: number; width: number; contentLeft: number; contentWidth: number };
}

function frameFor(template: TemplateDefinition, doc: ResumeDoc): Frame {
  const size =
    doc.options.pageSize === "native" ? template.page.size : doc.options.pageSize;
  const { width: pageWidth, height: pageHeight } = PAGE_SIZES[size];
  const m = template.page.margin;
  const contentLeft = m.left;
  const contentWidth = pageWidth - m.left - m.right;

  const columns = template.page.columns?.length
    ? (() => {
        let x = contentLeft;
        return template.page.columns!.map((col) => {
          const width = contentWidth * col.width;
          const entry = { id: col.id, left: x, width };
          x += width + (col.gap ?? 0);
          return entry;
        });
      })()
    : [{ id: "main" as const, left: contentLeft, width: contentWidth }];

  const gutterSpec = template.page.gutter;
  const gutter = gutterSpec
    ? {
        left: contentLeft,
        width: gutterSpec.width,
        contentLeft: contentLeft + gutterSpec.width + gutterSpec.gap,
        contentWidth: contentWidth - gutterSpec.width - gutterSpec.gap,
      }
    : undefined;

  if (gutter) {
    columns[0] = { id: "main", left: gutter.contentLeft, width: gutter.contentWidth };
  }

  return {
    pageWidth,
    pageHeight,
    top: m.top,
    bottom: pageHeight - m.bottom,
    columns,
    gutter,
  };
}

/* ------------------------------------------------------------------ *
 * Building the block flow
 * ------------------------------------------------------------------ */

function buildBlocks(
  input: LayoutInput,
  frame: Frame,
  fontScale: number,
  spacingScale: number,
): MeasuredBlock[] {
  const { doc, template, book } = input;
  const blocks: MeasuredBlock[] = [];
  const gutterSpec = template.page.gutter;
  const s = template.spacing;

  const sideKinds = template.sections.sideKinds ?? [];
  /** A section's own choice wins; otherwise the template's default. */
  const columnOf = (section?: Section): "main" | "side" =>
    section ? sectionColumn(section, sideKinds) : "main";

  const columnFor = (section?: Section) =>
    frame.columns.find((c) => c.id === columnOf(section)) ?? frame.columns[0];

  const context = (
    section: Section | undefined,
    entry: BlockContext["entry"],
    left: number,
    width: number,
  ): BlockContext => ({
    template,
    book,
    doc,
    section,
    entry,
    left,
    width,
    fontScale,
    spacingScale,
  });

  const ruleFor = (block: BlockLayout, left: number, width: number) => {
    if (!block.rule) return undefined;
    const inset = block.rule.inset ?? 0;
    return {
      thickness: block.rule.thickness,
      color: resolveColor(template, block.rule.color),
      gap: block.rule.gap * spacingScale,
      x: left + inset,
      width: width - inset * 2,
      position: block.rule.position,
    };
  };

  // ---- header -----------------------------------------------------
  // Always the full content width. In AltaCV the header is set before
  // `egin{paracol}`, and MIT's addresses straddle the label gutter — in both
  // cases confining it to the first column would be wrong.
  const headerLeft = template.page.margin.left;
  const headerWidth = frame.pageWidth - template.page.margin.left - template.page.margin.right;

  const headerMeasured = measureBlock(
    context(undefined, undefined, headerLeft, headerWidth),
    template.blocks.header,
  );
  if (headerMeasured.lines.length) {
    blocks.push({
      id: "header",
      kind: "header",
      lines: headerMeasured.lines,
      shapes: headerMeasured.shapes,
      height: headerMeasured.height,
      gapBefore: headerMeasured.leadIn ?? 0,
      gapAfter: s.headerAfter * spacingScale,
      rule: ruleFor(template.blocks.header, headerLeft, headerWidth),
      keepWithNext: true,
      atomicLines: headerMeasured.lines.length,
      column: "main",
    });
  }

  const lastAfter: { main?: number; side?: number } = {};

  // ---- sections ---------------------------------------------------
  for (const section of doc.sections) {
    if (isSectionEmpty(section)) {
      // No warning for an untouched section. A student who has not reached
      // "Projects" yet does not need to be told it is empty — they can see
      // that. The warning is reserved for content that will not print.
      continue;
    }

    const col = columnFor(section);
    const column = columnOf(section);
    const titleInGutter = gutterSpec?.carries === "sectionTitle" && column !== "side";
    const titleLeft = titleInGutter ? frame.gutter!.left : col.left;
    const titleWidth = titleInGutter ? frame.gutter!.width : col.width;

    const titleMeasured = measureBlock(
      context(section, undefined, titleLeft, titleWidth),
      template.blocks.sectionTitle,
    );

    const entryBlock = blockFor(template, section.kind, section.layout);
    const entries =
      section.layout === "paragraph"
        ? [undefined]
        : section.entries.filter(
            (e) =>
              e.organization?.trim() ||
              e.position?.trim() ||
              e.summary?.trim() ||
              e.detail?.trim() ||
              e.bullets.some((b) => b.trim()) ||
              e.tags.some((t) => t.trim()),
          );

    const titleGap = (lastAfter[column] ?? s.sectionBefore) * spacingScale;

    let pendingGutter: MeasuredBlock["gutter"] | undefined;
    if (titleInGutter && titleMeasured.lines.length) {
      pendingGutter = {
        lines: titleMeasured.lines,
        align: gutterSpec!.align,
        width: frame.gutter!.width,
      };
    } else if (titleMeasured.lines.length) {
      blocks.push({
        id: `${section.id}:title`,
        kind: "sectionTitle",
        sectionId: section.id,
        lines: titleMeasured.lines,
        shapes: titleMeasured.shapes,
        height: titleMeasured.height,
        gapBefore: titleGap + (titleMeasured.leadIn ?? 0),
        gapAfter: s.sectionAfter * spacingScale,
        rule: ruleFor(template.blocks.sectionTitle, titleLeft, titleWidth),
        keepWithNext: true,
        atomicLines: titleMeasured.lines.length,
        column,
      });
    }

    entries.forEach((entry, index) => {
      const measured = measureBlock(context(section, entry, col.left, col.width), entryBlock);
      if (!measured.lines.length) return;

      let gutter = pendingGutter;
      pendingGutter = undefined;

      // Stanford's date gutter: one date per entry, beside its first line.
      if (gutterSpec?.carries === "entryDates" && entry) {
        const dateBlock: BlockLayout = {
          rows: [{ cells: [{ bind: "dateRange", role: "entryMeta", align: gutterSpec.align === "right" ? "right" : "left" }] }],
        };
        const dates = measureBlock(
          context(section, entry, frame.gutter!.left, frame.gutter!.width),
          dateBlock,
        );
        if (dates.lines.length) {
          gutter = { lines: dates.lines, align: gutterSpec.align, width: frame.gutter!.width };
        }
      }

      blocks.push({
        id: `${section.id}:${index}`,
        kind: "entry",
        sectionId: section.id,
        lines: measured.lines,
        shapes: measured.shapes,
        height: measured.height,
        // A block may override the template-wide gap: Harvard's skill lines
        // are consecutive lines, not separate entries with air between them.
        gapBefore:
          (index === 0 ? 0 : (entryBlock.gapBefore ?? s.entryGap) * spacingScale) +
          (measured.leadIn ?? 0),
        gapAfter: (entryBlock.gapAfter ?? 0) * spacingScale,
        keepWithNext: false,
        // The heading rows of an entry never separate from each other.
        atomicLines: Math.min(2, measured.lines.length),
        gutter,
        column,
      });
    });

    // A section title in the gutter with no entry to attach to still prints.
    if (pendingGutter) {
      blocks.push({
        id: `${section.id}:title`,
        kind: "sectionTitle",
        sectionId: section.id,
        lines: [],
        shapes: [],
        height: pendingGutter.lines.reduce((sum, l) => sum + l.height, 0),
        gapBefore: titleGap,
        gapAfter: s.sectionAfter * spacingScale,
        keepWithNext: false,
        atomicLines: 0,
        gutter: pendingGutter,
        column,
      });
    }

    lastAfter[column] = section.spacingAfter ?? s.sectionBefore;
  }

  return blocks;
}

/* ------------------------------------------------------------------ *
 * Pagination
 * ------------------------------------------------------------------ */

interface Placement {
  block: MeasuredBlock;
  lines: LineBox[];
  y: number;
  /** Only the first fragment of a split block carries its gutter and rule. */
  first: boolean;
  last: boolean;
}

function paginateColumn(
  blocks: MeasuredBlock[],
  frame: Frame,
  maxPages: number,
  /**
   * Where this column starts on page one. The sidebar of a two-column template
   * begins below the header, which spans both columns — without this it would
   * start at the top margin and print straight through the name.
   */
  firstPageTop = frame.top,
): { pages: Placement[][]; overflowBy: number } {
  const pages: Placement[][] = [];
  let current: Placement[] = [];
  let y = firstPageTop;
  let overflowBy = 0;

  const available = () => frame.bottom - y;
  const newPage = () => {
    pages.push(current);
    current = [];
    y = frame.top;
  };

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const atColumnStart = current.length === 0;
    const continuationPage = pages.length > 0;
    // Continuation pages start at the top margin, so a section gap would punch
    // a hole there. Page one of a column must keep `gapBefore` — otherwise the
    // first sidebar heading loses `sectionBefore` while the main column (whose
    // first block is the header) keeps it.
    const gap = atColumnStart && continuationPage ? 0 : block.gapBefore;
    const ruleBefore = block.rule?.position === "before" ? block.rule.gap + block.rule.thickness : 0;
    const ruleAfter = block.rule?.position === "after" ? block.rule.gap + block.rule.thickness : 0;
    const chrome = gap + ruleBefore + ruleAfter;

    // A heading must not be the last thing on a page.
    if (block.keepWithNext && current.length) {
      const next = blocks[i + 1];
      const needed = chrome + block.height + (next ? next.gapBefore + firstChunkHeight(next) : 0);
      if (needed > available()) {
        newPage();
      }
    }

    if (chrome + block.height <= available() || !current.length) {
      if (chrome + block.height <= available()) {
        y += gap + ruleBefore;
        current.push({ block, lines: block.lines, y, first: true, last: true });
        y += block.height + ruleAfter + block.gapAfter;
        continue;
      }
    }

    // Try to split: keep the atomic head together, move the rest on.
    const head = splitPoint(block, available() - chrome);
    if (head > block.atomicLines && head < block.lines.length) {
      y += gap + ruleBefore;
      current.push({
        block,
        lines: block.lines.slice(0, head),
        y,
        first: true,
        last: false,
      });
      newPage();
      current.push({ block, lines: block.lines.slice(head), y, first: false, last: true });
      y = frame.top + block.lines.slice(head).reduce((s, l) => s + l.height, 0) + block.gapAfter;
      continue;
    }

    newPage();
    y += ruleBefore;
    current.push({ block, lines: block.lines, y, first: true, last: true });
    y += block.height + ruleAfter + block.gapAfter;
  }

  if (current.length) pages.push(current);

  if (pages.length > maxPages) {
    // How much would have to disappear for the content to fit the target.
    const lastPage = pages[pages.length - 1];
    const usedOnLast = lastPage.reduce(
      (max, p) => Math.max(max, p.y + p.lines.reduce((s, l) => s + l.height, 0)),
      frame.top,
    );
    overflowBy =
      (pages.length - maxPages - 1) * (frame.bottom - frame.top) + (usedOnLast - frame.top);
  }

  return { pages, overflowBy };
}

const firstChunkHeight = (block: MeasuredBlock) =>
  block.lines.slice(0, Math.max(1, block.atomicLines)).reduce((s, l) => s + l.height, 0);

/** How many of a block's lines fit in `space`, respecting widow control. */
function splitPoint(block: MeasuredBlock, space: number): number {
  let used = 0;
  let count = 0;
  for (const line of block.lines) {
    if (used + line.height > space) break;
    used += line.height;
    count += 1;
  }
  // Never orphan a single trailing line.
  if (count === block.lines.length - 1) count -= 1;
  return count;
}

/* ------------------------------------------------------------------ *
 * Emission
 * ------------------------------------------------------------------ */

function emit(placements: Placement[][], frame: Frame): LayoutPage[] {
  return placements.map((page) => {
    const items: LayoutItem[] = [];

    for (const placement of page) {
      const { block } = placement;
      // `y` is a baseline throughout. Working in baseline space rather than
      // line-top space is what makes a template's numbers the same numbers the
      // forensics produced: every gap in a definition is a measured
      // baseline-to-baseline distance, with no ascent arithmetic in between.
      let y = placement.y;

      if (placement.first && block.rule?.position === "before") {
        items.push({
          type: "rule",
          x: block.rule.x,
          y: q(y - block.rule.gap),
          width: block.rule.width,
          thickness: block.rule.thickness,
          color: block.rule.color,
        });
      }

      if (placement.first && block.gutter) {
        let gy = y;
        for (const line of block.gutter.lines) {
          items.push(lineToItem(line, gy));
          gy += line.height;
        }
      }

      let lastBaseline = y;
      for (const line of placement.lines) {
        items.push(lineToItem(line, y));
        lastBaseline = y;
        for (const shape of block.shapes) {
          if (shape.y === 0) {
            items.push({ ...shape, y: q(y - line.ascent + (line.height - shape.height) / 2) } as ShapeItem);
            shape.y = -1; // consumed
          }
        }
        y += line.height;
      }

      if (placement.last && (block.rule?.position === "after" || block.rule?.position === "underline")) {
        const anchor = block.rule.position === "underline" ? lastBaseline : y;
        items.push({
          type: "rule",
          x: block.rule.x,
          y: q(anchor + block.rule.gap),
          width: block.rule.width,
          thickness: block.rule.thickness,
          color: block.rule.color,
        });
      }
    }

    return { width: frame.pageWidth, height: frame.pageHeight, items };
  });
}

function lineToItem(line: LineBox, baseline: number): TextItem {
  return {
    type: "text",
    y: q(baseline),
    pieces: line.pieces.map((p) => ({ ...p, x: q(p.x) })),
  };
}

/* ------------------------------------------------------------------ *
 * The cascade
 * ------------------------------------------------------------------ */

interface Attempt {
  fontScale: number;
  spacingScale: number;
  pages: LayoutPage[];
  overflowBy: number;
  warnings: LayoutWarning[];
}

function attempt(
  input: LayoutInput,
  frame: Frame,
  fontScale: number,
  spacingScale: number,
): Attempt {
  const warnings: LayoutWarning[] = [];
  const blocks = buildBlocks(input, frame, fontScale, spacingScale);
  const maxPages = Math.max(1, input.doc.options.maxPages);

  const columns = input.template.page.columns?.length
    ? input.template.page.columns.map((c) => c.id)
    : (["main"] as const);

  // Two-column templates paginate each column independently, then merge —
  // which is exactly how AltaCV's `paracol` behaves.
  // The header is a full-width band above both columns, so the sidebar's first
  // page starts where the header finishes.
  const header = blocks.find((b) => b.kind === "header");
  const afterHeader = header ? frame.top + header.height + header.gapAfter : frame.top;

  const perColumn = columns.map((id) =>
    paginateColumn(
      blocks.filter((b) => b.column === id),
      frame,
      maxPages,
      id === "main" ? frame.top : afterHeader,
    ),
  );

  const pageCount = Math.max(...perColumn.map((c) => c.pages.length));
  const merged: Placement[][] = [];
  for (let i = 0; i < pageCount; i += 1) {
    merged.push(perColumn.flatMap((c) => c.pages[i] ?? []));
  }

  // A résumé with nothing in it still has a page — the preview needs a sheet to
  // draw, and every renderer downstream assumes at least one.
  const pages = emit(merged, frame);
  if (!pages.length) {
    pages.push({ width: frame.pageWidth, height: frame.pageHeight, items: [] });
  }

  return {
    fontScale,
    spacingScale,
    pages,
    overflowBy: Math.max(...perColumn.map((c) => c.overflowBy)),
    warnings,
  };
}

/**
 * Lay the résumé out, adjusting only as far as the template permits.
 *
 * Order matters: spacing is compressed before type is shrunk, because a reader
 * notices a smaller font long before they notice a tighter gap between entries.
 * Nothing is ever truncated — if the content still will not fit at the floor,
 * the result overflows and says by how much.
 */
export function layoutResume(input: LayoutInput): LayoutResult {
  const { template, doc } = input;
  const frame = frameFor(template, doc);
  const rules = template.rules;

  // The legibility floor binds the student's own choice too, not just the
  // overflow cascade — otherwise dragging the size slider to its minimum could
  // put text below a size the template itself calls unreadable.
  //
  // Measured against the *smallest* role that carries reading text, not against
  // `body`. Awesome-CV sets job titles two points below its body size, and
  // scaling from the larger of the two would take them under the floor.
  const smallestReading = Math.min(
    template.typography.roles.body.size,
    template.typography.roles.entryTitle.size,
    template.typography.roles.entrySubtitle.size,
    template.typography.roles.sectionTitle.size,
  );
  const scaleFloor = Math.max(rules.fontScale.min, rules.minBodySize / smallestReading);
  const baseFont = clamp(doc.options.fontScale, scaleFloor, rules.fontScale.max);
  const baseSpacing = clamp(doc.options.lineSpacing, rules.lineSpacing.min, rules.lineSpacing.max);

  let best = attempt(input, frame, baseFont, baseSpacing);
  if (best.overflowBy <= 0) return finish(best, template, false, false);

  // 1 — compress spacing within the template's declared slack.
  const minSpacing = Math.max(rules.lineSpacing.min, baseSpacing * (1 - rules.spacingSlack));
  for (let spacing = baseSpacing - 0.02; spacing >= minSpacing - 1e-6; spacing -= 0.02) {
    const next = attempt(input, frame, baseFont, spacing);
    if (next.overflowBy < best.overflowBy) best = next;
    if (next.overflowBy <= 0) return finish(next, template, false, true);
  }

  // 2 — shrink type, never past the floor.
  const minFontScale = scaleFloor;
  for (let scale = baseFont - rules.fontScale.step; scale >= minFontScale - 1e-6; scale -= rules.fontScale.step) {
    const next = attempt(input, frame, scale, minSpacing);
    if (next.overflowBy < best.overflowBy) best = next;
    if (next.overflowBy <= 0) return finish(next, template, true, true);
  }

  return finish(best, template, best.fontScale < baseFont, best.spacingScale < baseSpacing);
}

function finish(
  a: Attempt,
  template: TemplateDefinition,
  scaled: boolean,
  compressed: boolean,
): LayoutResult {
  const warnings = [...a.warnings];

  // A warning a student cannot act on is noise. Tightening the leading by a few
  // per cent is inside every template's declared slack, is invisible on the
  // page, and needs no decision from anyone — so it is only reported once it
  // becomes large enough to see.
  if (compressed && a.spacingScale < 0.95) {
    warnings.push({
      code: "spacing-compressed",
      message: `Spacing tightened to ${Math.round(a.spacingScale * 100)}% to fit the page.`,
    });
  }
  if (scaled) {
    warnings.push({
      code: "font-scaled",
      message: `Type scaled to ${Math.round(a.fontScale * 100)}% (floor is ${template.rules.minBodySize}pt) to fit the page.`,
    });
  }
  if (a.overflowBy > 0) {
    const lines = Math.ceil(a.overflowBy / (template.typography.roles.body.size * 1.2));
    warnings.push({
      code: "overflow",
      message: `Content runs about ${lines} line${lines === 1 ? "" : "s"} past the page limit. Trim some text, or allow another page.`,
    });
  }

  return {
    pages: a.pages,
    appliedFontScale: a.fontScale,
    appliedSpacing: a.spacingScale,
    warnings,
    overflowBy: Math.max(0, a.overflowBy),
  };
}
