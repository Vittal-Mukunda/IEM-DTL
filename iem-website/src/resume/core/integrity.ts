/**
 * The invariants a laid-out résumé must satisfy, whatever the student typed.
 *
 * These are checked by the test suite against every template × every stress
 * fixture. They are the difference between "the layout usually looks fine" and
 * "the layout cannot break": a template author can get a number wrong, but they
 * cannot ship a résumé whose text runs off the page or sits on top of itself.
 */

import type { LayoutPage, LayoutResult, TextItem } from "./layout/types";
import type { TemplateDefinition } from "./schema";

/**
 * The furthest right the template itself asks anything to go.
 *
 * Usually the content edge, but not always: Harvard's dates sit on a tab stop
 * 2.3pt past it, because the Word original does. A declared tab stop is part
 * of the design, so the bound is whichever is further — the check still catches
 * text that escapes, without flagging the template's own geometry.
 */
function rightBound(template: TemplateDefinition, pageWidth: number): number {
  let furthest = pageWidth - template.page.margin.right;
  for (const block of Object.values(template.blocks)) {
    for (const row of block?.rows ?? []) {
      for (const cell of row.cells) {
        if (typeof cell.align === "object" && cell.align !== null) {
          furthest = Math.max(furthest, template.page.margin.left + cell.align.tab);
        }
      }
    }
  }
  return furthest;
}

/**
 * Roles that carry running text, and so must respect the legibility floor.
 *
 * Not "bullet": that role is the marker glyph, which several templates set at
 * 6pt on purpose (Jake's uses a 	iny bullet). The text beside it is "body".
 */
const READING_ROLES = new Set(["body", "entryTitle", "entrySubtitle", "sectionTitle"]);

export interface Violation {
  kind: "outside-margin" | "overlap" | "too-small" | "off-page";
  page: number;
  detail: string;
}

/** Bounding box of a text line, from its baseline and the sizes on it. */
function boxOf(item: TextItem) {
  const size = Math.max(...item.pieces.map((p) => p.style.size), 1);
  return {
    x0: Math.min(...item.pieces.map((p) => p.x)),
    x1: Math.max(...item.pieces.map((p) => p.x + p.width)),
    // Ascent ≈ 0.78em and descent ≈ 0.22em across every face we ship; exact
    // values would need the font book, and this is a bounds check, not layout.
    y0: item.y - size * 0.78,
    y1: item.y + size * 0.22,
  };
}

export interface IntegrityOptions {
  /** Slack for the margin test, in points. */
  tolerance?: number;
  /** Ignore overlaps smaller than this fraction of the smaller box. */
  overlapTolerance?: number;
}

export function checkIntegrity(
  layout: LayoutResult,
  template: TemplateDefinition,
  options: IntegrityOptions = {},
): Violation[] {
  const tolerance = options.tolerance ?? 1.5;
  const overlapTolerance = options.overlapTolerance ?? 0.3;
  const violations: Violation[] = [];
  const m = template.page.margin;
  const floor = template.rules.minBodySize * 0.999;

  layout.pages.forEach((page: LayoutPage, index) => {
    const texts = page.items.filter((i): i is TextItem => i.type === "text" && i.pieces.length > 0);

    for (const item of texts) {
      const box = boxOf(item);

      const right = rightBound(template, page.width);
      if (box.x0 < m.left - tolerance || box.x1 > right + tolerance) {
        violations.push({
          kind: "outside-margin",
          page: index,
          detail: `"${textOf(item).slice(0, 40)}" spans x ${box.x0.toFixed(1)}–${box.x1.toFixed(1)}, outside ${m.left}–${right.toFixed(1)}`,
        });
      }

      if (box.y0 < -tolerance || box.y1 > page.height + tolerance) {
        violations.push({
          kind: "off-page",
          page: index,
          detail: `"${textOf(item).slice(0, 40)}" at y ${item.y.toFixed(1)} is off the page`,
        });
      }

      for (const piece of item.pieces) {
        // The floor guards *reading* text. Contact lines, dates, icons and
        // bullet markers are smaller by design in several of these templates,
        // and holding them to the body's minimum would be a false alarm.
        if (READING_ROLES.has(piece.role) && piece.style.size < floor) {
          violations.push({
            kind: "too-small",
            page: index,
            detail: `"${piece.runs.map((r) => r.text).join("")}" is ${piece.style.size.toFixed(1)}pt, below the ${template.rules.minBodySize}pt floor`,
          });
        }
      }
    }

    // Overlap: only lines that share horizontal space can collide, so compare
    // each line against the few that follow it rather than all of them.
    const sorted = [...texts].sort((a, b) => a.y - b.y);
    for (let i = 0; i < sorted.length; i += 1) {
      const a = boxOf(sorted[i]);
      for (let j = i + 1; j < sorted.length; j += 1) {
        const b = boxOf(sorted[j]);
        if (b.y0 >= a.y1) break;
        const overlapY = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        const overlapX = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
        if (overlapX <= 0 || overlapY <= 0) continue;
        const smaller = Math.min(a.y1 - a.y0, b.y1 - b.y0);
        if (overlapY / smaller > overlapTolerance) {
          violations.push({
            kind: "overlap",
            page: index,
            detail:
              `"${textOf(sorted[i]).slice(0, 26)}" and "${textOf(sorted[j]).slice(0, 26)}" ` +
              `overlap by ${overlapY.toFixed(1)}pt`,
          });
        }
      }
    }
  });

  return violations;
}

function textOf(item: TextItem): string {
  return item.pieces.flatMap((p) => p.runs.map((r) => r.text)).join("");
}
