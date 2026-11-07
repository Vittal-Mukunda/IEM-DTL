/**
 * Export audit: fill a résumé with data that shares nothing with the built-in
 * example, export it from every template in every format, and check that
 *
 *   1. every value the student typed reaches every export, and
 *   2. nothing from the example résumé (IEM, RVCE, John Doe…) leaks through.
 *
 *   npx tsx scripts/resume-export-audit.mts
 *
 * Writes `.verify/audit/<template>.{pdf,tex,docx}`; `scripts/resume_export_audit.py`
 * extracts the text and does the checking.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { FontBook } from "../src/resume/core/fonts";
import { nodeFontLoader } from "../src/resume/core/nodeFonts";
import { layoutResume } from "../src/resume/core/layout";
import { renderPdf } from "../src/resume/core/render/pdf";
import { renderLatex } from "../src/resume/core/render/latex";
import { renderDocx } from "../src/resume/core/render/docx";
import { DEFAULT_OPTIONS, emptyEntry, emptySection, type ResumeDoc, type Section, type SectionKind } from "../src/resume/core/model";
import { specFor } from "../src/resume/editor/sectionKinds";
import { templateList } from "../src/resume/templates";

const ROOT = process.cwd();
const OUT = join(ROOT, ".verify", "audit");

function section(kind: SectionKind, title: string, patch: Partial<Section>): Section {
  const s = emptySection(kind, title);
  s.layout = specFor(kind).layout;
  return { ...s, ...patch };
}

export function auditDoc(templateId: string): ResumeDoc {
  return {
    version: 1,
    templateId,
    personal: {
      name: "Priya Venkatesan",
      headline: "B.Tech Mechanical Engineering · Thermal Systems",
      links: [
        { id: "l1", kind: "email", label: "priya.v@nitk.edu.in", href: "mailto:priya.v@nitk.edu.in" },
        { id: "l2", kind: "phone", label: "+91 90000 11122", href: "tel:+919000011122" },
        { id: "l3", kind: "github", label: "github.com/priyav", href: "https://github.com/priyav" },
        { id: "l4", kind: "location", label: "Mangaluru, KA" },
      ],
    },
    sections: [
      section("summary", "Profile", {
        text: "Mechanical engineering student focused on heat-exchanger design and CFD.",
      }),
      section("education", "Education", {
        entries: [
          emptyEntry({
            organization: "National Institute of Technology Karnataka",
            location: "Surathkal, KA",
            position: "B.Tech Mechanical Engineering",
            summary: "CGPA 8.74 / 10",
            detail: "Thermodynamics, Fluid Mechanics, Heat Transfer, Finite Element Methods",
            dateStart: "Jul 2021",
            dateEnd: "Jun 2025",
            bullets: ["Minor in Computational Mathematics."],
          }),
          emptyEntry({
            organization: "Delhi Public School",
            location: "Mysuru, KA",
            position: "Class XII (CBSE), PCM",
            summary: "94.2%",
            dateStart: "2019",
            dateEnd: "2021",
          }),
        ],
      }),
      section("experience", "Experience", {
        entries: [
          emptyEntry({
            organization: "Bosch Global Software Technologies",
            location: "Koramangala, KA",
            position: "Thermal Analysis Intern",
            dateStart: "May 2024",
            dateEnd: "Jul 2024",
            bullets: ["Modelled radiator airflow in ANSYS Fluent and cut pressure drop by 11%."],
            tags: ["ANSYS", "SolidWorks"],
          }),
        ],
      }),
      section("projects", "Projects", {
        entries: [
          emptyEntry({
            organization: "Solar Dryer Prototype",
            position: "Designer",
            summary: "Passive solar crop dryer for coastal farmers.",
            dateStart: "Jan 2024",
            dateEnd: "Apr 2024",
            bullets: ["Raised drying rate 27% over open-sun drying in field trials."],
            tags: ["Arduino", "MATLAB"],
            url: "github.com/priyav/solar-dryer",
          }),
        ],
      }),
      section("skills", "Technical Skills", {
        entries: [
          emptyEntry({ organization: "CAD/CAE", summary: "SolidWorks, ANSYS Fluent, Abaqus" }),
          emptyEntry({ organization: "Programming", summary: "MATLAB, Python, C" }),
        ],
      }),
      section("awards", "Honours", {
        entries: [emptyEntry({ organization: "SAE BAJA — Best Design", position: "SAEINDIA", dateStart: "Feb 2023" })],
      }),
    ],
    options: { ...DEFAULT_OPTIONS },
  };
}

await mkdir(OUT, { recursive: true });
const summary: Record<string, unknown> = {};
for (const template of templateList) {
  const doc = auditDoc(template.id);
  // Mirror what the editor does on template switch: unsupported kinds become custom.
  const allowed = new Set(template.sections.available);
  doc.sections = doc.sections.map((s) => (allowed.has(s.kind) ? s : { ...s, kind: "custom" as SectionKind }));
  const book = await FontBook.load(template, nodeFontLoader(join(ROOT, "public", "fonts", "resume")));
  const layout = layoutResume({ doc, template, book });
  await writeFile(join(OUT, `${template.id}.pdf`), await renderPdf(layout, book, { title: "audit" }));
  await writeFile(join(OUT, `${template.id}.tex`), renderLatex(doc, template));
  await writeFile(
    join(OUT, `${template.id}.docx`),
    await renderDocx(doc, template, { fontScale: layout.appliedFontScale, spacing: layout.appliedSpacing }),
  );
  summary[template.id] = {
    pages: layout.pages.length,
    warnings: layout.warnings.map((w) => w.message),
  };
}
await writeFile(join(OUT, "layout.json"), JSON.stringify(summary, null, 2));
console.log(`wrote ${templateList.length} templates to ${OUT}`);
