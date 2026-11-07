/**
 * Regressions found by filling the builder with a non-IEM résumé and reading
 * back every download.
 *
 * Each test names the failure a student saw: a PDF whose ligatures printed as
 * "Educati on", kerned words that swallowed the next space, Word files missing
 * Stanford's dates or every all-caps heading, LaTeX missing Yale's coursework
 * and Deedy's tagline, AltaCV dropping a degree's extra lines — and example
 * text ("Industrial Engineering") that stayed on the page because the field it
 * lived in was easy to miss.
 */

import { join } from "node:path";
import { inflateRawSync } from "node:zlib";
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
  decodePDFRawStream,
} from "pdf-lib";
import { beforeAll, describe, expect, it } from "vitest";
import { FontBook } from "./fonts";
import { nodeFontLoader } from "./nodeFonts";
import { layoutResume } from "./layout";
import { DEFAULT_OPTIONS, emptyEntry, emptySection, type ResumeDoc, type Section } from "./model";
import type { TemplateDefinition } from "./schema";
import { renderDocx } from "./render/docx";
import { renderLatex } from "./render/latex";
import { renderPdf } from "./render/pdf";
import { exampleDoc } from "../exampleResume";
import { clearLeftovers, findLeftovers } from "../editor/exampleLeftovers";
import { specFor } from "../editor/sectionKinds";
import { templateList, templates } from "../templates";

const FONT_ROOT = join(process.cwd(), "public", "fonts", "resume");
const books = new Map<string, FontBook>();

beforeAll(async () => {
  for (const template of templateList) {
    books.set(template.id, await FontBook.load(template, nodeFontLoader(FONT_ROOT)));
  }
}, 120_000);

const section = (kind: Section["kind"], title: string, patch: Partial<Section>): Section => ({
  ...emptySection(kind, title),
  layout: specFor(kind).layout,
  ...patch,
});

/** A résumé that shares nothing with the built-in example. */
function ownDoc(templateId: string): ResumeDoc {
  return {
    version: 1,
    templateId,
    personal: {
      name: "Priya Venkatesan",
      headline: "B.Tech Mechanical Engineering · Thermal Systems",
      links: [{ id: "l1", kind: "email", label: "priya.v@nitk.edu.in" }],
    },
    sections: [
      section("summary", "Profile", { text: "Officially certified fluid-flow specialist." }),
      section("education", "Education", {
        entries: [
          emptyEntry({
            organization: "National Institute of Technology Karnataka",
            location: "Surathkal, KA",
            position: "B.Tech Mechanical Engineering",
            summary: "CGPA 8.74 / 10",
            detail: "Thermodynamics, Finite Element Methods",
            dateStart: "Jul 2021",
            dateEnd: "Jun 2025",
            bullets: ["Minor in Computational Mathematics."],
          }),
        ],
      }),
      section("experience", "Experience", {
        entries: [
          emptyEntry({
            organization: "Bosch Global Software Technologies",
            position: "Thermal Analysis Intern",
            dateStart: "May 2024",
            dateEnd: "Jul 2024",
            bullets: ["Modelled radiator airflow and cut pressure drop by 11%."],
          }),
        ],
      }),
    ],
    options: { ...DEFAULT_OPTIONS },
  };
}

const pdfOf = async (doc: ResumeDoc, template: TemplateDefinition) => {
  const book = books.get(template.id)!;
  return renderPdf(layoutResume({ doc, template, book }), book);
};

const docxOf = (doc: ResumeDoc, template: TemplateDefinition) => {
  const layout = layoutResume({ doc, template, book: books.get(template.id)! });
  return renderDocx(doc, template, {
    fontScale: layout.appliedFontScale,
    spacing: layout.appliedSpacing,
  });
};

/* ------------------------------------------------------------------ *
 * Reading a PDF back the way a viewer does
 * ------------------------------------------------------------------ */

interface ShownText {
  x: number;
  y: number;
  size: number;
  /** Through the font's ToUnicode map; "\u0000" for an unmapped glyph. */
  text: string;
  /** Where the viewer's pen stops: x plus the /W widths of the glyphs. */
  end: number;
  unmapped: number[];
  unwidthed: number[];
}

