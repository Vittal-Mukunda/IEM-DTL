/**
 * What each kind of section is called, and what its fields are called.
 *
 * The résumé model keeps generic slots (`organization`, `position`, …) so one
 * engine can serve every template. This file is where those slots get the words
 * a student expects: *University* under Education, *Employer* under Experience,
 * *Category* under Skills — the same slot each time.
 */

import type { Entry, SectionKind, SectionLayout } from "../core/model";

export type EntrySlot = Extract<
  keyof Entry,
  "organization" | "position" | "location" | "summary" | "detail" | "url"
>;

export interface FieldSpec {
  slot: EntrySlot;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  /** Half-width on wide screens, so two fields share a row. */
  half?: boolean;
}

export interface SectionSpec {
  /** Default heading when the section is added. */
  title: string;
  /** What one item is called: "position", "degree", "project". */
  itemNoun: string;
  layout: SectionLayout;
  fields: FieldSpec[];
  dates: boolean;
  bullets: boolean;
  bulletLabel?: string;
  tags: boolean;
  tagLabel?: string;
  /** Short line under the section heading in the editor. */
  hint?: string;
}

const ORG = (label: string, placeholder: string): FieldSpec => ({
  slot: "organization",
  label,
  placeholder,
  half: true,
});

const LOCATION: FieldSpec = {
  slot: "location",
  label: "Location",
  placeholder: "Bengaluru, KA",
  half: true,
};

