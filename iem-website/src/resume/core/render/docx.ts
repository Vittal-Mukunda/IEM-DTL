/**
 * DOCX output.
 *
 * Unlike PDF and the preview, this one does not read the box tree — a Word
 * document reflows, so absolute coordinates would be the wrong thing to hand
 * it. Instead the emitter walks the *same template block definitions* the
 * layout engine walks, and translates each construct into its Word equivalent:
 *
 *   right-aligned cell  → right tab stop at the content width
 *   pinned tab cell     → tab stop at that position
 *   marker row          → bullet character with a hanging indent
 *   block rule          → paragraph bottom border
 *   leading             → at-least line spacing, in twips (exact boxes clip
 *                         display-size names)
 *
 * The result opens in Word with real, editable styles rather than a picture of
 * a résumé.
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
    characterSpacing: style.tracking ? pt2twip(style.tracking) : undefined,
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

function collectRow(
  template: TemplateDefinition,
  row: Row,
  ctx: BindContext,
  scale: number,
): ParaSpec | undefined {
  const docxProfile = template.emit.docx;
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
      tabStops.push({ type: TabStopType.RIGHT, position: docxProfile.rightTab });
      children.push(new TextRun({ text: "\t" }));
      pushRun(style, text);
      continue;
    }

    if (typeof cell.align === "object" && cell.align !== null) {
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
    const glyph = docxProfile.bulletChar || row.marker.glyph;
    maxSize = Math.max(maxSize, bulletStyle.size * scale);
    children.unshift(new TextRun({ text: "\t" }));
    children.unshift(new TextRun(runOptions(template, bulletStyle, glyph, scale)));
  }

  const indent: IIndentAttributesProperties | undefined = row.marker
    ? { left: pt2twip(row.marker.textX), hanging: pt2twip(row.marker.textX - row.marker.x) }
    : row.indent
      ? { left: pt2twip(row.indent) }
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
  template: TemplateDefinition,
  block: BlockLayout,
  specs: ParaSpec[],
  leading: number,
  options: { rule?: boolean; heading?: boolean; spacingBefore?: number } = {},
): Paragraph[] {
  return specs.map((spec, index) => {
    const isFirst = index === 0;
    const isLast = index === specs.length - 1;
    const before = spec.rowGapBefore + (isFirst ? (options.spacingBefore ?? 0) : 0);
    const line = Math.max(leading, spec.maxSize * 1.2);
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
  template: TemplateDefinition,
  block: BlockLayout,
  ctx: BindContext,
  scale: number,
  leading: number,
  options: { rule?: boolean; heading?: boolean; spacingBefore?: number } = {},
): Paragraph[] {
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
          template,
          { ...row, repeat: undefined, cells: [{ ...cell, bind: undefined, text: items.join(row.separator ?? ", ") }] },
          ctx,
          scale,
        );
        if (spec) specs.push(spec);
        continue;
      }

      for (const item of items) {
        const spec = collectRow(template, { ...row, repeat: undefined }, { ...ctx, item }, scale);
        if (spec) specs.push(spec);
      }
      continue;
    }

    const spec = collectRow(template, row, ctx, scale);
    if (spec) specs.push(spec);
  }

  return specsToParagraphs(template, block, specs, leading, options);
}

function sectionParagraphs(
  template: TemplateDefinition,
  section: Section,
  ctx: BindContext,
  scale: number,
  leading: number,
): Paragraph[] {
  const out: Paragraph[] = [];
  out.push(
    ...buildBlock(template, template.blocks.sectionTitle, { ...ctx, section }, scale, leading, {
      rule: true,
      heading: true,
      spacingBefore: template.spacing.sectionBefore,
    }),
  );

  const block = blockFor(template, section.kind, section.layout);

  if (section.layout === "paragraph") {
    out.push(...buildBlock(template, block, { ...ctx, section }, scale, leading));
    return out;
  }

  section.entries.forEach((entry, index) => {
    out.push(
      ...buildBlock(template, block, { ...ctx, section, entry }, scale, leading, {
        spacingBefore: index === 0 ? template.spacing.sectionAfter : template.spacing.entryGap,
      }),
    );
  });
  return out;
}

type ColumnParas = { main: Paragraph[]; side: Paragraph[] };

function twoColumnTable(template: TemplateDefinition, doc: ResumeDoc, byColumn: ColumnParas): Table {
  const size = doc.options.pageSize === "native" ? template.page.size : doc.options.pageSize;
  const pageWidth = PAGE_SIZES[size].width;
  const contentWidth = pageWidth - template.page.margin.left - template.page.margin.right;
  const specs = template.page.columns!;

  const cells: TableCell[] = [];
  const columnWidths: number[] = [];

  for (const col of specs) {
    const width = pt2twip(contentWidth * col.width);
    columnWidths.push(width);
    const paras = byColumn[col.id];
    cells.push(
      new TableCell({
        width: { size: width, type: WidthType.DXA },
        verticalAlign: VerticalAlignTable.TOP,
        borders: { top: NONE_BORDER, bottom: NONE_BORDER, left: NONE_BORDER, right: NONE_BORDER },
        margins: { top: 0, bottom: 0, left: 0, right: pt2twip(col.gap ?? 0) },
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

export async function renderDocx(doc: ResumeDoc, template: TemplateDefinition): Promise<Uint8Array> {
  const scale = doc.options.fontScale;
  const leading = template.typography.base.size * template.typography.base.leadingRatio * doc.options.lineSpacing;
  const baseCtx: BindContext = { doc, dateDash: template.conventions.dateDash };
  const header = buildBlock(template, template.blocks.header, baseCtx, scale, leading);

  const byColumn: ColumnParas = { main: [], side: [] };
  for (const section of doc.sections) {
    if (isSectionEmpty(section)) continue;
    const col = sectionColumn(section, template.sections.sideKinds);
    byColumn[col].push(...sectionParagraphs(template, section, baseCtx, scale, leading));
  }

  const columns = template.page.columns;
  const children = columns?.length
    ? [...header, twoColumnTable(template, doc, byColumn)]
    : [...header, ...byColumn.main, ...byColumn.side];

  const m = template.page.margin;
  const size = doc.options.pageSize === "native" ? template.page.size : doc.options.pageSize;
  const page = PAGE_SIZES[size];

  const document = new Document({
    creator: "IEM RVCE Resume Builder",
    title: doc.personal.name ? `${doc.personal.name} — Résumé` : "Résumé",
    description: `Built from the ${template.name} template.`,
    styles: {
      default: {
        document: {
          run: {
            font: runFont(template),
            size: pt2half(template.typography.base.size),
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