interface FontInfo {
  unicode: Map<number, string>;
  widths: Map<number, number>;
}

function fontInfo(pdf: PDFDocument, ref: PDFRef, cache: Map<string, FontInfo>): FontInfo {
  const key = ref.toString();
  const hit = cache.get(key);
  if (hit) return hit;
  const dict = pdf.context.lookup(ref, PDFDict);
  const unicode = new Map<number, string>();
  const toUnicode = dict.lookup(PDFName.of("ToUnicode"));
  if (toUnicode instanceof PDFRawStream) {
    const cmap = Buffer.from(decodePDFRawStream(toUnicode).decode()).toString("latin1");
    for (const [, gid, hex] of cmap.matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g)) {
      const units = hex.match(/.{4}/g)!.map((h) => parseInt(h, 16));
      unicode.set(parseInt(gid, 16), String.fromCharCode(...units));
    }
  }
  const widths = new Map<number, number>();
  const cid = dict.lookup(PDFName.of("DescendantFonts"), PDFArray).lookup(0, PDFDict);
  const w = cid.lookup(PDFName.of("W"));
  if (w instanceof PDFArray) {
    for (let i = 0; i + 1 < w.size(); i += 2) {
      const start = (w.lookup(i) as PDFNumber).asNumber();
      const list = w.lookup(i + 1, PDFArray);
      for (let j = 0; j < list.size(); j += 1) {
        widths.set(start + j, (list.lookup(j) as PDFNumber).asNumber());
      }
    }
  }
  const info = { unicode, widths };
  cache.set(key, info);
  return info;
}

async function shownText(bytes: Uint8Array): Promise<ShownText[]> {
  const pdf = await PDFDocument.load(bytes);
  const cache = new Map<string, FontInfo>();
  const out: ShownText[] = [];
  for (const page of pdf.getPages()) {
    const fonts = page.node.Resources()!.lookup(PDFName.of("Font"), PDFDict);
    const contents = page.node.Contents()!;
    const streams =
      contents instanceof PDFArray
        ? contents.asArray().map((r) => pdf.context.lookup(r) as PDFRawStream)
        : [contents as PDFRawStream];
    for (const stream of streams) {
      const ops = Buffer.from(decodePDFRawStream(stream).decode()).toString("latin1");
      let font: FontInfo | undefined;
      let size = 0;
      let x = 0;
      let y = 0;
      for (const line of ops.split("\n")) {
        const tf = line.match(/^\/(\S+) ([\d.]+) Tf$/);
        if (tf) {
          font = fontInfo(pdf, fonts.get(PDFName.of(tf[1])) as PDFRef, cache);
          size = Number(tf[2]);
          continue;
        }
        const tm = line.match(/^1 0 0 1 ([-\d.]+) ([-\d.]+) Tm$/);
        if (tm) {
          x = Number(tm[1]);
          y = Number(tm[2]);
          continue;
        }
        const tj = line.match(/^<([0-9A-F]*)> Tj$/);
        if (tj && font) {
          const gids = (tj[1].match(/.{4}/g) ?? []).map((h) => parseInt(h, 16));
          const width = gids.reduce((sum, g) => sum + (font!.widths.get(g) ?? 1000), 0);
          out.push({
            x,
            y,
            size,
            text: gids.map((g) => font!.unicode.get(g) ?? "\u0000").join(""),
            end: x + (width / 1000) * size,
            unmapped: gids.filter((g) => !font!.unicode.has(g)),
            unwidthed: gids.filter((g) => !font!.widths.has(g)),
          });
        }
      }
    }
  }
  return out;
}

/** Page text in reading order, one line per baseline. */
function readText(shown: ShownText[]): string {
  const lines = new Map<number, ShownText[]>();
  for (const s of shown) {
    const key = Math.round(s.y * 10);
    lines.set(key, [...(lines.get(key) ?? []), s]);
  }
  return [...lines.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, items]) =>
      items
        .sort((a, b) => a.x - b.x)
        .map((s) => s.text)
        .join(""),
    )
    .join("\n");
}

