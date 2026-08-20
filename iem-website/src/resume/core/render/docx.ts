/**
 * DOCX output.
 *
 * Unlike PDF and the preview, this one does not read the box tree — a Word
 * document reflows, so absolute coordinates would be the wrong thing to hand
 * it. Instead the emitter walks the *same template block definitions* the
 * layout engine walks, and translates each construct into its Word equivalent:
 *
 *   right-aligned cell  → right tab stop at the box's right edge
 *   pinned tab cell     → tab stop at that position
 *   marker row          → bullet character with a hanging indent
 *   block rule          → paragraph bottom border
 *   leading             → at-least line spacing, in twips (exact boxes clip
 *                         display-size names)
 *
 * The result opens in Word with real, editable styles rather than a picture of
 * a résumé.
 *
 * Walking the definitions rather than the box tree means the two can disagree,
 * and there are two things the emitter has to be told rather than assume:
 *
 *   1. **The fit.** The engine's overflow cascade may shrink the type and
 *      tighten the leading to hold a résumé to its page limit. Word has no such
 *      cascade. Handed the *requested* size instead of the fitted one, the
 *      .docx is the un-fitted document — it runs longer than the PDF and spills
 *      past the page the student was shown. Hence {@link DocxFit}.
 *   2. **The page.** Every horizontal position has to be computed for the paper
 *      the student picked, not the paper the template was measured on.
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  LineRuleType,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TabStopType,
  TextRun,
  VerticalAlignTable,
  WidthType,
  type IIndentAttributesProperties,
  type IRunOptions,
  type TabStopDefinition,
} from "docx";
import { isSectionEmpty, sectionColumn, type ResumeDoc, type Section } from "../model";
import {
  blockFor,
  resolveColor,
  type BlockLayout,
  type Cell,
  type Row,
  type TemplateDefinition,
  type TextStyle,
} from "../schema";
import { bindingHasValue, resolveBinding, type BindContext } from "../layout/bind";
import { PAGE_SIZES, PT_PER_TWIP } from "../units";

const pt2twip = (pt: number) => Math.round(pt / PT_PER_TWIP);
/** Word sizes runs in half-points. */
const pt2half = (pt: number) => Math.round(pt * 2);

const NONE_BORDER = { style: BorderStyle.NONE, size: 0, color: "auto" } as const;

/**
 * The fit the layout engine settled on for this résumé.
 *
 * Both fields come straight off a `LayoutResult` (`appliedFontScale` and
 * `appliedSpacing`) — the values the rendered page actually used, which are not
 * the values the student asked for whenever the overflow cascade had to
 * intervene.
 */
export interface DocxFit {
  fontScale: number;
  spacing: number;
}

/** Everything the emit functions need that does not come from the block. */
interface Emit {
  template: TemplateDefinition;
  /** Font scale actually used on the page. Sizes, indents and markers carry it. */
  scale: number;
  /** Spacing multiplier actually used on the page. Every gap carries it. */
  spacing: number;
  /** Base leading in points, already carrying `spacing`. */
  leading: number;
  /** Right tab stop for the box being emitted, in twips. */
  rightTab: number;
}

/* ------------------------------------------------------------------ *
 * Page geometry
 * ------------------------------------------------------------------ */

function pageOf(template: TemplateDefinition, doc: ResumeDoc) {
  const size = doc.options.pageSize === "native" ? template.page.size : doc.options.pageSize;
  return PAGE_SIZES[size];
}

/** Width between the margins, for the paper the student picked. */
function contentWidthOf(template: TemplateDefinition, doc: ResumeDoc): number {
  const m = template.page.margin;
  return pageOf(template, doc).width - m.left - m.right;
}

/**
 * Text width of the page's own box.
 *
 * A gutter template (MIT) hands part of the content width to a label column
 * beside the text, so the text the tab is measured against is narrower than the
 * margins suggest. The layout engine narrows the same way in `frameFor`.
 */
function pageBoxWidth(template: TemplateDefinition, doc: ResumeDoc): number {
  const g = template.page.gutter;
  return contentWidthOf(template, doc) - (g ? g.width + g.gap : 0);
}

/** Right tab stop for a box of `boxWidth` points, in twips. */
function rightTabIn(template: TemplateDefinition, boxWidth: number): number {
  return pt2twip(boxWidth - (template.emit.docx.rightTabInset ?? 0));
}

