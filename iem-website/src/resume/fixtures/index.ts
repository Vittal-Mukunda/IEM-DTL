/**
 * Test fixtures.
 *
 * Two kinds live here:
 *
 *  - **Replication fixtures** (`<template>-original`) transcribe the document
 *    a template was reverse-engineered from. They answer "do we land the same
 *    words in the same places?" and are what the accuracy score is measured on.
 *
 *  - **Stress fixtures** are template-agnostic and generated from one builder,
 *    so every template is put through the identical torture: nothing at all,
 *    far too much, a 400-character paragraph, missing sections, reordered
 *    sections, and the extremes of the font-scale range.
 */

import { emptyEntry, emptySection, type Entry, type ResumeDoc, type Section, type SectionKind } from "../core/model";
import { deedyOriginal } from "./deedy-original";
import { harvardOriginal } from "./harvard-original";
import { jakesOriginal } from "./jakes-original";
import { princetonOriginal } from "./princeton-original";
import { uchicagoOriginal } from "./uchicago-original";

export interface Fixture {
  id: string;
  label: string;
  doc: ResumeDoc;
  /** Replication fixtures are scored against an original; stress ones are not. */
  replication?: boolean;
}

const originals: Record<string, ResumeDoc> = {
  harvard: harvardOriginal,
  jakes: jakesOriginal,
  princeton: princetonOriginal,
  uchicago: uchicagoOriginal,
  deedy: deedyOriginal,
};

/* ------------------------------------------------------------------ *
 * Stress-fixture builders
 * ------------------------------------------------------------------ */

const LOREM_LONG =
  "Designed and shipped a scheduling optimiser for a 14-line assembly plant, cutting average changeover time by 31% and " +
  "recovering roughly 480 machine-hours a quarter; the model was later adopted as the default across three sister sites " +
  "and is documented in an internal standard that other teams now build on.";

const entry = (i: number, patch: Partial<Entry> = {}): Entry =>
  emptyEntry({
    organization: `Organisation ${i}`,
    position: `Position Title ${i}`,
    location: "Bengaluru, KA",
    dateStart: "Jun 2024",
    dateEnd: "Aug 2025",
    bullets: [
      `Delivered a measurable outcome number ${i} with a quantified result of ${i * 12}%.`,
      `Coordinated with ${i + 2} stakeholders across engineering, operations and quality.`,
    ],
    tags: ["Python", "Minitab", "SQL"],
    ...patch,
  });

function section(kind: SectionKind, title: string, count: number, patch: Partial<Section> = {}): Section {
  return {
    ...emptySection(kind, title),
    entries: Array.from({ length: count }, (_, i) => entry(i + 1)),
    ...patch,
  };
}

const baseOptions = (patch: Partial<ResumeDoc["options"]> = {}): ResumeDoc["options"] => ({
  fontScale: 1,
  lineSpacing: 1,
  pageSize: "native",
  showIcons: true,
  maxPages: 1,
  ...patch,
});

function docFor(templateId: string, sections: Section[], options = baseOptions()): ResumeDoc {
  return {
    version: 1,
    templateId,
    personal: {
      name: "Ananya Krishnamurthy",
      headline: "B.E. Industrial Engineering · Operations Research",
      links: [
        { id: "p1", kind: "email", label: "ananya.k@rvce.edu.in" },
        { id: "p2", kind: "phone", label: "+91 98765 43210" },
        { id: "p3", kind: "linkedin", label: "linkedin.com/in/ananyak" },
        { id: "p4", kind: "github", label: "github.com/ananyak" },
      ],
    },
    sections,
    options,
  };
}