function zipFile(bytes: Uint8Array, path: string): string {
  const buf = Buffer.from(bytes);
  let offset = 0;
  while (offset + 30 <= buf.length && buf.readUInt32LE(offset) === 0x04034b50) {
    const compression = buf.readUInt16LE(offset + 8);
    const size = buf.readUInt32LE(offset + 18);
    const nameLen = buf.readUInt16LE(offset + 26);
    const extraLen = buf.readUInt16LE(offset + 28);
    const name = buf.subarray(offset + 30, offset + 30 + nameLen).toString("utf8");
    const start = offset + 30 + nameLen + extraLen;
    if (name === path) {
      const data = buf.subarray(start, start + size);
      return (compression === 0 ? Buffer.from(data) : inflateRawSync(data)).toString("utf8");
    }
    offset = start + size;
  }
  throw new Error(`zip has no ${path}`);
}

const docxText = (xml: string) =>
  xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<w:tab\/>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&");

/* ------------------------------------------------------------------ *
 * PDF
 * ------------------------------------------------------------------ */

describe("PDF text is what a reader or an ATS gets back", () => {
  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s maps and sizes every glyph it draws, ligatures included",
    async (_id, template) => {
      const shown = await shownText(await pdfOf(ownDoc(template.id), template));
      // Unmapped glyphs extracted as junk ("Educa̺on"); glyphs without a width
      // were advanced by a full em, which split words apart on screen.
      expect(shown.flatMap((s) => s.unmapped)).toEqual([]);
      expect(shown.flatMap((s) => s.unwidthed)).toEqual([]);

      const text = readText(shown);
      expect(text).not.toMatch(/[ﬀ-ﬆ]/); // "ﬁ", not "fi"
      for (const word of ["Officially", "certified", "fluid-flow", "Finite", "Software", "Minor"]) {
        // Case-blind: MIT and Deedy set organisations in capitals.
        expect(text.toLowerCase()).toContain(word.toLowerCase());
      }
    },
  );

  it.each(templateList.map((t) => [t.id, t] as const))(
    "%s never draws a word into the space after it",
    async (_id, template) => {
      const shown = await shownText(await pdfOf(ownDoc(template.id), template));
      // Kerned words ("Tech", "CGPA") used to be drawn unkerned — wider than
      // measured — so they ran into the next word: "B.TechMechanical".
      const byLine = new Map<number, ShownText[]>();
      for (const s of shown) byLine.set(s.y, [...(byLine.get(s.y) ?? []), s]);
      for (const items of byLine.values()) {
        items.sort((a, b) => a.x - b.x);
        for (let i = 0; i + 1 < items.length; i += 1) {
          if (!items[i + 1].text.startsWith(" ") || items[i].text.endsWith(" ")) continue;
          // /W stores whole thousandths of an em, so a word may end up to
          // half a unit per glyph past where the engine measured it.
          const rounding = (items[i].text.length * 0.5 * items[i].size) / 1000;
          expect(items[i].end).toBeLessThanOrEqual(items[i + 1].x + rounding + 0.001);
        }
      }
    },
  );
});

/* ------------------------------------------------------------------ *
 * Word
 * ------------------------------------------------------------------ */

describe("Word exports carry what the PDF carries", () => {
  it("prints Stanford's gutter dates beside each entry", async () => {
    const xml = zipFile(await docxOf(ownDoc("stanford"), templates.stanford), "word/document.xml");
    const text = docxText(xml);
    expect(text).toMatch(/Jul 2021 – Jun 2025\s*National Institute of Technology Karnataka/);
    expect(text).toMatch(/May 2024 – Jul 2024\s*Thermal Analysis Intern/);
  });

  it("sets MIT's section titles in the gutter, beside their first entry", async () => {
    const xml = zipFile(await docxOf(ownDoc("mit"), templates.mit), "word/document.xml");
    expect(docxText(xml)).toMatch(/Education\s*National Institute of Technology Karnataka/);
  });

  it.each(
    templateList
      .filter((t) => Object.values(t.typography.roles).some((r) => r.allCaps && !r.smallCaps))
      .map((t) => [t.id, t] as const),
  )("%s keeps its all-caps roles in Word", async (_id, template) => {
    // `docx` drops `allCaps` whenever `smallCaps` is defined, even as false.
    const xml = zipFile(await docxOf(ownDoc(template.id), template), "word/document.xml");
    expect(xml).toContain("<w:caps/>");
  });
});

