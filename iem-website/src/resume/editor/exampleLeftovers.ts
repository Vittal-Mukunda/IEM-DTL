/**
 * Text the example résumé put there that the student has not replaced yet.
 *
 * Typing over one field clears the "this is an example" notice, but the rest
 * of the sample stays — and some of it hides. The tagline, for one, is printed
 * only by the templates that have a place for it, so a student could change
 * their degree under Education, export from Awesome-CV, and still find
 * "B.E. Industrial Engineering" under their name. This module finds every field
 * still holding the sample's words, so the editor can point at them and clear
 * them in one go.
 */

import type { Entry, ResumeDoc } from "../core/model";
import { exampleDoc } from "../exampleResume";
import { templateList } from "../templates";
import { specFor, type EntrySlot } from "./sectionKinds";

/**
 * Fields compared against the example. Dates, locations and skill category
 * labels are left out: "Bengaluru, KA" or "Programming" may well be the
 * student's own answer, and flagging them would be noise.
 */
const SLOTS: EntrySlot[] = [
  "organization",
  "position",
  "summary",
  "detail",
  "url",
];

export interface Leftover {
  /** Where it is, in the editor's own words: "Experience › Job title". */
  where: string;
}

function exampleStrings(): Set<string> {
  const out = new Set<string>();
  const add = (s: string | undefined) => {
    const t = s?.trim();
    if (t) out.add(t);
  };
  // Every template's sample: each one fills only the sections it shows.
  for (const sample of templateList.map((t) => exampleDoc(t.id))) {
    add(sample.personal.name);
    add(sample.personal.headline);
    for (const link of sample.personal.links)
      if (link.kind !== "location") add(link.label);
    for (const section of sample.sections) {
      add(section.text);
      for (const entry of section.entries) {
        for (const slot of SLOTS) {
          // A skills row's left cell is a category name, not sample prose.
          if (slot === "organization" && section.layout === "labeled") continue;
          add(entry[slot]);
        }
        entry.bullets.forEach(add);
      }
    }
  }
  return out;
}

let cached: Set<string> | null = null;
const sampleText = () => (cached ??= exampleStrings());

const isSample = (value: string | undefined) =>
  Boolean(value?.trim()) && sampleText().has(value!.trim());

export function findLeftovers(doc: ResumeDoc): Leftover[] {
  if (doc.example) return [];
  const found: Leftover[] = [];
  if (isSample(doc.personal.name))
    found.push({ where: "Your details › Full name" });
  if (isSample(doc.personal.headline))
    found.push({ where: "Your details › Tagline" });
  if (
    doc.personal.links.some((l) => l.kind !== "location" && isSample(l.label))
  ) {
    found.push({ where: "Your details › Contact line" });
  }

  for (const section of doc.sections) {
    if (!section.visible) continue;
    const spec = specFor(section.kind);
    const heading = section.title.trim() || spec.title;
    if (isSample(section.text)) found.push({ where: `${heading} › Text` });
    const fields = new Set<string>();
    for (const entry of section.entries) {
      for (const field of spec.fields) {
        if (!SLOTS.includes(field.slot)) continue;
        if (field.slot === "organization" && section.layout === "labeled")
          continue;
        if (isSample(entry[field.slot])) fields.add(field.label);
      }
      if (entry.bullets.some(isSample))
        fields.add(spec.bulletLabel ?? "Bullet points");
    }
    for (const label of fields) found.push({ where: `${heading} › ${label}` });
  }
  return found;
}

const hasOwnContent = (e: Entry) =>
  Boolean(
    e.organization?.trim() ||
    e.position?.trim() ||
    e.summary?.trim() ||
    e.detail?.trim(),
  ) || e.bullets.some((b) => b.trim());

/**
 * The same document with every leftover sample value emptied. An entry left
 * with nothing of the student's in it is removed outright — otherwise the
 * sample's dates, location and tools would still print on their own.
 */
export function clearLeftovers(doc: ResumeDoc): ResumeDoc {
  const blank = (value: string | undefined) => (isSample(value) ? "" : value);
  const cleanEntry = (entry: Entry, labeled: boolean): Entry => {
    const next = {
      ...entry,
      bullets: entry.bullets.filter((b) => !isSample(b)),
    };
    for (const slot of SLOTS) {
      if (slot === "organization" && labeled) continue;
      next[slot] = blank(entry[slot]);
    }
    return next;
  };
  return {
    ...doc,
    personal: {
      ...doc.personal,
      name: blank(doc.personal.name) ?? "",
      headline: blank(doc.personal.headline),
      links: doc.personal.links.map((l) =>
        l.kind !== "location" && isSample(l.label)
          ? { ...l, label: "", href: undefined }
          : l,
      ),
    },
    sections: doc.sections.map((section) => ({
      ...section,
      text: blank(section.text),
      entries: section.entries.flatMap((e) => {
        const cleaned = cleanEntry(e, section.layout === "labeled");
        return hasOwnContent(cleaned) || !hasOwnContent(e) ? [cleaned] : [];
      }),
    })),
  };
}
