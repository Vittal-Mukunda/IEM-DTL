"use client";

/**
 * One section in the editor: its heading, its entries, and the controls for
 * adding, removing and reordering them.
 *
 * The fields a student sees come from `sectionKinds.ts`, not from the template,
 * so switching from Harvard to Jake's Resume never re-labels anything or asks
 * for the same information twice.
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import type { Entry, Section } from "../core/model";
import type { ResumeActions } from "./useResumeDoc";
import { specFor, type FieldSpec } from "./sectionKinds";
import { Arrow, Button, Chevron, Cross, Grip, IconButton, Plus, TextArea, TextInput } from "./ui";

function EntryFields({
  entry,
  fields,
  onPatch,
}: {
  entry: Entry;
  fields: FieldSpec[];
  onPatch: (patch: Partial<Entry>) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field) => {
        const value = (entry[field.slot] as string | undefined) ?? "";
        const Component = field.multiline ? TextArea : TextInput;
        return (
          <div key={field.slot} className={field.half ? "" : "sm:col-span-2"}>
            <Component
              label={field.label}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => onPatch({ [field.slot]: e.target.value } as Partial<Entry>)}
            />
          </div>
        );
      })}
    </div>
  );
}

function BulletList({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-text-muted">
        {label}
      </span>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <textarea
            rows={2}
            value={item}
            placeholder="Reduced changeover time by 31% by resequencing the setup steps."
            onChange={(e) => {
              const next = [...items];
              next[index] = e.target.value;
              onChange(next);
            }}
            className="w-full min-w-0 resize-y rounded-lg border border-primary/15 bg-white px-3 py-2 text-[15px] leading-relaxed placeholder:text-text-muted/60 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/25"
          />
          <div className="flex flex-col pt-1">
            <IconButton
              title="Move up"
              disabled={index === 0}
              onClick={() => {
                const next = [...items];
                [next[index - 1], next[index]] = [next[index], next[index - 1]];
                onChange(next);
              }}
            >
              <Arrow up />
            </IconButton>
            <IconButton
              title="Remove this line"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Cross />
            </IconButton>
          </div>
        </div>
      ))}
      <Button onClick={() => onChange([...items, ""])} className="self-start">
        <Plus /> Add a line
      </Button>
    </div>
  );
}

function EntryCard({
  section,
  entry,
  index,
  total,
  actions,
}: {
  section: Section;
  entry: Entry;
  index: number;
  total: number;
  actions: ResumeActions;
}) {
  const spec = specFor(section.kind);
  const patch = (p: Partial<Entry>) => actions.updateEntry(section.id, entry.id, p);
  const heading = entry.organization?.trim() || entry.position?.trim() || `Untitled ${spec.itemNoun}`;

  return (
    <div className="rounded-xl border border-primary/10 bg-surface/60 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-primary">{heading}</span>
        <IconButton title="Move up" disabled={index === 0} onClick={() => actions.moveEntry(section.id, index, -1)}>
          <Arrow up />
        </IconButton>
        <IconButton
          title="Move down"
          disabled={index === total - 1}
          onClick={() => actions.moveEntry(section.id, index, 1)}
        >
          <Arrow />
        </IconButton>
        <IconButton title={`Remove this ${spec.itemNoun}`} onClick={() => actions.removeEntry(section.id, entry.id)}>
          <Cross />
        </IconButton>
      </div>

      <div className="flex flex-col gap-3">
        <EntryFields entry={entry} fields={spec.fields} onPatch={patch} />

        {spec.dates && (
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput
              label="From"
              placeholder="Jun 2024"
              value={entry.dateStart ?? ""}
              onChange={(e) => patch({ dateStart: e.target.value })}
            />
            <TextInput
              label="To"
              placeholder="Aug 2025"
              value={entry.current ? "" : (entry.dateEnd ?? "")}
              disabled={entry.current}
              onChange={(e) => patch({ dateEnd: e.target.value })}
            />
            <label className="flex items-end gap-2 pb-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={Boolean(entry.current)}
                onChange={(e) => patch({ current: e.target.checked })}
                className="h-4 w-4 rounded border-primary/30 accent-[var(--primary-light)]"
              />
              Still here
            </label>
          </div>
        )}

        {spec.bullets && (
          <BulletList
            label={spec.bulletLabel ?? "Bullet points"}
            items={entry.bullets}
            onChange={(bullets) => patch({ bullets })}
          />
        )}

        {spec.tags && (
          <TextInput
            label={spec.tagLabel ?? "Tags"}
            placeholder="Python, Minitab, SQL"
            value={entry.tags.join(", ")}
            hint="Separate with commas."
            onChange={(e) =>
              patch({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
            }
          />
        )}
      </div>
    </div>
  );
}

export function SectionCard({
  section,
  actions,
  supported,
}: {
  section: Section;
  actions: ResumeActions;
  supported: boolean;
}) {
  const [open, setOpen] = useState(true);
  const spec = specFor(section.kind);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border bg-white transition-shadow ${
        isDragging ? "border-primary/40 shadow-lg" : "border-primary/12 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-1 px-3 py-3">
        <button
          type="button"
          className="grid h-11 w-11 cursor-grab touch-none place-items-center rounded-md text-text-muted hover:bg-primary/10 hover:text-primary active:cursor-grabbing sm:h-auto sm:w-auto sm:p-1"
          aria-label={`Reorder ${section.title}`}
          {...attributes}
          {...listeners}
        >
          <Grip />
        </button>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left hover:text-primary sm:min-h-0"
          aria-expanded={open}
        >
          <Chevron down={open} />
          <span className="truncate font-display text-lg font-semibold text-primary">
            {section.title || spec.title}
          </span>
          <span className="shrink-0 font-mono text-[11px] text-text-muted">
            {section.layout === "paragraph"
              ? section.text?.trim()
                ? "written"
                : "empty"
              : `${section.entries.length}`}
          </span>
        </button>

        <label className="flex min-h-11 shrink-0 items-center gap-1.5 pr-1 text-xs text-text-muted sm:min-h-0">
          <input
            type="checkbox"
            checked={section.visible}
            onChange={(e) => actions.updateSection(section.id, { visible: e.target.checked })}
            className="h-4 w-4 rounded border-primary/30 accent-[var(--primary-light)]"
          />
          Show
        </label>

        <IconButton title={`Delete the ${section.title} section`} onClick={() => actions.removeSection(section.id)}>
          <Cross />
        </IconButton>
      </div>

      {!supported && (
        <p className="mx-3 mb-3 rounded-lg bg-accent/8 px-3 py-2 text-xs leading-snug text-accent">
          This template has no styling for a {spec.title.toLowerCase()} section, so it is printed with
          the generic entry layout.
        </p>
      )}

      {open && (
        <div className="flex flex-col gap-4 border-t border-primary/10 px-3 pb-4 pt-4 sm:px-4">
          <TextInput
            label="Heading as printed"
            value={section.title}
            placeholder={spec.title}
            hint={spec.hint}
            onChange={(e) => actions.updateSection(section.id, { title: e.target.value })}
          />

          {section.layout === "paragraph" ? (
            <TextArea
              label="Text"
              rows={4}
              value={section.text ?? ""}
              placeholder="Industrial engineering student with hands-on experience in line balancing and process simulation…"
              onChange={(e) => actions.updateSection(section.id, { text: e.target.value })}
            />
          ) : (
            <>
              {section.entries.map((entry, index) => (
                <EntryCard
                  key={entry.id}
                  section={section}
                  entry={entry}
                  index={index}
                  total={section.entries.length}
                  actions={actions}
                />
              ))}
              <Button onClick={() => actions.addEntry(section.id)} className="self-start">
                <Plus /> Add {spec.itemNoun}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
