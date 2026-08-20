"use client";

/**
 * Résumé state.
 *
 * Everything lives in `localStorage` and nowhere else. There is no account, no
 * server and no database — which is not a shortcut, it is the point: a student's
 * address, phone number and marks never leave their own browser, and the site
 * keeps the "no cookies, no forms, no secrets" posture the rest of it has.
 *
 * The escape hatch is a JSON file: `exportJson` / `importJson` move a résumé
 * between machines without anyone having to host it.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_OPTIONS,
  emptyEntry,
  emptySection,
  newId,
  type ContactLink,
  type Entry,
  type ResumeDoc,
  type Section,
  type SectionKind,
} from "../core/model";
import { blankDoc, exampleDoc } from "../exampleResume";
import { specFor } from "./sectionKinds";
import { DEFAULT_TEMPLATE_ID, getTemplate, hasTemplate } from "../templates";

const STORAGE_KEY = "iem-resume-builder:v1";
const SAVE_DEBOUNCE_MS = 400;

/**
 * What a first-time visitor gets: a complete example résumé, not an empty form.
 * See `exampleResume.ts` for why.
 */
export const starterDoc = exampleDoc;

function hasWrittenContent(doc: ResumeDoc): boolean {
  if (doc.personal.name?.trim()) return true;
  return doc.sections.some((section) => {
    if (section.text?.trim()) return true;
    return section.entries.some(
      (entry) =>
        Boolean(entry.organization?.trim()) ||
        Boolean(entry.position?.trim()) ||
        Boolean(entry.summary?.trim()) ||
        Boolean(entry.detail?.trim()) ||
        entry.bullets.some((bullet) => bullet.trim()) ||
        entry.tags.some((tag) => tag.trim()),
    );
  });
}

/**
 * What the builder should open with, given whatever is in localStorage.
 *
 * An untouched example is rebuilt from the current sample (so template order
 * and copy stay up to date). A blank saved form is treated as a first visit.
 * Anything the student has actually typed is kept.
 */
export function initialDoc(stored: string | null): ResumeDoc {
  if (!stored) return starterDoc();
  try {
    const restored = migrate(JSON.parse(stored));
    if (!restored) return starterDoc();
    if (restored.example || !hasWrittenContent(restored)) {
      return exampleDoc(restored.templateId);
    }
    return restored;
  } catch {
    return starterDoc();
  }
}

function migrate(raw: unknown): ResumeDoc | null {
  if (!raw || typeof raw !== "object") return null;
  const doc = raw as Partial<ResumeDoc>;
  if (doc.version !== 1 || !doc.personal || !Array.isArray(doc.sections)) return null;
  return {
    version: 1,
    templateId: hasTemplate(doc.templateId ?? "") ? doc.templateId! : DEFAULT_TEMPLATE_ID,
    example: doc.example === true ? true : undefined,
    personal: {
      name: doc.personal.name ?? "",
      headline: doc.personal.headline ?? "",
      links: (doc.personal.links ?? []).map((l) => ({ ...l, id: l.id || newId("l") })),
    },
    sections: doc.sections.map((s) => ({
      ...s,
      id: s.id || newId("s"),
      entries: (s.entries ?? []).map((e) => ({
        ...e,
        id: e.id || newId("e"),
        bullets: e.bullets ?? [],
        tags: e.tags ?? [],
      })),
    })),
    options: { ...DEFAULT_OPTIONS, ...doc.options },
  };
}

export interface ResumeActions {
  setDoc: (updater: (doc: ResumeDoc) => ResumeDoc) => void;
  setTemplate: (id: string) => void;
  setName: (name: string) => void;
  setHeadline: (headline: string) => void;
  updateLink: (id: string, patch: Partial<ContactLink>) => void;
  addLink: () => void;
  removeLink: (id: string) => void;
  addSection: (kind: SectionKind) => void;
  updateSection: (id: string, patch: Partial<Section>) => void;
  removeSection: (id: string) => void;
  moveSection: (fromId: string, toId: string) => void;
  addEntry: (sectionId: string) => void;
  updateEntry: (sectionId: string, entryId: string, patch: Partial<Entry>) => void;
  removeEntry: (sectionId: string, entryId: string) => void;
  moveEntry: (sectionId: string, index: number, delta: number) => void;
  setOptions: (patch: Partial<ResumeDoc["options"]>) => void;
  /** Load the example résumé again. */
  loadExample: () => void;
  /** Empty every field, keeping the section layout. */
  clear: () => void;
  replace: (doc: ResumeDoc) => void;
}