/* ------------------------------------------------------------------ *
 * Runs and rows
 * ------------------------------------------------------------------ */

function runFont(template: TemplateDefinition): IRunOptions["font"] {
  const name = template.emit.docx.font;
  const fallback = template.emit.docx.fontFallback;
  if (!fallback) return { name, hint: "default" };
  // OOXML has no fallback list for a single script. The east-Asian slot is the
  // one place a second family can be named; Latin still asks for the real face.
  return { ascii: name, hAnsi: name, cs: name, eastAsia: fallback, hint: "default" };
}

function runOptions(
  template: TemplateDefinition,
  style: TextStyle,
  text: string,
  scale: number,
): IRunOptions {
  return {
    text,
    font: runFont(template),
    size: pt2half(style.size * scale),
    bold: style.weight >= 600,
    italics: style.italic,
    allCaps: style.allCaps,
    smallCaps: style.smallCaps,
    underline: style.underline ? {} : undefined,
    color: resolveColor(template, style.color).replace("#", ""),
    characterSpacing: style.tracking ? pt2twip(style.tracking * scale) : undefined,
  };
}

function styleOf(template: TemplateDefinition, cell: Cell): TextStyle {
  const base = template.typography.roles[cell.role ?? "body"];
  return { ...base, ...cell.style };
}

interface ParaSpec {
  children: TextRun[];
  alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
  tabStops?: TabStopDefinition[];
  indent?: IIndentAttributesProperties;
  maxSize: number;
  rowGapBefore: number;
}

function collectRow(emit: Emit, row: Row, ctx: BindContext): ParaSpec | undefined {
  const { template, scale } = emit;
  const children: TextRun[] = [];
  let alignment: (typeof AlignmentType)[keyof typeof AlignmentType] | undefined;
  const tabStops: TabStopDefinition[] = [];
  let maxSize = 0;

  const pushRun = (style: TextStyle, text: string) => {
    maxSize = Math.max(maxSize, style.size * scale);
    children.push(new TextRun(runOptions(template, style, text, scale)));
  };

  for (const cell of row.cells) {
    if (cell.when && !bindingHasValue(cell.when, ctx)) continue;
    const value = cell.bind ? resolveBinding(cell.bind, ctx) : (cell.text ?? "");
    if (cell.bind && !value.trim()) continue;
    if (!cell.bind && !cell.text) continue;

    const style = styleOf(template, cell);
    const text = `${cell.prefix ?? ""}${value}${cell.suffix ?? ""}`;

    if (cell.align === "center") {
      alignment = AlignmentType.CENTER;
      pushRun(style, text);
      continue;
    }

    if (cell.align === "right") {
      tabStops.push({ type: TabStopType.RIGHT, position: emit.rightTab });
      children.push(new TextRun({ text: "\t" }));
      pushRun(style, text);
      continue;
    }

    if (typeof cell.align === "object" && cell.align !== null) {
      // A pinned tab is an offset from the left of the box, which is what the
      // engine treats it as too — it does not move with the paper size.
      tabStops.push({
        type: cell.align.tabAlign === "right" ? TabStopType.RIGHT : TabStopType.LEFT,
        position: pt2twip(cell.align.tab),
      });
      children.push(new TextRun({ text: "\t" }));
      pushRun(style, text);
      continue;
    }

    pushRun(style, text);
  }

  if (!children.length) return undefined;

  if (row.marker) {
    const bulletStyle = styleOf(template, { role: "bullet" });
    const glyph = template.emit.docx.bulletChar || row.marker.glyph;
    maxSize = Math.max(maxSize, bulletStyle.size * scale);
    children.unshift(new TextRun({ text: "\t" }));
    children.unshift(new TextRun(runOptions(template, bulletStyle, glyph, scale)));
  }

  // Indents ride the font scale, as they do in the engine: shrinking the type
  // without shrinking the hanging indent would leave bullets adrift.
  const indent: IIndentAttributesProperties | undefined = row.marker
    ? {
        left: pt2twip(row.marker.textX * scale),
        hanging: pt2twip((row.marker.textX - row.marker.x) * scale),
      }
    : row.indent
      ? { left: pt2twip(row.indent * scale) }
      : undefined;

  return {
    children,
    alignment,
    tabStops: tabStops.length ? tabStops : undefined,
    indent,
    maxSize: maxSize || template.typography.base.size * scale,
    rowGapBefore: row.gapBefore ?? 0,
  };
}

