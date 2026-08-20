/**
 * Developer aid: lay a fixture out and print every line's baseline and x.
 *
 *   npx tsx scripts/resume-layout-dump.mts harvard harvard-original
 *
 * Prints the same shape the forensic pass printed for the original PDFs, so the
 * two can be read side by side while a template is being calibrated.
 */

import { join } from "node:path";
import { FontBook } from "../src/resume/core/fonts";
import { nodeFontLoader } from "../src/resume/core/nodeFonts";
import { layoutResume } from "../src/resume/core/layout";
import { getTemplate } from "../src/resume/templates";
import { harvardOriginal } from "../src/resume/fixtures/harvard-original";

const FONT_ROOT = join(process.cwd(), "public", "fonts", "resume");

const fixtures: Record<string, typeof harvardOriginal> = {
  "harvard-original": harvardOriginal,
};

const [templateId = "harvard", fixtureId = "harvard-original"] = process.argv.slice(2);

const template = getTemplate(templateId);
const doc = fixtures[fixtureId];
if (!doc) throw new Error(`No fixture "${fixtureId}".`);

const book = await FontBook.load(template, nodeFontLoader(FONT_ROOT));
const layout = layoutResume({ doc, template, book });

console.log(
  `== ${template.name} / ${fixtureId} — ${layout.pages.length} page(s), ` +
    `scale ${layout.appliedFontScale.toFixed(2)}, spacing ${layout.appliedSpacing.toFixed(2)}`,
);

layout.pages.forEach((page, i) => {
  console.log(`\n-- page ${i + 1}  ${page.width} x ${page.height}`);
  let prev: number | null = null;
  for (const item of page.items) {
    if (item.type === "rule") {
      console.log(`   rule  y=${item.y.toFixed(2)}  x=${item.x}..${item.x + item.width}`);
      continue;
    }
    if (item.type !== "text") continue;
    const delta = prev === null ? "" : `+${(item.y - prev).toFixed(2)}`;
    prev = item.y;
    const text = item.pieces
      .map((p) => `[${p.style.weight}${p.style.italic ? "i" : ""}/${p.style.size.toFixed(1)}@${p.x.toFixed(1)}]${p.runs.map((r) => r.text).join("")}`)
      .join(" | ");
    console.log(`y=${item.y.toFixed(2)} ${delta.padStart(7)}  ${text.slice(0, 150)}`);
  }
});

if (layout.warnings.length) {
  console.log("\nwarnings:");
  for (const w of layout.warnings) console.log(`  [${w.code}] ${w.message}`);
}
