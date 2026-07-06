"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  faculty,
  facultyDetails,
  type FacultyMember,
} from "@/lib/data";

function SocialLinks({ f, size = "xs" }: { f: FacultyMember; size?: "xs" | "sm" }) {
  const cls =
    (size === "sm" ? "text-sm" : "text-xs") +
    " inline-block text-primary-light hover:underline";
  const links: { label: string; href: string }[] = [];
  if (f.linkedin) links.push({ label: "LinkedIn ↗", href: f.linkedin });
  if (f.scholarUrl) links.push({ label: "Scholar ↗", href: f.scholarUrl });
  if (f.orcid)
    links.push({ label: "ORCID ↗", href: `https://orcid.org/${f.orcid}` });
  if (f.researchgate)
    links.push({ label: "ResearchGate ↗", href: f.researchgate });
  if (f.profile) links.push({ label: "Profile ↗", href: f.profile });
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          onClick={(e) => e.stopPropagation()}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

export default function FacultyDirectory() {
  const [selected, setSelected] = useState<FacultyMember | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

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

  const hod = faculty[0];
  const detail = selected ? facultyDetails[selected.name] : undefined;

  return (
    <>
      {/* HoD Card */}
      <section className="mb-12">
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-primary/10">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <button
              type="button"
              onClick={() => setSelected(hod)}
              className="w-40 aspect-[340/438] rounded-xl overflow-hidden shrink-0 border-2 border-primary/20 bg-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={`View profile of ${hod.name}`}
            >
              <Image
                src={hod.photo}
                alt={hod.name}
                width={340}
                height={438}
                sizes="160px"
                className="w-full h-full object-cover object-top"
              />
            </button>
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
                Head of Department
              </p>
              <button
                type="button"
                onClick={() => setSelected(hod)}
                className="text-2xl font-bold text-primary hover:text-primary-light transition-colors text-left"
              >
                {hod.name}
              </button>
              <p className="text-text-muted mt-1">{hod.designation}</p>
              <p className="text-base text-gray-600 mt-2">{hod.specialization}</p>
              <a
                href={`mailto:${hod.email}`}
                className="inline-block mt-3 text-sm text-primary hover:text-primary-light transition-colors"
              >
                {hod.email}
              </a>
              <div className="mt-3">
                <SocialLinks f={hod} size="sm" />
              </div>
              <button
                type="button"
                onClick={() => setSelected(hod)}
                className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
              >
                View bio &amp; qualifications →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {faculty.slice(1).map((f) => (
          <div
            key={f.email}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col"
          >
            <button
              type="button"
              onClick={() => setSelected(f)}
              className="aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={`View profile of ${f.name}`}
            >
              <Image
                src={f.photo}
                alt={f.name}
                width={400}
                height={300}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <div className="p-4 flex flex-col flex-1">
              <button
                type="button"
                onClick={() => setSelected(f)}
                className="font-semibold text-primary text-base text-left hover:text-primary-light transition-colors"
              >
                {f.name}
              </button>
              <p className="text-sm text-accent font-medium mt-0.5">
                {f.designation}
              </p>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">
                {f.specialization}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <a
                  href={`mailto:${f.email}`}
                  className="text-xs text-primary hover:text-primary-light transition-colors truncate"
                >
                  {f.email}
                </a>
                {f.publications && f.publications > 0 ? (
                  <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full shrink-0 ml-2">
                    {f.publications} pubs
                  </span>
                ) : null}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <SocialLinks f={f} />
              </div>
              <button
                type="button"
                onClick={() => setSelected(f)}
                className="mt-3 text-xs font-medium text-accent hover:underline self-start"
              >
                View bio →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} profile`}
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-primary text-white p-6 sm:rounded-t-2xl rounded-t-2xl">
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-lg leading-none"
              >
                ✕
              </button>
              <div className="flex gap-4 items-center">
                <div className="w-24 aspect-[3/4] rounded-lg overflow-hidden shrink-0 border-2 border-accent/40 bg-white/10">
                  <Image
                    src={selected.photo}
                    alt={selected.name}
                    width={170}
                    height={226}
                    sizes="96px"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0 pr-6">
                  <h3 className="text-xl font-bold leading-tight">
                    {selected.name}
                  </h3>
                  <p className="text-sm text-accent font-medium mt-1">
                    {selected.designation}
                  </p>
                  {detail?.joined && (
                    <p className="text-xs text-gray-300 mt-1">
                      At RVCE since {detail.joined}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {detail?.bio && (
                <p className="text-base text-gray-700 leading-relaxed">
                  {detail.bio}
                </p>
              )}

              {detail?.experience && (
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
                    Experience
                  </p>
                  <p className="text-base text-gray-700">{detail.experience}</p>
                </div>
              )}

              {detail?.qualification && (
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
                    Qualifications
                  </p>
                  <p className="text-base text-gray-700">
                    {detail.qualification}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
                  Areas of Interest
                </p>
                <p className="text-base text-gray-700">
                  {selected.specialization}
                </p>
              </div>

              {selected.publications && selected.publications > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
                    Publications
                  </p>
                  <p className="text-base text-gray-700">
                    {selected.publications}+ publications
                  </p>
                </div>
              ) : null}

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                  Connect
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {selected.email}
                  </a>
                  <SocialLinks f={selected} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
