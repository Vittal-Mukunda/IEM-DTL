"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  curriculumCourses,
  curriculumDomains,
  faculty,
  type CurriculumCourse,
} from "@/lib/data";

const facultyByName = new Map(faculty.map((f) => [f.name, f]));
const domainById = new Map(curriculumDomains.map((d) => [d.id, d]));

export default function CourseExplorer() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<CurriculumCourse | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // While the modal is open: lock body scroll, close on Escape, move focus
  // into the dialog, and restore focus to the trigger on close.
  useEffect(() => {
    if (!selected) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocused.current?.focus?.();
    };
  }, [selected, close]);

  const courses = useMemo(
    () =>
      filter
        ? curriculumCourses.filter((c) => c.domain === filter)
        : curriculumCourses,
    [filter],
  );

  return (
    <div>
      {/* Domain filter chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="All courses"
          active={filter === null}
          onClick={() => setFilter(null)}
        />
        {curriculumDomains.map((d) => (
          <FilterChip
            key={d.id}
            label={d.label}
            color={d.color}
            active={filter === d.id}
            onClick={() => setFilter(d.id)}
          />
        ))}
      </div>

      {/* Course grid */}
      <motion.div layout className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => {
            const d = domainById.get(c.domain);
            return (
              <motion.button
                key={c.code}
                type="button"
                layout
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={reduced ? undefined : { y: -3 }}
                onClick={() => setSelected(c)}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{ borderLeftWidth: 4, borderLeftColor: d?.color }}
              >
                <span className="font-mono text-xs text-text-muted">
                  {c.code}
                </span>
                <span className="mt-1 font-semibold text-primary leading-snug">
                  {c.name}
                </span>
                <span className="mt-3 flex items-center justify-between">
                  <span
                    className="text-xs font-medium"
                    style={{ color: d?.color }}
                  >
                    {d?.label}
                  </span>
                  <span className="text-xs text-text-muted group-hover:text-primary">
                    {c.faculty.length} faculty &rarr;
                  </span>
                </span>
              </motion.button>
            );
          })}
      </motion.div>

      {/* Detail modal */}
      {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
            />
            <motion.div
              ref={dialogRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={`${selected.name} details`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.21, 0.65, 0.32, 0.95] }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl focus:outline-none"
            >
              <div
                className="h-1.5 w-full rounded-t-2xl"
                style={{ backgroundColor: domainById.get(selected.domain)?.color }}
              />
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                      style={{
                        backgroundColor: domainById.get(selected.domain)?.color,
                      }}
                    >
                      {domainById.get(selected.domain)?.label}
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-primary">
                      {selected.name}
                    </h3>
                    <p className="font-mono text-xs text-text-muted">
                      {selected.code}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="shrink-0 rounded-full p-1.5 text-text-muted hover:bg-surface hover:text-primary"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-700">
                  {selected.description}
                </p>

                <h4 className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
                  Taught by
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selected.faculty.map((name) => {
                    const f = facultyByName.get(name);
                    if (!f) return null;
                    return (
                      <div
                        key={name}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-surface p-3"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-primary/15">
                          <Image
                            src={f.photo}
                            alt={f.name}
                            width={48}
                            height={48}
                            sizes="48px"
                            className="h-full w-full object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-primary">
                            {f.name}
                          </p>
                          <p className="truncate text-xs text-text-muted">
                            {f.designation}
                          </p>
                          <a
                            href={`mailto:${f.email}`}
                            className="truncate text-xs text-primary-light hover:underline"
                          >
                            {f.email}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
    </div>
  );
}

function FilterChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-transparent text-white"
          : "border-gray-200 text-text-muted hover:text-primary"
      }`}
    >
      {active && (
        <motion.span
          layoutId="course-filter-pill"
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color ?? "var(--primary)" }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {color && !active && (
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        {label}
      </span>
    </button>
  );
}