export function useResumeDoc() {
  // Read straight from storage. The builder is mounted client-only (see
  // `builder-client.tsx`), so there is no server render to disagree with and no
  // reason to arrive at the saved résumé one render late.
  const [doc, setDocState] = useState<ResumeDoc>(() => {
    try {
      return initialDoc(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      return starterDoc();
    }
  });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      } catch {
        // Private browsing, or a full quota. Editing still works; only the
        // autosave is lost, and the JSON export covers that.
      }
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [doc]);

  /**
   * Any content edit clears the `example` flag. Choosing a template or nudging
   * the type size does not — browsing the templates is not the same as having
   * made the résumé yours.
   */
  const setDoc = useCallback(
    (updater: (doc: ResumeDoc) => ResumeDoc, keepExample = false) => {
      setDocState((current) => {
        const next = updater(current);
        return keepExample || !next.example ? next : { ...next, example: undefined };
      });
    },
    [],
  );

  const actions = useMemo<ResumeActions>(() => {
    const mapSections = (fn: (sections: Section[]) => Section[]) =>
      setDoc((d) => ({ ...d, sections: fn(d.sections) }));

    const patchSection = (id: string, patch: Partial<Section>) =>
      mapSections((sections) => sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));

    return {
      setDoc,

      setTemplate: (id) =>
        setDoc((d) => {
          if (!hasTemplate(id)) return d;
          // Still the sample: rebuild it in the new template's section order
          // so picking a card always shows the filled example, not a blank page.
          if (d.example) return exampleDoc(id);
          const template = getTemplate(id);
          // Sections the new template cannot render become "custom" rather than
          // disappearing — nobody should lose typing by trying a template on.
          const allowed = new Set(template.sections.available);
          return {
            ...d,
            templateId: id,
            sections: d.sections.map((s) =>
              allowed.has(s.kind) ? s : { ...s, kind: "custom" as SectionKind },
            ),
          };
        }, true),

      setName: (name) => setDoc((d) => ({ ...d, personal: { ...d.personal, name } })),
      setHeadline: (headline) => setDoc((d) => ({ ...d, personal: { ...d.personal, headline } })),

      updateLink: (id, patch) =>
        setDoc((d) => ({
          ...d,
          personal: {
            ...d.personal,
            links: d.personal.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
          },
        })),

      addLink: () =>
        setDoc((d) => ({
          ...d,
          personal: {
            ...d.personal,
            links: [...d.personal.links, { id: newId("l"), kind: "website", label: "" }],
          },
        })),

      removeLink: (id) =>
        setDoc((d) => ({
          ...d,
          personal: { ...d.personal, links: d.personal.links.filter((l) => l.id !== id) },
        })),

      addSection: (kind) =>
        setDoc((d) => {
          const spec = specFor(kind);
          const template = getTemplate(d.templateId);
          const section = emptySection(kind, template.sections.aliases[kind] ?? spec.title);
          section.layout = spec.layout;
          section.entries = spec.layout === "paragraph" ? [] : [emptyEntry()];
          return { ...d, sections: [...d.sections, section] };
        }),

      updateSection: patchSection,

      removeSection: (id) => mapSections((sections) => sections.filter((s) => s.id !== id)),

      moveSection: (fromId, toId) =>
        mapSections((sections) => {
          const from = sections.findIndex((s) => s.id === fromId);
          const to = sections.findIndex((s) => s.id === toId);
          if (from < 0 || to < 0 || from === to) return sections;
          const next = [...sections];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return next;
        }),

      addEntry: (sectionId) =>
        mapSections((sections) =>
          sections.map((s) =>
            s.id === sectionId ? { ...s, entries: [...s.entries, emptyEntry()] } : s,
          ),
        ),

      updateEntry: (sectionId, entryId, patch) =>
        mapSections((sections) =>
          sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  entries: s.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)),
                }
              : s,
          ),
        ),

      removeEntry: (sectionId, entryId) =>
        mapSections((sections) =>
          sections.map((s) =>
            s.id === sectionId ? { ...s, entries: s.entries.filter((e) => e.id !== entryId) } : s,
          ),
        ),

      moveEntry: (sectionId, index, delta) =>
        mapSections((sections) =>
          sections.map((s) => {
            if (s.id !== sectionId) return s;
            const target = index + delta;
            if (target < 0 || target >= s.entries.length) return s;
            const entries = [...s.entries];
            [entries[index], entries[target]] = [entries[target], entries[index]];
            return { ...s, entries };
          }),
        ),

      setOptions: (patch) =>
        setDoc((d) => ({ ...d, options: { ...d.options, ...patch } }), true),

      loadExample: () => setDocState((d) => exampleDoc(d.templateId)),

      clear: () => setDocState((d) => blankDoc(d.templateId)),

      replace: (next) => setDocState(next),
    };
  }, [setDoc]);

  return { doc, actions };
}

export function serialiseDoc(doc: ResumeDoc): string {
  return JSON.stringify(doc, null, 2);
}

export function parseDoc(text: string): ResumeDoc {
  const parsed = migrate(JSON.parse(text));
  if (!parsed) throw new Error("That file is not a résumé saved by this builder.");
  return parsed;
}

export { STORAGE_KEY };