/* ------------------------------------------------------------------ *
 * LaTeX
 * ------------------------------------------------------------------ */

describe("LaTeX exports carry what the PDF carries", () => {
  it("prints Yale's coursework, with its label only when there is coursework", () => {
    const withIt = renderLatex(ownDoc("yale"), templates.yale);
    expect(withIt).toContain("\\textit{Relevant Coursework:} Thermodynamics, Finite Element Methods");

    const doc = ownDoc("yale");
    doc.sections[1].entries[0].detail = "";
    expect(renderLatex(doc, templates.yale)).not.toContain("Relevant Coursework");
  });

  it("prints Deedy's tagline, without a stray line break when there is none", () => {
    expect(renderLatex(ownDoc("deedy"), templates.deedy)).toContain(
      "B.Tech Mechanical Engineering · Thermal Systems\\\\",
    );
    const doc = ownDoc("deedy");
    doc.personal.headline = "";
    // A `\\` with no line to end is a TeX error.
    expect(renderLatex(doc, templates.deedy)).toMatch(/\\namesection\{ Priya Venkatesan \}\{\}\{\s+\\href/);
  });
});

/* ------------------------------------------------------------------ *
 * Layout
 * ------------------------------------------------------------------ */

describe("layout", () => {
  it("prints AltaCV's extra degree lines and location", () => {
    const template = templates.altacv;
    const layout = layoutResume({ doc: ownDoc("altacv"), template, book: books.get("altacv")! });
    const text = layout.pages
      .flatMap((p) => p.items)
      .filter((i) => i.type === "text")
      .map((i) => (i.type === "text" ? i.pieces.flatMap((p) => p.runs.map((r) => r.text)).join("") : ""))
      .join("\n");
    expect(text).toContain("Minor in Computational Mathematics.");
    expect(text).toContain("Surathkal, KA");
  });

  it("leaves MIT's sectionBefore above a section whose title sits in the gutter", () => {
    const template = templates.mit;
    const layout = layoutResume({ doc: ownDoc("mit"), template, book: books.get("mit")! });
    const items = layout.pages[0].items.filter((i) => i.type === "text");
    const y = (s: string) =>
      items.find((i) => i.type === "text" && i.pieces.some((p) => p.runs.some((r) => r.text === s)))!.y;
    // Experience's first line sits a section gap below Education's last line,
    // not a bare line below it.
    const gap = y("Experience") - y("Minor");
    expect(gap).toBeGreaterThan(template.typography.base.size * 1.2 + template.spacing.sectionBefore * 0.9);
  });
});

/* ------------------------------------------------------------------ *
 * Example text left behind
 * ------------------------------------------------------------------ */

describe("leftover example text", () => {
  const started = (): ResumeDoc => {
    const doc = exampleDoc("awesome-cv");
    const education = doc.sections.find((s) => s.kind === "education")!;
    education.entries[0].position = "B.Tech Computer Science & Engineering";
    return { ...doc, example: undefined };
  };

  it("points at the tagline after the degree has been changed", () => {
    const where = findLeftovers(started()).map((l) => l.where);
    expect(where).toContain("Your details › Tagline");
    expect(where).not.toContain("Education › Degree");
  });

  it("says nothing while the example is still untouched", () => {
    expect(findLeftovers(exampleDoc("awesome-cv"))).toEqual([]);
  });

  it("clears the sample's text and keeps the student's own", () => {
    const cleared = clearLeftovers(started());
    expect(findLeftovers(cleared)).toEqual([]);
    expect(cleared.personal.headline).toBe("");
    const education = cleared.sections.find((s) => s.kind === "education")!;
    expect(education.entries[0].position).toBe("B.Tech Computer Science & Engineering");
    // An entry that was all sample is removed, so its dates do not print alone.
    const experience = cleared.sections.find((s) => s.kind === "experience");
    expect(experience?.entries ?? []).toEqual([]);

    for (const template of templateList) {
      const tex = renderLatex({ ...cleared, templateId: template.id }, template);
      expect(tex).not.toMatch(/Industrial|John Doe|Toyota/);
    }
  });
});