function specsToParagraphs(
  emit: Emit,
  block: BlockLayout,
  specs: ParaSpec[],
  options: { rule?: boolean; heading?: boolean; spacingBefore?: number } = {},
): Paragraph[] {
  const { template } = emit;
  return specs.map((spec, index) => {
    const isFirst = index === 0;
    const isLast = index === specs.length - 1;
    // Gaps ride the spacing multiplier, as they do in the engine.
    const before = (spec.rowGapBefore + (isFirst ? (options.spacingBefore ?? 0) : 0)) * emit.spacing;
    // The engine gives every line `size × leadingRatio × spacing`; a paragraph
    // in Word gets one height for all its runs, so the tallest run sets it. A
    // flat 1.2 here used to ignore both the template's own ratio and the
    // tightening the cascade applied, which is most of why a fitted résumé came
    // out of Word longer than its PDF.
    const ratio = template.typography.base.leadingRatio * emit.spacing;
    const line = Math.max(emit.leading, spec.maxSize * ratio);
    return new Paragraph({
      children: spec.children,
      alignment: spec.alignment,
      tabStops: spec.tabStops,
      indent: spec.indent,
      keepNext: options.heading || undefined,
      spacing: {
        before: pt2twip(before),
        after: 0,
        line: pt2twip(line),
        lineRule: LineRuleType.AT_LEAST,
      },
      border:
        isLast && options.rule && template.emit.docx.sectionRule
          ? {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 6,
                space: 1,
                color: resolveColor(template, block.rule?.color ?? "ink").replace("#", ""),
              },
            }
          : undefined,
    });
  });
}

function buildBlock(
  emit: Emit,
  block: BlockLayout,
  ctx: BindContext,
  options: { rule?: boolean; heading?: boolean; spacingBefore?: number } = {},
): Paragraph[] {
  const { template, scale } = emit;
  const specs: ParaSpec[] = [];

  for (const row of block.rows) {
    if (row.when && !bindingHasValue(row.when, ctx)) continue;

    if (row.repeat === "links") {
      const links = ctx.doc.personal.links.filter((l) => l.label.trim());
      if (!links.length) continue;
      const cell = row.cells.find((c) => c.bind === "$link.label") ?? row.cells[0];
      const style = styleOf(template, cell);
      const children: TextRun[] = [];
      links.forEach((link, i) => {
        if (i > 0) {
          children.push(new TextRun(runOptions(template, style, row.separator ?? " • ", scale)));
        }
        children.push(new TextRun(runOptions(template, style, link.label, scale)));
      });
      specs.push({
        children,
        alignment: row.cells.some((c) => c.align === "center") ? AlignmentType.CENTER : undefined,
        maxSize: style.size * scale,
        rowGapBefore: row.gapBefore ?? 0,
      });
      continue;
    }

    if (row.repeat === "bullets" || row.repeat === "tags") {
      const items =
        row.repeat === "bullets"
          ? (ctx.entry?.bullets ?? []).filter((b) => b.trim())
          : (ctx.entry?.tags ?? []).filter((t) => t.trim());
      if (!items.length) continue;

      if (row.inline) {
        const cell = row.cells.find((c) => c.bind === "$item") ?? row.cells[0];
        const spec = collectRow(
          emit,
          { ...row, repeat: undefined, cells: [{ ...cell, bind: undefined, text: items.join(row.separator ?? ", ") }] },
          ctx,
        );
        if (spec) specs.push(spec);
        continue;
      }

      for (const item of items) {
        const spec = collectRow(emit, { ...row, repeat: undefined }, { ...ctx, item });
        if (spec) specs.push(spec);
      }
      continue;
    }

    const spec = collectRow(emit, row, ctx);
    if (spec) specs.push(spec);
  }

  return specsToParagraphs(emit, block, specs, options);
}

function sectionParagraphs(emit: Emit, section: Section, ctx: BindContext): Paragraph[] {
  const { template } = emit;
  const out: Paragraph[] = [];
  out.push(
    ...buildBlock(emit, template.blocks.sectionTitle, { ...ctx, section }, {
      rule: true,
      heading: true,
      spacingBefore: template.spacing.sectionBefore,
    }),
  );

  const block = blockFor(template, section.kind, section.layout);

  if (section.layout === "paragraph") {
    out.push(...buildBlock(emit, block, { ...ctx, section }));
    return out;
  }

  section.entries.forEach((entry, index) => {
    out.push(
      ...buildBlock(emit, block, { ...ctx, section, entry }, {
        spacingBefore: index === 0 ? template.spacing.sectionAfter : template.spacing.entryGap,
      }),
    );
  });
  return out;
}

