/**
 * Stage one of template verification: generate every artefact.
 *
 *   npx tsx scripts/verify-generate.mts [templateId]
 *
 * For each template × fixture this writes, into `.verify/<template>/<fixture>/`:
 *
 *   generated.pdf     what the student downloads
 *   generated.tex     the LaTeX export
 *   generated.docx    the Word export
 *   runs.json         every positioned glyph run, straight from the box tree
 *   meta.json         page geometry, applied scale, warnings, substitutions
 *
 * Stage two (`scripts/verify_compare.py`) rasterises and diffs these against
 * the originals. The split exists because the generation must come from the
 * real engine — the same code the browser runs — while the image forensics are
 * better served by PyMuPDF than by anything available in Node.
 */

import { mkdir, writeFile as fsWriteFile } from "node:fs/promises";

import { join } from "node:path";
import { FontBook } from "../src/resume/core/fonts";
import { nodeFontLoader } from "../src/resume/core/nodeFonts";
import { layoutResume } from "../src/resume/core/layout";
import { renderPdf } from "../src/resume/core/render/pdf";
import { renderLatex } from "../src/resume/core/render/latex";
import { renderDocx } from "../src/resume/core/render/docx";
import { substitutions } from "../src/resume/core/schema";
import { templateList } from "../src/resume/templates";
import { fixturesFor } from "../src/resume/fixtures";

const ROOT = process.cwd();
const FONT_ROOT = join(ROOT, "public", "fonts", "resume");
const OUT_ROOT = join(ROOT, ".verify");

/**
 * The repository lives inside a OneDrive folder, and the sync client opens
 * files the moment they appear — which surfaces as a transient EBUSY partway
 * through a run. Retrying briefly is enough; the lock never lasts.
 */
async function writeFile(path: string, data: Uint8Array | string) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      await fsWriteFile(path, data as never);
      return;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (attempt >= 4 || (code !== "EBUSY" && code !== "EPERM")) throw err;
      await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
    }
  }
}

const only = process.argv[2];
const templates = only ? templateList.filter((t) => t.id === only) : templateList;
if (!templates.length) throw new Error(`No template matches "${only}".`);

for (const template of templates) {
  const book = await FontBook.load(template, nodeFontLoader(FONT_ROOT));

  for (const { id: fixtureId, doc } of fixturesFor(template.id)) {
    const dir = join(OUT_ROOT, template.id, fixtureId);
    await mkdir(dir, { recursive: true });

    const layout = layoutResume({ doc, template, book });

    const pdf = await renderPdf(layout, book, {
      title: `${doc.personal.name || "Résumé"} — ${template.name}`,
      author: doc.personal.name || undefined,
    });
    await writeFile(join(dir, "generated.pdf"), pdf);
    await writeFile(join(dir, "generated.tex"), renderLatex(doc, template));
    await writeFile(join(dir, "generated.docx"), await renderDocx(doc, template));

    // Every run, with its resolved position — the reference the comparator
    // matches against the original's extracted spans.
    const runs = layout.pages.flatMap((page, pageIndex) =>
      page.items.flatMap((item) => {
        if (item.type !== "text") return [];
        return item.pieces.flatMap((piece) =>
          piece.runs.map((run) => ({
            page: pageIndex,
            text: run.text,
            x: Number((piece.x + run.dx).toFixed(2)),
            y: Number(item.y.toFixed(2)),
            size: Number(run.size.toFixed(2)),
            width: Number(run.width.toFixed(2)),
            face: run.face.file,
            weight: piece.style.weight,
            italic: piece.style.italic,
            color: piece.color,
          })),
        );
      }),
    );

    const rules = layout.pages.flatMap((page, pageIndex) =>
      page.items
        .filter((i) => i.type === "rule")
        .map((i) => ({ page: pageIndex, ...i })),
    );

    await writeFile(join(dir, "runs.json"), JSON.stringify({ runs, rules }, null, 1));
    await writeFile(
      join(dir, "meta.json"),
      JSON.stringify(
        {
          template: template.id,
          templateName: template.name,
          fixture: fixtureId,
          pages: layout.pages.length,
          pageSize: { width: layout.pages[0]?.width, height: layout.pages[0]?.height },
          margin: template.page.margin,
          appliedFontScale: layout.appliedFontScale,
          appliedSpacing: layout.appliedSpacing,
          overflowBy: layout.overflowBy,
          warnings: layout.warnings,
          substitutions: substitutions(template),
          original: template.meta.original ?? null,
        },
        null,
        2,
      ),
    );

    console.log(
      `  ${template.id}/${fixtureId}: ${layout.pages.length} page(s), ` +
        `${runs.length} runs, scale ${layout.appliedFontScale.toFixed(2)}` +
        (layout.warnings.length ? `, ${layout.warnings.length} warning(s)` : ""),
    );
  }
}

console.log(`\nArtefacts written to .verify/`);