export const sectionSpecs: Record<SectionKind, SectionSpec> = {
  summary: {
    title: "Summary",
    itemNoun: "summary",
    layout: "paragraph",
    fields: [],
    dates: false,
    bullets: false,
    tags: false,
    hint: "Most OR master's applications skip this. If you keep it, name methods and tools, not the job you want.",
  },

  education: {
    title: "Education",
    itemNoun: "degree",
    layout: "entries",
    fields: [
      ORG("University or school", "R.V. College of Engineering"),
      LOCATION,
      { slot: "position", label: "Degree", placeholder: "B.E. Industrial Engineering & Management", half: true },
      { slot: "summary", label: "CGPA or result", placeholder: "CGPA 9.1 / 10", half: true },
      { slot: "detail", label: "Relevant coursework", placeholder: "Linear Algebra, Probability & Statistics, Operations Research, Stochastic Models" },
    ],
    dates: true,
    bullets: true,
    bulletLabel: "Additional lines",
    tags: false,
    hint: "University only. OR master's packets usually omit high school.",
  },

  experience: {
    title: "Experience",
    itemNoun: "position",
    layout: "entries",
    fields: [
      ORG("Employer", "Toyota Kirloskar Motor"),
      LOCATION,
      { slot: "position", label: "Job title", placeholder: "Industrial Engineering Intern", half: true },
      { slot: "summary", label: "One-line summary", placeholder: "Optional — some templates print this above the bullets", half: true },
    ],
    dates: true,
    bullets: true,
    bulletLabel: "What you did",
    tags: true,
    tagLabel: "Tools used",
    hint: "Lead with the model or method, then the result. One internship, well described, beats two thin ones.",
  },

  projects: {
    title: "Projects",
    itemNoun: "project",
    layout: "entries",
    fields: [
      ORG("Project name", "Line-balancing simulator"),
      { slot: "position", label: "Your role", placeholder: "Team lead", half: true },
      { slot: "url", label: "Link", placeholder: "github.com/you/project", half: true },
      { slot: "summary", label: "What it does", placeholder: "One sentence" },
    ],
    dates: true,
    bullets: true,
    bulletLabel: "Details",
    tags: true,
    tagLabel: "Technologies",
    hint: "Name the formulation: MIP, VRP, simulation. Admissions reads this before internships.",
  },

  research: {
    title: "Research",
    itemNoun: "project",
    layout: "entries",
    fields: [
      ORG("Lab or group", "Operations Research Group, RVCE"),
      LOCATION,
      { slot: "position", label: "Role", placeholder: "Undergraduate Research Assistant", half: true },
      { slot: "summary", label: "Focus", placeholder: "Stochastic scheduling under machine failure", half: true },
    ],
    dates: true,
    bullets: true,
    tags: true,
    tagLabel: "Methods",
    hint: "Put this above internships for OR master's applications. One project with a solver and a number is enough.",
  },

  publications: {
    title: "Publications",
    itemNoun: "publication",
    layout: "entries",
    fields: [
      ORG("Title", "A heuristic for mixed-model assembly line balancing"),
      { slot: "position", label: "Authors", placeholder: "Krishnamurthy A., Rao S." },
      { slot: "summary", label: "Venue", placeholder: "International Journal of Production Research", half: true },
      { slot: "url", label: "DOI or link", placeholder: "doi.org/10.1000/xyz", half: true },
    ],
    dates: true,
    bullets: false,
    tags: false,
  },

  leadership: {
    title: "Leadership",
    itemNoun: "role",
    layout: "entries",
    fields: [
      ORG("Organisation", "IEM Student Association"),
      LOCATION,
      { slot: "position", label: "Role", placeholder: "General Secretary", half: true },
    ],
    dates: true,
    bullets: true,
    tags: false,
  },

  activities: {
    title: "Activities",
    itemNoun: "activity",
    layout: "entries",
    fields: [ORG("Organisation", "RVCE Racing"), LOCATION, { slot: "position", label: "Role", half: true }],
    dates: true,
    bullets: true,
    tags: false,
  },

  awards: {
    title: "Awards",
    itemNoun: "award",
    layout: "entries",
    fields: [
      ORG("Award", "Smart India Hackathon — Winner"),
      { slot: "position", label: "Awarded by", placeholder: "Ministry of Education", half: true },
      { slot: "summary", label: "Note", placeholder: "1st of 340 teams", half: true },
    ],
    dates: true,
    bullets: false,
    tags: false,
  },

  certifications: {
    title: "Certifications",
    itemNoun: "certification",
    layout: "entries",
    fields: [
      ORG("Certification", "Six Sigma Green Belt"),
      { slot: "position", label: "Issued by", placeholder: "ASQ", half: true },
      { slot: "url", label: "Credential link", half: true },
    ],
    dates: true,
    bullets: false,
    tags: false,
  },

  skills: {
    title: "Skills",
    itemNoun: "group",
    layout: "labeled",
    fields: [
      { slot: "organization", label: "Category", placeholder: "Programming", half: true },
      { slot: "summary", label: "Skills", placeholder: "Python (NumPy, pandas, OR-Tools), Gurobi, MATLAB, SQL" },
    ],
    dates: false,
    bullets: false,
    tags: false,
    hint: "Lead with solvers and languages. AutoCAD and SAP belong lower, if at all.",
  },

  interests: {
    title: "Interests",
    itemNoun: "group",
    layout: "labeled",
    fields: [
      { slot: "organization", label: "Category", placeholder: "Interests", half: true },
      { slot: "summary", label: "Detail", placeholder: "Long-distance running, Carnatic violin" },
    ],
    dates: false,
    bullets: false,
    tags: false,
  },

  custom: {
    title: "Custom section",
    itemNoun: "entry",
    layout: "entries",
    fields: [
      ORG("Heading", ""),
      LOCATION,
      { slot: "position", label: "Subheading", half: true },
      { slot: "summary", label: "Summary", half: true },
    ],
    dates: true,
    bullets: true,
    tags: true,
  },
};

/** Section kinds a student can add, in the order the "Add section" menu shows. */
export const addableKinds: SectionKind[] = [
  "education",
  "research",
  "projects",
  "experience",
  "skills",
  "publications",
  "summary",
  "leadership",
  "activities",
  "awards",
  "certifications",
  "interests",
  "custom",
];

export function specFor(kind: SectionKind): SectionSpec {
  return sectionSpecs[kind] ?? sectionSpecs.custom;
}