type ColumnParas = { main: Paragraph[]; side: Paragraph[] };

/**
 * Lay the two columns out as one borderless table row.
 *
 * The cell carries its gutter as a right *margin*, and Word takes a cell margin
 * out of the cell's own width. So the cell has to be the column plus its gap
 * for the text inside to end up as wide as the engine's column — and for the
 * columns together to fill the content width rather than falling short by the
 * sum of the gaps.
 */
function twoColumnTable(template: TemplateDefinition, doc: ResumeDoc, byColumn: ColumnParas): Table {
  const contentWidth = contentWidthOf(template, doc);
  const specs = template.page.columns!;

  const cells: TableCell[] = [];
  const columnWidths: number[] = [];

  for (const col of specs) {
    const gap = col.gap ?? 0;
    const width = pt2twip(contentWidth * col.width + gap);
    columnWidths.push(width);
    const paras = byColumn[col.id];
    cells.push(
      new TableCell({
        width: { size: width, type: WidthType.DXA },
        verticalAlign: VerticalAlignTable.TOP,
        borders: { top: NONE_BORDER, bottom: NONE_BORDER, left: NONE_BORDER, right: NONE_BORDER },
        margins: { top: 0, bottom: 0, left: 0, right: pt2twip(gap) },
        children: paras.length ? paras : [new Paragraph({})],
      }),
    );
  }

  const tableWidth = columnWidths.reduce((sum, w) => sum + w, 0);
  return new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths,
    layout: TableLayoutType.FIXED,
    borders: {
      top: NONE_BORDER,
      bottom: NONE_BORDER,
      left: NONE_BORDER,
      right: NONE_BORDER,
      insideHorizontal: NONE_BORDER,
      insideVertical: NONE_BORDER,
    },
    rows: [new TableRow({ children: cells })],
  });
}

export async function renderDocx(
  doc: ResumeDoc,
  template: TemplateDefinition,
  fit: DocxFit,
): Promise<Uint8Array> {
  const base: Omit<Emit, "rightTab"> = {
    template,
    scale: fit.fontScale,
    spacing: fit.spacing,
    leading:
      template.typography.base.size * template.typography.base.leadingRatio * fit.spacing,
  };

  const pageEmit: Emit = { ...base, rightTab: rightTabIn(template, pageBoxWidth(template, doc)) };
  const baseCtx: BindContext = { doc, dateDash: template.conventions.dateDash };
  const header = buildBlock(pageEmit, template.blocks.header, baseCtx);

  // Inside a table cell Word measures a tab from the cell's own left edge, so
  // each column gets a stop cut to its own width rather than the page's.
  const contentWidth = contentWidthOf(template, doc);
  const columns = template.page.columns;
  const emitFor = (column: "main" | "side"): Emit => {
    const spec = columns?.find((c) => c.id === column);
    if (!spec) return pageEmit;
    return { ...base, rightTab: rightTabIn(template, contentWidth * spec.width) };
  };

  const byColumn: ColumnParas = { main: [], side: [] };
  for (const section of doc.sections) {
    if (isSectionEmpty(section)) continue;
    const col = sectionColumn(section, template.sections.sideKinds);
    byColumn[col].push(...sectionParagraphs(emitFor(col), section, baseCtx));
  }

  const children = columns?.length
    ? [...header, twoColumnTable(template, doc, byColumn)]
    : [...header, ...byColumn.main, ...byColumn.side];

  const m = template.page.margin;
  const page = pageOf(template, doc);

  const document = new Document({
    creator: "IEM RVCE Resume Builder",
    title: doc.personal.name ? `${doc.personal.name} — Résumé` : "Résumé",
    description: `Built from the ${template.name} template.`,
    styles: {
      default: {
        document: {
          run: {
            font: runFont(template),
            size: pt2half(template.typography.base.size * fit.fontScale),
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: pt2twip(m.top),
              right: pt2twip(m.right),
              bottom: pt2twip(m.bottom),
              left: pt2twip(m.left),
            },
            size: { width: pt2twip(page.width), height: pt2twip(page.height) },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(document);
  return new Uint8Array(await blob.arrayBuffer());
}

export function docxBlob(bytes: Uint8Array): Blob {
  return new Blob([bytes as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
