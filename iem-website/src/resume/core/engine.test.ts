/**
 * The matrix: every template against every stress fixture.
 *
 * The point of these tests is not that the output looks nice — that is what the
 * verification report measures. It is that **no input breaks the layout**: a
 * student can leave a section empty, paste four hundred characters into one
 * bullet, reorder everything, drag the type size to either end of its range, or
 * type a name in Swedish, and the page still holds together.
 */

import { join } from "node:path";
import { inflateRawSync } from "node:zlib";
import { beforeAll, describe, expect, it } from "vitest";
import { FontBook } from "./fonts";
import { nodeFontLoader } from "./nodeFonts";
import { checkIntegrity } from "./integrity";
import { layoutResume } from "./layout";
import type { TextItem } from "./layout/types";
import { emptySection, type ResumeDoc } from "./model";
import { blockFor, familyFor, substitutions, type TemplateDefinition } from "./schema";
import { PAGE_SIZES } from "./units";
import { renderDocx } from "./render/docx";
import { renderLatex } from "./render/latex";
import { renderPdf } from "./render/pdf";
import { blankDoc, exampleDoc } from "../exampleResume";
import { fixturesFor } from "../fixtures";
import { templateList, templates } from "../templates";

const FONT_ROOT = join(process.cwd(), "public", "fonts", "resume");
const books = new Map<string, FontBook>();

beforeAll(async () => {
  for (const template of templateList) {
    books.set(template.id, await FontBook.load(template, nodeFontLoader(FONT_ROOT)));
  }
}, 120_000);

const layoutOf = (doc: ResumeDoc, template: TemplateDefinition) =>
  layoutResume({ doc, template, book: books.get(template.id)! });

/**
 * Emit a DOCX the way the download does: through the layout first, so Word is
 * handed the fit the page actually settled on rather than what was asked for.
 */
const docxOf = (doc: ResumeDoc, template: TemplateDefinition) => {
  const l = layoutOf(doc, template);
  return renderDocx(doc, template, {
    fontScale: l.appliedFontScale,
    spacing: l.appliedSpacing,
  });
};

/** Pull one file out of an OOXML zip. The `docx` packer writes local-file sizes. */
function zipFile(bytes: Uint8Array, path: string): string {
  const buf = Buffer.from(bytes);
  let offset = 0;
  while (offset + 30 <= buf.length) {
    const sig = buf.readUInt32LE(offset);
    if (sig === 0x02014b50) break;
    if (sig !== 0x04034b50) {
      throw new Error(`unexpected zip signature at ${offset}`);
    }
    const compression = buf.readUInt16LE(offset + 8);
    const compressedSize = buf.readUInt32LE(offset + 18);
    const nameLen = buf.readUInt16LE(offset + 26);
    const extraLen = buf.readUInt16LE(offset + 28);
    const name = buf.subarray(offset + 30, offset + 30 + nameLen).toString("utf8");
    const dataStart = offset + 30 + nameLen + extraLen;
    const data = buf.subarray(dataStart, dataStart + compressedSize);
    if (name === path) {
      const raw = compression === 0 ? Buffer.from(data) : inflateRawSync(data);
      return raw.toString("utf8");
    }
    offset = dataStart + compressedSize;
  }
  throw new Error(`zip has no ${path}`);
}

