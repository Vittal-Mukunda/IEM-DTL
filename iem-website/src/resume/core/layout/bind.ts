/**
 * Binding resolution — turning a cell's `bind` string into text.
 *
 * The vocabulary is deliberately small and fixed, so a template author can read
 * a block definition and know exactly what it will print without consulting the
 * engine.
 */

import { formatDateRange, type ContactLink, type Entry, type ResumeDoc, type Section } from "../model";

export interface BindContext {
  doc: ResumeDoc;
  section?: Section;
  entry?: Entry;
  /** The current item inside a `repeat` row. */
  item?: string;
  link?: ContactLink;
  index?: number;
  /** Template-supplied dash for date ranges. */
  dateDash?: string;
}

const ENTRY_SLOTS = new Set([
  "organization",
  "position",
  "location",
  "summary",
  "detail",
  "url",
]);

export function resolveBinding(bind: string, ctx: BindContext): string {
  switch (bind) {
    case "$item":
      return ctx.item ?? "";
    case "$index":
      return ctx.index === undefined ? "" : String(ctx.index + 1);
    case "personal.name":
      return ctx.doc.personal.name ?? "";
    case "personal.headline":
      return ctx.doc.personal.headline ?? "";
    case "section.title":
      return ctx.section?.title ?? "";
    case "section.text":
      return ctx.section?.text ?? "";
    case "dateRange":
      return ctx.entry ? formatDateRange(ctx.entry, ctx.dateDash ?? "–") : "";
    case "$link.label":
      return ctx.link?.label ?? "";
    case "$link.icon":
      return ctx.link ? ICONS[ctx.link.kind] : "";
    case "rating":
      return ctx.entry?.rating === undefined ? "" : String(ctx.entry.rating);
    case "tags":
      return (ctx.entry?.tags ?? []).filter(Boolean).join(", ");
    default:
      if (ENTRY_SLOTS.has(bind)) {
        return (ctx.entry?.[bind as keyof Entry] as string | undefined) ?? "";
      }
      return "";
  }
}

/** Font Awesome 6 Free codepoints. Escapes, not literals: the glyphs live in
 *  the private use area and would be invisible (and easy to mangle) as source. */
export const ICONS: Record<string, string> = {
  email: "\uf0e0", // envelope
  phone: "\uf095", // phone
  location: "\uf3c5", // location-dot
  website: "\uf0ac", // globe
  linkedin: "\uf08c", // linkedin
  github: "\uf09b", // github
  orcid: "\uf8d2", // orcid
  scholar: "\uf19d", // graduation-cap
  other: "\uf0c1", // link
};

/** Which Font Awesome face a link's icon lives in. */
export const ICON_FACE: Record<string, "solid" | "brands"> = {
  email: "solid",
  phone: "solid",
  location: "solid",
  website: "solid",
  linkedin: "brands",
  github: "brands",
  orcid: "brands",
  scholar: "solid",
  other: "solid",
};

export function bindingHasValue(bind: string | undefined, ctx: BindContext): boolean {
  if (!bind) return true;
  if (bind === "bullets") return (ctx.entry?.bullets ?? []).some((b) => b.trim());
  if (bind === "tags") return (ctx.entry?.tags ?? []).some((t) => t.trim());
  if (bind === "links") return ctx.doc.personal.links.some((l) => l.label.trim());
  return resolveBinding(bind, ctx).trim().length > 0;
}