function stressFixtures(templateId: string): Fixture[] {
  const standard = () => [
    section("education", "Education", 1),
    section("research", "Research Experience", 1),
    section("projects", "Projects", 2),
    section("experience", "Experience", 1),
    {
      ...emptySection("skills", "Technical Skills"),
      layout: "labeled" as const,
      entries: [
        emptyEntry({ organization: "Programming", summary: "Python, Gurobi, OR-Tools, MATLAB, SQL" }),
        emptyEntry({ organization: "Methods", summary: "Linear programming, stochastic models, simulation" }),
      ],
    },
  ];

  return [
    {
      id: "empty",
      label: "Empty résumé — nothing filled in",
      doc: docFor(templateId, [
        emptySection("education", "Education"),
        emptySection("experience", "Experience"),
      ]),
    },
    {
      id: "typical",
      label: "Typical one-page résumé",
      doc: docFor(templateId, standard()),
    },
    {
      id: "maximum",
      label: "Maximum content — should spill to further pages",
      doc: docFor(
        templateId,
        [
          section("education", "Education", 3),
          section("experience", "Experience", 6),
          section("projects", "Projects", 5),
          section("research", "Research", 3),
          section("publications", "Publications", 4),
          section("leadership", "Leadership", 3),
          section("awards", "Awards", 4),
        ],
        baseOptions({ maxPages: 3 }),
      ),
    },
    {
      id: "long-description",
      label: "400-character project description",
      doc: docFor(templateId, [
        section("education", "Education", 1),
        section("projects", "Projects", 1, {
          entries: [entry(1, { bullets: [LOREM_LONG], summary: LOREM_LONG })],
        }),
      ]),
    },
    {
      id: "missing-sections",
      label: "Optional sections absent",
      doc: docFor(templateId, [section("education", "Education", 1)]),
    },
    {
      id: "added-sections",
      label: "Research, publications and a custom section added",
      doc: docFor(templateId, [
        section("education", "Education", 1),
        section("research", "Research", 2),
        section("publications", "Publications", 2),
        section("custom", "Positions of Responsibility", 2),
        section("experience", "Experience", 1),
      ]),
    },
    {
      id: "reordered",
      label: "Sections reordered — skills first",
      doc: docFor(templateId, [
        {
          ...emptySection("skills", "Skills"),
          layout: "labeled" as const,
          entries: [emptyEntry({ organization: "Languages", summary: "Python, C++, SQL" })],
        },
        section("projects", "Projects", 2),
        section("education", "Education", 1),
        section("experience", "Experience", 1),
      ]),
    },
    {
      id: "font-min",
      label: "Font scale at the template minimum",
      doc: docFor(templateId, standard(), baseOptions({ fontScale: 0.9 })),
    },
    {
      id: "font-max",
      label: "Font scale at the template maximum",
      doc: docFor(templateId, standard(), baseOptions({ fontScale: 1.1 })),
    },
    {
      id: "unicode",
      label: "Accents, symbols and an unbreakable URL",
      doc: docFor(templateId, [
        section("education", "Education", 1, {
          entries: [
            entry(1, {
              organization: "Universität für Ingenieurwissenschaften — Köln",
              position: "M.Sc. Fertigungstechnik · Note 1,3",
              bullets: [
                "Publicerade resultat på https://example-university.edu/research/very/long/path/that/cannot/break/anywhere/at/all",
                "Réduction des coûts de 25 % — analyse ABC/XYZ, méthode Kanban.",
              ],
            }),
          ],
        }),
      ]),
    },
    {
      id: "hostile",
      label: "TeX specials, a 800-character bullet, and an unbreakable token",
      doc: docFor(templateId, [
        section("education", "Education", 1, {
          entries: [
            entry(1, {
              organization: "R&D Labs 100% {x_y^2} ~opt",
              position: "Intern #1 — $0 stipend",
              bullets: [
                "C++ & Python: cost was $5 #tag",
                `${LOREM_LONG} ${LOREM_LONG}`,
                `https://example.test/${"a".repeat(90)}`,
              ],
            }),
          ],
        }),
        section("skills", "Skills", 0, {
          layout: "labeled" as const,
          entries: [
            emptyEntry({
              organization: "Tools",
              summary: "Gurobi, OR-Tools, pandas, SQL",
            }),
          ],
        }),
      ]),
    },
    {
      id: "pathological",
      label: "Unbreakable name, dates, location, and URL — must stay on the page",
      doc: {
        ...docFor(
          templateId,
          [
            section("education", "Education", 1, {
              entries: [
                entry(1, {
                  organization: "W".repeat(80),
                  position: "M".repeat(80),
                  location: "L".repeat(80),
                  dateStart: "D".repeat(40),
                  dateEnd: "E".repeat(40),
                  bullets: [`https://example.test/${"a".repeat(120)}`, "W".repeat(200)],
                }),
              ],
            }),
          ],
        ),
        personal: {
          name: "W".repeat(80),
          headline: "H".repeat(80),
          links: [{ id: "p1", kind: "email", label: `${"a".repeat(60)}@example.test` }],
        },
      },
    },
  ];
}

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */

export function fixturesFor(templateId: string): Fixture[] {
  const list: Fixture[] = [];
  const original = originals[templateId];
  if (original) {
    list.push({
      id: `${templateId}-original`,
      label: "Replication of the original sample",
      doc: original,
      replication: true,
    });
  }
  list.push(...stressFixtures(templateId));
  return list;
}

export { deedyOriginal, harvardOriginal, jakesOriginal, princetonOriginal, uchicagoOriginal };