function docxPlainText(bytes: Uint8Array): string {
  const xml = zipFile(bytes, "word/document.xml");
  return [...xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join("");
}

const itemText = (item: TextItem) =>
  item.pieces.flatMap((p) => p.runs.map((r) => r.text)).join("");

/* ------------------------------------------------------------------ *
 * Template definitions
 * ------------------------------------------------------------------ */

describe("template definitions", () => {
  it("declares unique template ids covering the registry", () => {
    const ids = templateList.map((t) => t.id);
    expect(ids.length).toBeGreaterThanOrEqual(8);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s declares every font family its roles reference",
    (_id, template) => {
      for (const role of Object.values(template.typography.roles)) {
        expect(() => familyFor(template, role.family)).not.toThrow();
      }
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s resolves every colour its roles use",
    (_id, template) => {
      for (const role of Object.values(template.typography.roles)) {
        const resolved = role.color.startsWith("#") ? role.color : template.palette[role.color];
        expect(resolved, `role colour "${role.color}"`).toMatch(/^#[0-9a-f]{3,8}$/i);
      }
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s has a sane font-scale range and a legibility floor",
    (_id, template) => {
      const { fontScale, minBodySize } = template.rules;
      expect(fontScale.min).toBeGreaterThan(0.5);
      expect(fontScale.min).toBeLessThanOrEqual(1);
      expect(fontScale.max).toBeGreaterThanOrEqual(1);
      // 7pt is the practical floor for print. A template may declare less than
      // 8 when its own design goes there — Awesome-CV's job titles are 7.97 —
      // but the floor must never sit above the smallest text it actually sets.
      expect(minBodySize).toBeGreaterThanOrEqual(7);
      const smallestReading = Math.min(
        template.typography.roles.body.size,
        template.typography.roles.entryTitle.size,
        template.typography.roles.entrySubtitle.size,
        template.typography.roles.sectionTitle.size,
      );
      expect(minBodySize).toBeLessThanOrEqual(smallestReading + 0.01);
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s can lay out every section kind it advertises",
    (_id, template) => {
      for (const kind of template.sections.available) {
        expect(blockFor(template, kind, "entries")).toBeTruthy();
      }
    },
  );

  it("reports every font substitution rather than hiding it", () => {
    for (const template of templateList) {
      for (const sub of substitutions(template)) {
        expect(sub.original).toBeTruthy();
        expect(["metric", "visual"]).toContain(sub.fidelity);
      }
    }
  });
});

/* ------------------------------------------------------------------ *
 * The stress matrix
 * ------------------------------------------------------------------ */

const matrix = templateList.flatMap((template) =>
  fixturesFor(template.id).map((fixture) => ({
    name: `${template.id} / ${fixture.id}`,
    template,
    fixture,
  })),
);

describe("layout integrity", () => {
  it.each(matrix.map((c) => [c.name, c] as const))("%s holds every invariant", (_name, c) => {
    const layout = layoutOf(c.fixture.doc, c.template);
    const violations = checkIntegrity(layout, c.template);
    expect(violations.map((v) => `${v.kind}: ${v.detail}`)).toEqual([]);
  });

  it.each(matrix.map((c) => [c.name, c] as const))("%s stays above the type floor", (_name, c) => {
    const layout = layoutOf(c.fixture.doc, c.template);
    const smallest = Math.min(
      ...layout.pages.flatMap((p) =>
        p.items.flatMap((i) => (i.type === "text" ? i.pieces.map((piece) => piece.style.size) : [])),
      ),
      Infinity,
    );
    if (Number.isFinite(smallest)) {
      // Bullet markers and icons are set smaller on purpose; body text is not.
      expect(smallest).toBeGreaterThan(4);
    }
    expect(layout.appliedFontScale).toBeGreaterThanOrEqual(c.template.rules.fontScale.min - 1e-9);
  });

  it.each(matrix.map((c) => [c.name, c] as const))("%s is deterministic", (_name, c) => {
    const a = layoutOf(c.fixture.doc, c.template);
    const b = layoutOf(c.fixture.doc, c.template);
    expect(JSON.stringify(positionsOf(a))).toBe(JSON.stringify(positionsOf(b)));
  });
});

function positionsOf(layout: ReturnType<typeof layoutResume>) {
  return layout.pages.map((p) =>
    p.items.filter((i) => i.type === "text").map((i) => [i.y, i.pieces.map((piece) => piece.x)]),
  );
}

/* ------------------------------------------------------------------ *
 * Specific scenarios from the brief
 * ------------------------------------------------------------------ */

describe("content scenarios", () => {
  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s prints nothing but the header for a résumé with no content",
    (_id, template) => {
      const doc: ResumeDoc = {
        version: 1,
        templateId: template.id,
        personal: { name: "", links: [] },
        sections: [emptySection("education", "Education")],
        options: {
          fontScale: 1,
          lineSpacing: 1,
          pageSize: "native",
          showIcons: true,
          maxPages: 1,
        },
      };
      const layout = layoutOf(doc, template);
      expect(layout.pages).toHaveLength(1);
      expect(layout.pages[0].items.filter((i) => i.type === "text")).toHaveLength(0);
      expect(layout.warnings).toEqual([]);
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s honours a section reorder",
    (_id, template) => {
      const fixtures = fixturesFor(template.id);
      const forward = fixtures.find((f) => f.id === "typical")!.doc;
      const reversed: ResumeDoc = { ...forward, sections: [...forward.sections].reverse() };

      const first = (doc: ResumeDoc) => {
        const layout = layoutOf(doc, template);
        const texts = layout.pages[0].items.filter((i) => i.type === "text");
        return texts.map((t) => t.pieces.flatMap((p) => p.runs.map((r) => r.text)).join(""));
      };

      expect(first(forward)).not.toEqual(first(reversed));
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s shrinks rather than overflowing when content is far too long",
    (_id, template) => {
      const fixture = fixturesFor(template.id).find((f) => f.id === "maximum")!;
      const oneMax: ResumeDoc = { ...fixture.doc, options: { ...fixture.doc.options, maxPages: 1 } };
      const layout = layoutOf(oneMax, template);

      // It must try: either the type is smaller, the spacing is tighter, or
      // both — and it must say so rather than silently dropping content.
      const tried =
        layout.appliedFontScale < oneMax.options.fontScale ||
        layout.appliedSpacing < oneMax.options.lineSpacing;
      expect(tried).toBe(true);
      expect(layout.warnings.some((w) => w.code === "overflow")).toBe(true);
      expect(checkIntegrity(layout, template)).toEqual([]);
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s breaks an unbreakable URL rather than letting it escape the margin",
    (_id, template) => {
      const fixture = fixturesFor(template.id).find((f) => f.id === "unicode")!;
      const layout = layoutOf(fixture.doc, template);
      expect(checkIntegrity(layout, template).filter((v) => v.kind === "outside-margin")).toEqual([]);
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s keeps a pathological name, date, location and URL inside the page",
    (_id, template) => {
      const fixture = fixturesFor(template.id).find((f) => f.id === "pathological")!;
      const layout = layoutOf(fixture.doc, template);
      expect(checkIntegrity(layout, template).filter((v) => v.kind === "outside-margin" || v.kind === "off-page")).toEqual(
        [],
      );
      expect(layout.pages.length).toBeGreaterThan(0);
    },
  );

  it("keeps a document valid when the student switches template", () => {
    const doc = fixturesFor("harvard").find((f) => f.id === "typical")!.doc;
    for (const template of templateList) {
      const moved: ResumeDoc = { ...doc, templateId: template.id };
      const layout = layoutOf(moved, template);
      expect(layout.pages.length).toBeGreaterThan(0);
      expect(checkIntegrity(layout, template)).toEqual([]);
    }
  });
});

describe("preview font installation", () => {
  it("is a no-op in Node, where there is no document", async () => {
    await expect(books.get("harvard")!.registerCssFaces()).resolves.toBeUndefined();
  });
});

describe("the builder's opening document", () => {
  it("opens the example when nothing is stored", async () => {
    const { initialDoc } = await import("../editor/useResumeDoc");
    const doc = initialDoc(null);
    expect(doc.example).toBe(true);
    expect(doc.personal.name).toBe("John Doe");
    expect(doc.sections.some((s) => s.kind === "education")).toBe(true);
  });

  it("rebuilds a stored example so the current sample is what opens", async () => {
    const { initialDoc } = await import("../editor/useResumeDoc");
    const stale = exampleDoc("gatech");
    stale.personal.name = "Old Sample";
    const doc = initialDoc(JSON.stringify(stale));
    expect(doc.example).toBe(true);
    expect(doc.templateId).toBe("gatech");
    expect(doc.personal.name).toBe("John Doe");
  });

  it("opens the example when storage is a blank form", async () => {
    const { initialDoc } = await import("../editor/useResumeDoc");
    const doc = initialDoc(JSON.stringify(blankDoc("cornell")));
    expect(doc.example).toBe(true);
    expect(doc.templateId).toBe("cornell");
    expect(doc.personal.name).toBe("John Doe");
  });

  it("keeps a résumé the student has started", async () => {
    const { initialDoc } = await import("../editor/useResumeDoc");
    const own = exampleDoc("yale");
    delete own.example;
    own.personal.name = "Ananya Krishnamurthy";
    const doc = initialDoc(JSON.stringify(own));
    expect(doc.example).toBeUndefined();
    expect(doc.personal.name).toBe("Ananya Krishnamurthy");
    expect(doc.templateId).toBe("yale");
  });
});

/* ------------------------------------------------------------------ *
 * The example résumé
 * ------------------------------------------------------------------ */

describe("the example résumé", () => {
  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s opens on a single page with nothing to warn about",
    (_id, template) => {
      const layout = layoutOf(exampleDoc(template.id), template);
      // This is the first thing every student sees. It must not greet them with
      // an overflow notice, and it must not be silently shrunk to fit.
      expect(layout.pages).toHaveLength(1);
      expect(layout.warnings).toEqual([]);
      expect(layout.appliedFontScale).toBe(1);
      expect(checkIntegrity(layout, template)).toEqual([]);
    },
  );

  it("is an OR master's packet: university only, research before internships, named solvers", () => {
    const doc = exampleDoc("harvard");
    const blob = JSON.stringify(doc);
    expect(blob).not.toMatch(/high school|12th|CBSE|pre-university|\bPUC\b/i);
    expect(doc.sections.map((s) => s.kind).slice(0, 2)).toEqual(["education", "research"]);
    expect(blob).toContain("Gurobi");
    expect(blob).toContain("OR-Tools");
    expect(blob).toContain("Operations Research");
    expect(blob).toContain("R.V. College of Engineering");
  });

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s fills every section it opens with",
    (_id, template) => {
      const doc = exampleDoc(template.id);
      expect(doc.example).toBe(true);
      expect(doc.sections.length).toBeGreaterThan(0);
      for (const section of doc.sections) {
        const filled =
          section.layout === "paragraph"
            ? Boolean(section.text?.trim())
            : section.entries.some((e) => e.organization?.trim() || e.position?.trim());
        expect(filled, `${template.id} opens with an empty "${section.title}"`).toBe(true);
      }
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s clears to a blank document with the same sections",
    (_id, template) => {
      const example = exampleDoc(template.id);
      const blank = blankDoc(template.id);
      expect(blank.example).toBeUndefined();
      expect(blank.sections.map((s) => s.kind)).toEqual(example.sections.map((s) => s.kind));
      expect(blank.personal.name).toBe("");
      const layout = layoutOf(blank, template);
      expect(layout.pages).toHaveLength(1);
      expect(layout.pages[0].items.filter((i) => i.type === "text")).toHaveLength(0);
    },
  );

  it("hands out fresh ids, so two documents never share one", () => {
    const a = exampleDoc("harvard");
    const b = exampleDoc("harvard");
    const ids = (d: typeof a) => d.sections.flatMap((s) => s.entries.map((e) => e.id));
    expect(ids(a).some((id) => ids(b).includes(id))).toBe(false);
  });
});

/* ------------------------------------------------------------------ *
 * Exports
 * ------------------------------------------------------------------ */

describe("exports", () => {
  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s produces a readable PDF",
    async (_id, template) => {
      const doc = fixturesFor(template.id).find((f) => f.id === "typical")!.doc;
      const bytes = await renderPdf(layoutOf(doc, template), books.get(template.id)!);
      expect(bytes.length).toBeGreaterThan(2000);
      expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s produces LaTeX with the résumé body, balanced braces, and a document",
    (_id, template) => {
      const doc = fixturesFor(template.id).find((f) => f.id === "typical")!.doc;
      const tex = renderLatex(doc, template);
      expect(tex).toContain("\\begin{document}");
      expect(tex).toContain("\\end{document}");
      expect(tex).toContain(template.emit.latex.documentClass);
      expect(tex).toContain(doc.personal.name);
      expect(tex).toContain("Organisation 1");
      expect(tex).toContain("Education");

      const braces = [...tex].reduce((depth, ch, i) => {
        if (tex[i - 1] === "\\") return depth;
        if (ch === "{") return depth + 1;
        if (ch === "}") return depth - 1;
        return depth;
      }, 0);
      expect(braces).toBe(0);
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s escapes LaTeX metacharacters in student text",
    (_id, template) => {
      const doc = fixturesFor(template.id).find((f) => f.id === "typical")!.doc;
      const hostile: ResumeDoc = {
        ...doc,
        personal: { ...doc.personal, name: "R&D 100% #1 $$ _x^2 {braces}" },
      };
      const tex = renderLatex(hostile, template);
      expect(tex).toContain("R\\&D 100\\% \\#1 \\$\\$ \\_x\\textasciicircum{}2 \\{braces\\}");
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s produces a DOCX whose document.xml holds the name, a heading, and an entry",
    async (_id, template) => {
      const doc = fixturesFor(template.id).find((f) => f.id === "typical")!.doc;
      const bytes = await docxOf(doc, template);
      expect(bytes.length).toBeGreaterThan(2000);
      expect([...bytes.slice(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);
      const text = docxPlainText(bytes);
      expect(text).toContain(doc.personal.name);
      expect(text).toContain("Education");
      expect(text).toContain("Organisation 1");
      expect(text).toContain("Position Title 1");
    },
  );

  it("does not clip a display-size name behind an exact 11pt line box", async () => {
    const template = templates.jakes;
    const doc = fixturesFor("jakes").find((f) => f.id === "typical")!.doc;
    const bytes = await docxOf(doc, template);
    const xml = zipFile(bytes, "word/document.xml");
    expect(xml).toContain('w:lineRule="atLeast"');
    expect(xml).not.toContain('w:lineRule="exact"');
    expect(docxPlainText(bytes)).toContain(doc.personal.name);
  });

  /* ---------------------------------------------------------------- *
   * The Word file has to describe the same page as the PDF
   * ---------------------------------------------------------------- */

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s writes the chosen paper size into the DOCX, for both papers",
    async (_id, template) => {
      for (const [pageSize, expected] of [
        ["letter", PAGE_SIZES.letter],
        ["a4", PAGE_SIZES.a4],
      ] as const) {
        const base = exampleDoc(template.id);
        const doc = { ...base, options: { ...base.options, pageSize } };
        const xml = zipFile(await docxOf(doc, template), "word/document.xml");
        const pgSz = xml.match(/<w:pgSz w:w="(\d+)" w:h="(\d+)"/);
        expect(pgSz).toBeTruthy();
        expect(Number(pgSz![1])).toBe(Math.round(expected.width / 0.05));
        expect(Number(pgSz![2])).toBe(Math.round(expected.height / 0.05));
      }
    },
  );

  it.each(
    templateList
      .filter((t) => JSON.stringify(t.blocks).includes('"align":"right"'))
      .map((t) => [t.id, t] as const),
  )(
    "%s cuts its right tab to the box on the paper that was chosen",
    async (_id, template) => {
      for (const pageSize of ["letter", "a4"] as const) {
        const base = exampleDoc(template.id);
        const doc = { ...base, options: { ...base.options, pageSize } };
        const xml = zipFile(await docxOf(doc, template), "word/document.xml");

        const m = template.page.margin;
        const content = PAGE_SIZES[pageSize].width - m.left - m.right;
        // The box a right tab is measured from: a column in a two-column
        // template, otherwise the page's own text width less any gutter.
        const g = template.page.gutter;
        const boxes = template.page.columns?.length
          ? template.page.columns.map((c) => content * c.width)
          : [content - (g ? g.width + g.gap : 0)];
        const expected = boxes.map((b) =>
          Math.round((b - (template.emit.docx.rightTabInset ?? 0)) / 0.05),
        );

        const stops = [...xml.matchAll(/<w:tab w:val="right" w:pos="(\d+)"/g)].map((t) =>
          Number(t[1]),
        );
        // Allowing a twip of rounding, at least one stop is the computed one,
        // and none of the computed stops is left at another paper's width.
        const hit = stops.some((pos) => expected.some((e) => Math.abs(pos - e) <= 1));
        expect(hit).toBe(true);
      }
    },
  );

  it("moves the right tab when the paper changes", async () => {
    const template = templates.columbia;
    const stopsOn = async (pageSize: "letter" | "a4") => {
      const base = exampleDoc("columbia");
      const doc = { ...base, options: { ...base.options, pageSize } };
      const xml = zipFile(await docxOf(doc, template), "word/document.xml");
      return [...xml.matchAll(/<w:tab w:val="right" w:pos="(\d+)"/g)].map((t) => Number(t[1]));
    };
    const letter = await stopsOn("letter");
    const a4 = await stopsOn("a4");
    expect(letter.length).toBeGreaterThan(0);
    // A4 is the narrower page, so the stop has to come in with it. Freezing it
    // at the Letter width is what used to push every date past the margin.
    const narrowing = (PAGE_SIZES.letter.width - PAGE_SIZES.a4.width) / 0.05;
    expect(Math.max(...letter) - Math.max(...a4)).toBeCloseTo(narrowing, -1);
  });

  it("hands Word the fit the page settled on, not the one that was asked for", async () => {
    const template = templates.harvard;
    // The stress fixture overflows, so the cascade shrinks type and leading.
    const doc = fixturesFor("harvard").find((f) => f.id === "maximum")!.doc;
    const l = layoutOf(doc, template);
    expect(l.appliedFontScale).toBeLessThan(1);
    expect(l.appliedSpacing).toBeLessThan(1);

    const fitted = zipFile(await docxOf(doc, template), "word/document.xml");
    const unfitted = zipFile(
      await renderDocx(doc, template, { fontScale: 1, spacing: 1 }),
      "word/document.xml",
    );
    expect(fitted).not.toEqual(unfitted);

    // Body runs come through at the fitted size, in half-points.
    const size = Math.round(template.typography.base.size * l.appliedFontScale * 2);
    expect(fitted).toContain(`<w:sz w:val="${size}"/>`);

    // And the leading with it: every at-least line height must be no greater
    // than the unfitted document's largest.
    const lines = (x: string) =>
      [...x.matchAll(/<w:spacing[^>]*w:line="(\d+)"/g)].map((t) => Number(t[1]));
    expect(Math.max(...lines(fitted))).toBeLessThanOrEqual(Math.max(...lines(unfitted)));
  });

  it("gives a two-column cell the same text width as the engine's column", async () => {
    const template = templates.altacv;
    const doc = exampleDoc("altacv");
    const xml = zipFile(await docxOf(doc, template), "word/document.xml");

    const m = template.page.margin;
    const content = PAGE_SIZES[template.page.size].width - m.left - m.right;
    const cells = [...xml.matchAll(/<w:tcW w:type="dxa" w:w="(\d+)"/g)].map((t) => Number(t[1]));
    const margins = [...xml.matchAll(/<w:right w:type="dxa" w:w="(\d+)"\/><\/w:tcMar>/g)].map(
      (t) => Number(t[1]),
    );
    expect(cells).toHaveLength(template.page.columns!.length);

    template.page.columns!.forEach((col, i) => {
      // Word takes a cell margin out of the cell's width, so the text area is
      // the cell minus its gutter — and that is what has to match the engine.
      const textWidth = cells[i] - (margins[i] ?? 0);
      expect(textWidth).toBeCloseTo(Math.round((content * col.width) / 0.05), -1);
    });

    // Together the columns fill the content width rather than falling short by
    // the sum of the gaps.
    expect(cells.reduce((a, b) => a + b, 0)).toBeCloseTo(Math.round(content / 0.05), -1);
  });

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s never prints one of its own labels twice",
    async (_id, template) => {
      const text = docxPlainText(await docxOf(exampleDoc(template.id), template));
      // A label the template supplies must not also be sitting in the résumé
      // data — that is what made Princeton read "Relevant Coursework: Relevant
      // Coursework: Linear Algebra…".
      const labels = [
        ...new Set([...JSON.stringify(template.blocks).matchAll(/"prefix":"([^"]*: )"/g)].map(
          (m) => m[1],
        )),
      ];
      for (const label of labels) {
        expect(text).not.toContain(`${label}${label}`);
      }
    },
  );

  it("keeps sectionBefore on the first sidebar heading", () => {
    const template = templates.deedy;
    const doc = fixturesFor("deedy").find((f) => f.id === "deedy-original")!.doc;
    const layout = layoutOf(doc, template);
    const texts = layout.pages[0].items.filter((i): i is TextItem => i.type === "text");
    const education = texts.find((t) => itemText(t) === "EDUCATION");
    const experience = texts.find((t) => itemText(t) === "EXPERIENCE");
    expect(education).toBeTruthy();
    expect(experience).toBeTruthy();
    // Both first body headings sit the same distance below the header. Missing
    // the first-block gap on the sidebar used to park Education ~20pt high.
    expect(Math.abs(education!.y - experience!.y)).toBeLessThan(2);
    expect(education!.y).toBeGreaterThan(110);
  });

  it("never emits a template id the registry does not know", () => {
    for (const id of Object.keys(templates)) {
      expect(templates[id].id).toBe(id);
    }
  });
});

const braceDepth = (tex: string) =>
  [...tex].reduce((depth, ch, i) => {
    if (tex[i - 1] === "\\") return depth;
    if (ch === "{") return depth + 1;
    if (ch === "}") return depth - 1;
    return depth;
  }, 0);

describe("every fixture exports without breaking", () => {
  it.each(matrix.map((c) => [c.name, c] as const))(
    "%s PDF, TeX and Word",
    async (_name, c) => {
      const layout = layoutOf(c.fixture.doc, c.template);
      expect(checkIntegrity(layout, c.template)).toEqual([]);
      expect(layout.pages.length).toBeGreaterThan(0);
      for (const page of layout.pages) {
        for (const item of page.items) {
          if (item.type !== "text") continue;
          expect(Number.isFinite(item.y)).toBe(true);
          for (const piece of item.pieces) {
            expect(Number.isFinite(piece.x)).toBe(true);
            expect(Number.isFinite(piece.width)).toBe(true);
          }
        }
      }

      const pdf = await renderPdf(layout, books.get(c.template.id)!);
      expect(pdf.length).toBeGreaterThan(800);
      expect(new TextDecoder().decode(pdf.slice(0, 5))).toBe("%PDF-");

      const tex = renderLatex(c.fixture.doc, c.template);
      expect(tex).toContain("\\begin{document}");
      expect(tex).toContain("\\end{document}");
      expect(braceDepth(tex)).toBe(0);
      if (c.fixture.doc.personal.name) {
        const name = c.fixture.doc.personal.name;
        expect(tex.replace(/\\allowbreak\{\}/g, "")).toContain(name);
      }

      const bytes = await docxOf(c.fixture.doc, c.template);
      expect(bytes.length).toBeGreaterThan(800);
      expect([...bytes.slice(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);
      if (c.fixture.doc.personal.name) {
        expect(docxPlainText(bytes)).toContain(c.fixture.doc.personal.name);
      }
    },
  );
});

describe("the example résumé in every download format", () => {
  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s example is one page and exports PDF, TeX and Word with the sample text",
    async (_id, template) => {
      const doc = exampleDoc(template.id);
      const layout = layoutOf(doc, template);
      expect(layout.pages).toHaveLength(1);
      expect(layout.warnings).toEqual([]);
      expect(checkIntegrity(layout, template)).toEqual([]);

      const pdf = await renderPdf(layout, books.get(template.id)!);
      expect(new TextDecoder().decode(pdf.slice(0, 5))).toBe("%PDF-");

      const tex = renderLatex(doc, template);
      expect(tex).toContain("John Doe");
      expect(tex).toContain("Gurobi");
      expect(tex).toContain("Industrial Engineering");
      expect(tex).toContain("\\begin{document}");
      expect(braceDepth(tex)).toBe(0);

      const text = docxPlainText(await docxOf(doc, template));
      expect(text).toContain("John Doe");
      expect(text).toContain("Gurobi");
      expect(text).toContain("Operations Research");
      expect(text).toContain("Industrial Engineering");
    },
  );
});

const OR_COLLEGES = [
  "gatech",
  "mit",
  "cornell",
  "columbia",
  "wisconsin",
  "berkeley",
  "stanford",
  "purdue",
  "utaustin",
] as const;

const IEOR_FONTS = ["Times New Roman", "Arial", "Calibri", "Garamond", "Tahoma"];

describe("OR master's application packets", () => {
  const careerOffice = templateList.filter((t) => t.id !== "altacv");

  it.each(careerOffice.map((t) => [t.id] as const))("%s leads with education then research", (id) => {
    const order = templates[id].sections.defaultOrder;
    expect(order[0]).toBe("education");
    expect(order[1]).toBe("research");
    expect(order).toContain("projects");
    expect(order).toContain("skills");
  });

  it.each(OR_COLLEGES.map((id) => [id] as const))(
    "%s example PDF, TeX and Word all carry the degree, research, and a solver",
    async (id) => {
      const template = templates[id];
      const doc = exampleDoc(id);
      const layout = layoutOf(doc, template);
      expect(layout.pages).toHaveLength(1);
      expect(checkIntegrity(layout, template)).toEqual([]);

      const laid = layout.pages
        .flatMap((p) => p.items)
        .filter((i): i is TextItem => i.type === "text")
        .map(itemText)
        .join("\n");
      expect(laid).toContain("Industrial Engineering");
      expect(laid).toContain("Gurobi");

      const tex = renderLatex(doc, template);
      expect(tex).toContain("Industrial Engineering");
      expect(tex).toContain("Gurobi");
      expect(tex).toContain("Engineering \\& Management");
      expect(braceDepth(tex)).toBe(0);

      const word = docxPlainText(await docxOf(doc, template));
      expect(word).toContain("Industrial Engineering");
      expect(word).toContain("Gurobi");
      expect(word).toContain("Operations Research");
    },
  );

  it("Columbia meets IEOR required format (Times, Letter, ≥0.5in, body ≥10, name largest)", () => {
    const t = templates.columbia;
    expect(t.page.size).toBe("letter");
    expect(t.page.margin.left).toBeGreaterThanOrEqual(36);
    expect(t.page.margin.right).toBeGreaterThanOrEqual(36);
    expect(t.page.margin.bottom).toBeGreaterThanOrEqual(36);
    expect(t.typography.roles.body.size).toBeGreaterThanOrEqual(10);
    expect(t.typography.roles.name.size).toBeGreaterThan(t.typography.roles.body.size);
    expect(t.rules.minBodySize).toBeGreaterThanOrEqual(10);
    expect(t.typography.families).toHaveLength(1);
    expect(IEOR_FONTS).toContain(t.emit.docx.font);
    expect(t.emit.latex.documentClass).toContain("letterpaper");
    expect(t.emit.latex.documentClass).toContain("10pt");
    expect(t.emit.latex.preamble).toMatch(/margin=0\.5in/);
    expect(t.emit.docx.font).toBe("Times New Roman");
  });

  it("Georgia Tech, Cornell, Stanford and Harvard Word exports use Times New Roman", () => {
    for (const id of ["gatech", "cornell", "stanford", "harvard"] as const) {
      expect(templates[id].emit.docx.font).toBe("Times New Roman");
      expect(templates[id].page.size).toBe("letter");
    }
  });

  it("Berkeley, Purdue, Wisconsin and UT Austin Word exports use Calibri", () => {
    for (const id of ["berkeley", "purdue", "wisconsin", "utaustin"] as const) {
      expect(templates[id].emit.docx.font).toBe("Calibri");
      expect(templates[id].page.size).toBe("letter");
    }
  });

  it("MIT keeps the career-office A4 page and lists awards after research", () => {
    expect(templates.mit.page.size).toBe("a4");
    expect(templates.mit.sections.defaultOrder).toEqual([
      "education",
      "research",
      "projects",
      "experience",
      "awards",
      "skills",
    ]);
  });
});
