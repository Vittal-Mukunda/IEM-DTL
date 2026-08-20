/**
 * The résumé document — what the student edits.
 *
 * This model is deliberately **template-agnostic**. An entry carries a fixed
 * set of generic slots (organization, position, location, dates, bullets…) and
 * each template decides which slots it renders and where. That is what lets one
 * editor and one layout engine serve Harvard and AltaCV without either of them
 * appearing in the engine's code — and it is what lets a student switch
 * templates without re-typing anything.
 */

export type SectionKind =
  | "summary"
  | "education"
  | "experience"
  | "projects"
  | "research"
  | "publications"
  | "skills"
  | "awards"
  | "leadership"
  | "activities"
  | "certifications"
  | "interests"
  | "custom";

export type LinkKind =
  | "email"
  | "phone"
  | "location"
  | "linkedin"
  | "github"
  | "website"
  | "orcid"
  | "scholar"
  | "other";

export interface ContactLink {
  id: string;
  kind: LinkKind;
  /** What is printed. For an email this is the address itself. */
  label: string;
  /** Where it points, when it is clickable. Derived for email/phone. */
  href?: string;
}

export interface Personal {
  name: string;
  /** A tagline under the name. Awesome-CV and AltaCV print it; Harvard doesn't. */
  headline?: string;
  links: ContactLink[];
}

/**
 * One item inside a section. Every slot is optional; templates bind to the ones
 * they use and the editor labels them per section kind (see `sectionKinds.ts`),
 * so a student filling in "Education" sees *University* rather than
 * *Organization*.
 */
export interface Entry {
  id: string;
  /** Employer · University · Project name · Journal · Skill category */
  organization?: string;
  /** Job title · Degree · Role · Author list */
  position?: string;
  location?: string;
  dateStart?: string;
  dateEnd?: string;
  /** Renders the end date as "Present". */
  current?: boolean;
  /** A sentence or a comma list — Harvard's prose, or a skills value. */
  summary?: string;
  /** A secondary line: GPA, coursework, thesis title. */
  detail?: string;
  bullets: string[];
  /** Technologies, keywords — rendered inline or as pills. */
  tags: string[];
  url?: string;
  /** 0–5, for templates that draw proficiency dots. */
  rating?: number;
}

/** How a section's items are laid out, independent of the template's styling. */
export type SectionLayout =
  | "entries" // the default: organization / position / dates / bullets
  | "paragraph" // one block of prose (Summary)
  | "labeled" // "Technical: Stata, SQL, R" — organization is the label
  | "tags" // pills / inline keyword list
  | "ratings" // label + proficiency dots
  | "wheel"; // AltaCV's donut chart — label + relative weight

export interface Section {
  id: string;
  kind: SectionKind;
  /** Editable heading text. Defaults come from the template's aliases. */
  title: string;
  visible: boolean;
  layout: SectionLayout;
  /** Which column, in two-column templates. Ignored elsewhere. */
  column?: "main" | "side";
  /**
   * Extra space the *next* heading in this column should use, instead of the
   * template's `sectionBefore`. Deedy's `\sectionsep` is 8pt after Links and
   * Coursework but 20pt after Education; one template-wide number cannot say
   * both.
   */
  spacingAfter?: number;
  entries: Entry[];
  /** Body text for `layout: "paragraph"`. */
  text?: string;
}

export interface ResumeOptions {
  /** Multiplies every font size. Clamped to the template's declared range. */
  fontScale: number;
  /** Multiplies every leading. Clamped to the template's declared range. */
  lineSpacing: number;
  /** `native` keeps whatever the template was designed for. */
  pageSize: "native" | "letter" | "a4";
  /** Overrides the template accent, when the template allows it. */
  accentColor?: string;
  /** Icons in the contact line, for templates that support them. */
  showIcons: boolean;
  /** Soft target. Exceeding it warns; it never truncates content. */
  maxPages: number;
}

export interface ResumeDoc {
  /** Bumped when the shape changes, so stored documents can be migrated. */
  version: 1;
  templateId: string;
  /**
   * True while this is still the untouched example résumé. The first edit
   * clears it, which is what dismisses the "this is an example" notice — so the
   * notice goes away by being acted on rather than by being closed.
   */
  example?: boolean;
  personal: Personal;
  sections: Section[];
  options: ResumeOptions;
}

export const DEFAULT_OPTIONS: ResumeOptions = {
  fontScale: 1,
  lineSpacing: 1,
  pageSize: "native",
  showIcons: true,
  maxPages: 1,
};

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

let idCounter = 0;
/**
 * Ids only need to be unique within one document — they key React lists and
 * drag-and-drop. `crypto.randomUUID` where available, a counter otherwise, so
 * the same code runs in the browser, in Node tests and in the verifier.
 */
export function newId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  idCounter += 1;
  return `${prefix}_${idCounter.toString(36)}`;
}

export function emptyEntry(patch: Partial<Entry> = {}): Entry {
  return { id: newId("e"), bullets: [], tags: [], ...patch };
}

export function emptySection(kind: SectionKind, title: string, patch: Partial<Section> = {}): Section {
  return {
    id: newId("s"),
    kind,
    title,
    visible: true,
    layout: kind === "summary" ? "paragraph" : kind === "skills" ? "labeled" : "entries",
    entries: [],
    ...patch,
  };
}

/** "Jun 2024" + "Present" → "Jun 2024 – Present". Empty when both slots are. */
export function formatDateRange(entry: Entry, dash = "–"): string {
  const end = entry.current ? "Present" : (entry.dateEnd ?? "").trim();
  const start = (entry.dateStart ?? "").trim();
  if (start && end) return `${start} ${dash} ${end}`;
  return start || end;
}

/** True when nothing in the entry would print. */
export function isEntryEmpty(entry: Entry): boolean {
  return (
    !entry.organization?.trim() &&
    !entry.position?.trim() &&
    !entry.location?.trim() &&
    !entry.summary?.trim() &&
    !entry.detail?.trim() &&
    !formatDateRange(entry) &&
    entry.bullets.every((b) => !b.trim()) &&
    entry.tags.every((t) => !t.trim())
  );
}

/** Sections that would print nothing are skipped by the layout engine. */
export function isSectionEmpty(section: Section): boolean {
  if (!section.visible) return true;
  if (section.layout === "paragraph") return !section.text?.trim();
  return section.entries.every(isEntryEmpty);
}

/** A section's own column wins; otherwise the template's sidebar defaults. */
export function sectionColumn(
  section: Section,
  sideKinds: readonly SectionKind[] = [],
): "main" | "side" {
  return section.column ?? (sideKinds.includes(section.kind) ? "side" : "main");
}

export function hrefForLink(link: ContactLink): string | undefined {
  if (link.href) return link.href;
  const v = link.label.trim();
  if (!v) return undefined;
  switch (link.kind) {
    case "email":
      return `mailto:${v}`;
    case "phone":
      return `tel:${v.replace(/[^\d+]/g, "")}`;
    case "location":
    case "other":
      return undefined;
    default:
      return /^https?:\/\//.test(v) ? v : `https://${v}`;
  }
}
