"use client";

/**
 * The builder.
 *
 * Editor on the left, live preview on the right, everything in the browser.
 * The preview is not an approximation of the download — both are drawn from the
 * same box tree, so what a student sees is what the PDF contains.
 */

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FontBook } from "../core/fonts";
import { layoutResume, type LayoutResult } from "../core/layout";
import { hrefForLink, type LinkKind, type SectionKind } from "../core/model";
import { substitutions } from "../core/schema";
import { ResumePreview } from "../core/render/preview";
import { getTemplate, templateList } from "../templates";
import { addableKinds, specFor } from "./sectionKinds";
import { SectionCard } from "./SectionCard";
import { parseDoc, serialiseDoc, useResumeDoc } from "./useResumeDoc";
import { Button, Plus, Select, TextInput } from "./ui";

const LINK_KINDS: { value: LinkKind; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "location", label: "Location" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "website", label: "Website" },
  { value: "orcid", label: "ORCID" },
  { value: "scholar", label: "Scholar" },
  { value: "other", label: "Other" },
];

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoke on the next tick — Safari needs the URL to survive the click.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const slug = (name: string) =>
  (name.trim() || "resume").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ResumeBuilder() {
  const { doc, actions } = useResumeDoc();
  const template = useMemo(() => getTemplate(doc.templateId), [doc.templateId]);

  // Keyed by template id rather than cleared on change: resetting it inside the
  // effect would be a synchronous setState there, and a stale book is easier to
  // reason about when it simply does not match the template you asked for.
  const [loaded, setLoaded] = useState<{ id: string; book: FontBook } | null>(null);
  const [fontError, setFontError] = useState<{ id: string; message: string } | null>(null);
  const book = loaded?.id === template.id ? loaded.book : null;
  const [busy, setBusy] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // One font book per template, loaded on demand. Switching templates reloads
  // only the faces the new one needs.
  useEffect(() => {
    let cancelled = false;
    FontBook.load(template)
      .then(async (next) => {
        await next.registerCssFaces?.();
        if (!cancelled) setLoaded({ id: template.id, book: next });
      })
      .catch((err: Error) => {
        if (!cancelled) setFontError({ id: template.id, message: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [template]);

  const layout: LayoutResult | null = useMemo(() => {
    if (!book) return null;
    return layoutResume({ doc, template, book });
  }, [doc, template, book]);

  const exportAs = useCallback(
    async (kind: "pdf" | "tex" | "docx") => {
      if (!book || !layout) return;
      setBusy(kind);
      try {
        const name = slug(doc.personal.name);
        if (kind === "pdf") {
          const { renderPdf, pdfBlob } = await import("../core/render/pdf");
          const bytes = await renderPdf(layout, book, {
            title: `${doc.personal.name || "Résumé"} — ${template.name}`,
            author: doc.personal.name || undefined,
          });
          download(pdfBlob(bytes), `${name}.pdf`);
        } else if (kind === "tex") {
          const { renderLatex, texBlob } = await import("../core/render/latex");
          download(texBlob(renderLatex(doc, template)), `${name}.tex`);
        } else {
          const { renderDocx, docxBlob } = await import("../core/render/docx");
          // The same fit the preview and the PDF used — Word has no overflow
          // cascade of its own, so it has to be handed the fitted values.
          const bytes = await renderDocx(doc, template, {
            fontScale: layout.appliedFontScale,
            spacing: layout.appliedSpacing,
          });
          download(docxBlob(bytes), `${name}.docx`);
        }
      } catch (err) {
        window.alert((err as Error).message || "The download failed.");
      } finally {
        setBusy(null);
      }
    },
    [book, layout, doc, template],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) actions.moveSection(String(active.id), String(over.id));
  };

  const available = useMemo(() => new Set(template.sections.available), [template]);
  const subs = useMemo(() => substitutions(template), [template]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:items-start">
      {/* ---------------- editor ---------------- */}
      <div className="flex flex-col gap-5">
        {/* Shown until the first edit. It goes away by being acted on rather
            than by being dismissed, which is why there is no close button. */}
        {doc.example && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-accent/30 bg-accent/6 px-4 py-3">
            <p className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">
              <strong className="font-semibold">This is an example.</strong> Type over any
              field to make it yours — the preview updates as you go.
            </p>
            <Button tone="quiet" onClick={actions.clear} className="shrink-0">
              Clear it and start blank
            </Button>
          </div>
        )}
        {/* Template + options */}
        <section className="rounded-2xl border border-primary/12 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-1 font-display text-xl font-semibold text-primary">1 · Choose a template</h2>
          <p className="mb-4 text-sm text-text-muted">
            Every template holds the same information. Switching keeps everything you have typed.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {templateList.map((t) => {
              const active = t.id === doc.templateId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => actions.setTemplate(t.id)}
                  aria-pressed={active}
                  className={`overflow-hidden rounded-xl border text-left transition-colors ${
                    active
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-primary/15 hover:border-primary/40 hover:bg-surface"
                  }`}
                >
                  {/* A page of the same résumé in every template, so the
                      comparison is of layouts rather than of invented content. */}
                  <span className="block overflow-hidden border-b border-primary/10 bg-white">
                    <Image
                      src={t.meta.thumbnail}
                      alt=""
                      width={310}
                      height={401}
                      className="h-36 w-full object-cover object-top"
                    />
                  </span>
                  <span className="block p-3">
                    <span className="block font-display text-base font-semibold text-primary">
                      {t.name}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-text-muted">
                      {t.meta.description}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1">
                      {t.meta.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-surface-dark/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 border-t border-primary/10 pt-4 sm:grid-cols-3">
            <Select
              label="Paper size"
              value={doc.options.pageSize}
              onChange={(e) =>
                actions.setOptions({ pageSize: e.target.value as typeof doc.options.pageSize })
              }
            >
              <option value="native">
                Template default ({template.page.size === "a4" ? "A4" : "US Letter"})
              </option>
              <option value="a4">A4</option>
              <option value="letter">US Letter</option>
            </Select>

            <Select
              label="Page limit"
              value={String(doc.options.maxPages)}
              onChange={(e) => actions.setOptions({ maxPages: Number(e.target.value) })}
            >
              <option value="1">One page</option>
              <option value="2">Two pages</option>
              <option value="3">Three pages</option>
            </Select>

            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-text-muted">
                Text size · {Math.round(doc.options.fontScale * 100)}%
              </span>
              <input
                type="range"
                min={template.rules.fontScale.min * 100}
                max={template.rules.fontScale.max * 100}
                step={template.rules.fontScale.step * 100}
                value={doc.options.fontScale * 100}
                onChange={(e) => actions.setOptions({ fontScale: Number(e.target.value) / 100 })}
                className="mt-2 w-full accent-[var(--primary-light)]"
                aria-label="Text size"
              />
              <span className="text-xs text-text-muted">
                The template limits this so the layout cannot break.
              </span>
            </div>
          </div>
        </section>

        {/* Personal details */}
        <section className="rounded-2xl border border-primary/12 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 font-display text-xl font-semibold text-primary">2 · Your details</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput
              label="Full name"
              placeholder="Ananya Krishnamurthy"
              value={doc.personal.name}
              onChange={(e) => actions.setName(e.target.value)}
            />
            <TextInput
              label="Tagline"
              placeholder="Industrial Engineering & Management"
              hint="Printed only by templates that have a place for it."
              value={doc.personal.headline ?? ""}
              onChange={(e) => actions.setHeadline(e.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-text-muted">
              Contact line
            </span>
            {doc.personal.links.map((link) => (
              <div key={link.id} className="flex items-center gap-2">
                <select
                  value={link.kind}
                  onChange={(e) => actions.updateLink(link.id, { kind: e.target.value as LinkKind })}
                  aria-label="Kind of contact detail"
                  className="w-32 shrink-0 rounded-lg border border-primary/15 bg-white px-2 py-2 text-sm"
                >
                  {LINK_KINDS.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
                <input
                  value={link.label}
                  placeholder={
                    link.kind === "email"
                      ? "you@rvce.edu.in"
                      : link.kind === "phone"
                        ? "+91 98765 43210"
                        : link.kind === "location"
                          ? "Bengaluru, KA"
                          : "linkedin.com/in/you"
                  }
                  onChange={(e) =>
                    actions.updateLink(link.id, {
                      label: e.target.value,
                      href: hrefForLink({ ...link, label: e.target.value }),
                    })
                  }
                  aria-label={`${link.kind} value`}
                  className="w-full rounded-lg border border-primary/15 bg-white px-3 py-2 text-[15px] focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/25"
                />
                <button
                  type="button"
                  onClick={() => actions.removeLink(link.id)}
                  aria-label="Remove this contact detail"
                  className="shrink-0 rounded-md p-1.5 text-text-muted hover:bg-accent/10 hover:text-accent"
                >
                  ✕
                </button>
              </div>
            ))}
            <Button onClick={actions.addLink} className="self-start">
              <Plus /> Add a contact detail
            </Button>
          </div>
        </section>

        {/* Sections */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-primary">3 · Sections</h2>
            <p className="text-sm text-text-muted">Drag by the handle to reorder.</p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={doc.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3">
                {doc.sections.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    actions={actions}
                    supported={available.has(section.kind)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="rounded-2xl border border-dashed border-primary/25 bg-surface/50 p-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-text-muted">
              Add a section
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {addableKinds.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => actions.addSection(kind as SectionKind)}
                  className="rounded-lg border border-primary/20 bg-white px-3 py-1.5 text-sm text-primary transition-colors hover:border-primary/50 hover:bg-surface"
                >
                  + {specFor(kind).title}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Saving */}
        <section className="rounded-2xl border border-primary/12 bg-white p-4 text-sm shadow-sm sm:p-5">
          <h2 className="mb-2 font-display text-xl font-semibold text-primary">Your data</h2>
          <p className="mb-4 leading-relaxed text-text-muted">
            Everything you type stays in this browser. Nothing is uploaded, and there is no account.
            Clearing your browser data will erase it, so save a copy if the résumé matters.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                download(
                  new Blob([serialiseDoc(doc)], { type: "application/json" }),
                  `${slug(doc.personal.name)}-resume.json`,
                )
              }
            >
              Save a copy
            </Button>
            <Button onClick={() => fileInput.current?.click()}>Load a saved copy</Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  actions.replace(parseDoc(await file.text()));
                } catch (err) {
                  window.alert((err as Error).message);
                }
                e.target.value = "";
              }}
            />
            <Button
              onClick={() => {
                if (
                  doc.example ||
                  window.confirm("Replace what you have typed with the example résumé?")
                ) {
                  actions.loadExample();
                }
              }}
            >
              Load the example
            </Button>
            <Button
              tone="danger"
              onClick={() => {
                if (doc.example || window.confirm("Clear every field and start blank?")) {
                  actions.clear();
                }
              }}
            >
              Clear everything
            </Button>
          </div>
        </section>
      </div>

      {/* ---------------- preview ---------------- */}
      <div className="lg:sticky lg:top-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto font-display text-xl font-semibold text-primary">4 · Preview &amp; download</h2>
            <Button tone="primary" disabled={!layout || busy !== null} onClick={() => exportAs("pdf")}>
              {busy === "pdf" ? "Building…" : "PDF"}
            </Button>
            <Button disabled={!layout || busy !== null} onClick={() => exportAs("docx")}>
              {busy === "docx" ? "Building…" : "Word"}
            </Button>
            <Button disabled={!layout || busy !== null} onClick={() => exportAs("tex")}>
              {busy === "tex" ? "Building…" : "LaTeX"}
            </Button>
          </div>

          {layout?.warnings.length ? (
            <ul className="flex flex-col gap-1 rounded-xl border border-accent/30 bg-accent/6 px-4 py-3 text-sm text-accent">
              {layout.warnings.map((warning, i) => (
                <li key={i}>{warning.message}</li>
              ))}
            </ul>
          ) : null}

          {fontError?.id === template.id && (
            <p className="rounded-xl border border-accent/30 bg-accent/6 px-4 py-3 text-sm text-accent">
              The template&rsquo;s fonts could not be loaded: {fontError.message}
            </p>
          )}

          <div className="max-h-[calc(100vh-11rem)] overflow-auto rounded-2xl bg-surface-dark/40 p-4">
            {layout ? (
              <ResumePreview layout={layout} template={template} book={book!} width={512} />
            ) : (
              <div
                className="grid aspect-[612/792] w-full place-items-center rounded bg-white text-text-muted"
                aria-live="polite"
              >
                Loading fonts…
              </div>
            )}
          </div>

          {subs.length > 0 && (
            <p className="text-xs leading-relaxed text-text-muted">
              {subs.map((s) => (
                <span key={s.family} className="mr-3 inline-block">
                  {s.original} is set in {s.family}
                  {s.fidelity === "metric" ? " (identical widths)" : " (close, not identical)"}.
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
