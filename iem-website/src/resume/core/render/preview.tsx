"use client";

/**
 * The live preview.
 *
 * Rendered as SVG, and that is the whole trick. SVG `<text>` is positioned by
 * its baseline — the same anchor PDF uses — so the preview and the download
 * cannot drift the way absolutely-positioned HTML would. Setting `textLength`
 * on every run pins each one to the width the engine measured, which closes the
 * last gap between what the browser thinks a string is worth and what the PDF
 * writer will use.
 *
 * Nothing here consults the résumé or the template: it reads the box tree and
 * draws it, exactly as the PDF, TEX and DOCX writers do.
 */

import { Fragment, useEffect, useMemo } from "react";
import type { FontBook } from "../fonts";
import type { LayoutPage, LayoutResult, ShapeItem, TextItem } from "../layout/types";
import type { TemplateDefinition } from "../schema";

export interface PreviewProps {
  layout: LayoutResult;
  template: TemplateDefinition;
  book: FontBook;
  /** Page width in CSS pixels. Points scale to fit. */
  width?: number;
  className?: string;
}

/**
 * `@font-face` rules for exactly the faces this template uses, emitted once per
 * template. Declared here rather than in a stylesheet so a new template needs
 * no CSS: it declares its families and the preview follows.
 */
function fontFaceCss(template: TemplateDefinition): string {
  const rules: string[] = [];
  for (const family of template.typography.families) {
    for (const [faceKey, file] of Object.entries(family.faces)) {
      const italic = faceKey.endsWith("i");
      const weight = parseInt(faceKey, 10);
      rules.push(
        `@font-face{font-family:"${family.cssName}";` +
          `src:url("/fonts/resume/${file}") format("truetype");` +
          `font-weight:${weight};font-style:${italic ? "italic" : "normal"};font-display:swap;}`,
      );
    }
  }
  return rules.join("\n");
}

function TextNode({
  item,
  cssFor,
}: {
  item: TextItem;
  cssFor: (family: string) => string;
}) {
  return (
    <>
      {item.pieces.map((piece, pieceIndex) => {
        const runs = piece.runs.map((run, runIndex) => (
          <text
            key={runIndex}
            x={piece.x + run.dx}
            y={item.y}
            fill={piece.color}
            fontFamily={cssFor(piece.style.family)}
            fontSize={run.size}
            fontWeight={piece.style.weight}
            fontStyle={piece.style.italic ? "italic" : "normal"}
            textDecoration={piece.style.underline ? "underline" : undefined}
            // Pin the run to the width the engine measured. Without this the
            // browser's own shaping could drift a fraction of a point per run,
            // and the preview would stop matching the download.
            textLength={run.text.length > 1 ? run.width : undefined}
            lengthAdjust="spacing"
            xmlSpace="preserve"
          >
            {run.text}
          </text>
        ));

        return (
          <Fragment key={pieceIndex}>
            {piece.href ? (
              <a href={piece.href} target="_blank" rel="noopener noreferrer">
                {runs}
              </a>
            ) : (
              runs
            )}
          </Fragment>
        );
      })}
    </>
  );
}

function ShapeNode({ shape }: { shape: ShapeItem }) {
  if (shape.shape === "dots") {
    const total = shape.total ?? 5;
    const filled = shape.value ?? 0;
    const radius = shape.height / 4;
    const step = (shape.width - radius * 2) / Math.max(1, total - 1);
    return (
      <>
        {Array.from({ length: total }, (_, i) => (
          <circle
            key={i}
            cx={shape.x + radius + i * step}
            cy={shape.y + shape.height / 2}
            r={radius}
            fill={i < filled ? shape.color : shape.mutedColor}
          />
        ))}
      </>
    );
  }

  if (shape.shape === "pill") {
    return (
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rx={shape.height / 2}
        fill="none"
        stroke={shape.mutedColor}
        strokeWidth={0.5}
      />
    );
  }

  if (shape.shape === "wheel" && shape.slices?.length) {
    const cx = shape.x + shape.width / 2;
    const cy = shape.y + shape.height / 2;
    const outer = Math.min(shape.width, shape.height) / 2;
    const inner = outer * 0.45;
    // Each slice's start angle is derived from the ones before it, rather than
    // accumulated in a variable during render.
    const starts = shape.slices.reduce<number[]>(
      (acc, slice, i) => [...acc, acc[i] + slice.fraction * Math.PI * 2],
      [-Math.PI / 2],
    );

    return (
      <>
        {shape.slices.map((slice, i) => {
          const from = starts[i];
          const to = starts[i + 1];
          const large = to - from > Math.PI ? 1 : 0;
          const path = [
            `M ${cx + outer * Math.cos(from)} ${cy + outer * Math.sin(from)}`,
            `A ${outer} ${outer} 0 ${large} 1 ${cx + outer * Math.cos(to)} ${cy + outer * Math.sin(to)}`,
            `L ${cx + inner * Math.cos(to)} ${cy + inner * Math.sin(to)}`,
            `A ${inner} ${inner} 0 ${large} 0 ${cx + inner * Math.cos(from)} ${cy + inner * Math.sin(from)}`,
            "Z",
          ].join(" ");
          return <path key={i} d={path} fill={slice.color} />;
        })}
      </>
    );
  }

  return null;
}

function Page({
  page,
  cssFor,
  width,
}: {
  page: LayoutPage;
  cssFor: (family: string) => string;
  width: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${page.width} ${page.height}`}
      width={width}
      height={(width * page.height) / page.width}
      role="img"
      aria-label="Résumé page preview"
      style={{
        display: "block",
        background: "#ffffff",
        colorScheme: "only light",
        forcedColorAdjust: "none",
      }}
    >
      {page.items.map((item, index) => {
        if (item.type === "rule") {
          return (
            <rect
              key={index}
              x={item.x}
              y={item.y}
              width={item.width}
              height={Math.max(item.thickness, 0.2)}
              fill={item.color}
            />
          );
        }
        if (item.type === "shape") return <ShapeNode key={index} shape={item} />;
        return <TextNode key={index} item={item} cssFor={cssFor} />;
      })}
    </svg>
  );
}

export function ResumePreview({ layout, template, book, width = 612, className }: PreviewProps) {
  const css = useMemo(() => fontFaceCss(template), [template]);
  const cssFor = useMemo(() => {
    const map = new Map(template.typography.families.map((f) => [f.key, f.cssName]));
    return (family: string) => {
      const cssName = map.get(family) ?? "serif";
      const generic =
        family === "sans" || family === "display" || family === "icon"
          ? "Helvetica, Arial, sans-serif"
          : '"Times New Roman", Times, serif';
      return `"${cssName}", ${generic}`;
    };
  }, [template]);

  useEffect(() => {
    void book.registerCssFaces?.();
  }, [book]);

  return (
    <div
      className={className}
      style={{ colorScheme: "only light", forcedColorAdjust: "none", background: "#ffffff" }}
    >
      <style>{css}</style>
      <div className="flex flex-col items-center gap-6">
        {layout.pages.map((page, index) => (
          <div
            key={index}
            className="relative bg-white shadow-[0_2px_18px_rgba(0,0,0,0.14)] ring-1 ring-black/10"
          >
            <Page page={page} cssFor={cssFor} width={width} />
            {layout.pages.length > 1 && (
              <span className="absolute -bottom-5 right-0 font-mono text-[11px] text-text-muted">
                {index + 1} / {layout.pages.length}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
