import type { Metadata } from "next";
import Link from "next/link";
import { resourceFolders, type ResourceItem } from "@/lib/data";

export const metadata: Metadata = {
  title: "Study Material & Notes",
  description:
    "IEM RVCE Notes & Study Material — semester-wise lecture notes, study guides, question banks and past question papers (3rd to 8th semester) for the B.E. Industrial Engineering & Management program at RV College of Engineering, Bengaluru, curated by the Department of Industrial Engineering & Management.",
  keywords: [
    "IEM RVCE Notes",
    "IEM RVCE study material",
    "RVCE IEM Notes",
    "Industrial Engineering and Management Notes",
    "IEM semester notes",
    "RVCE study material",
    "IEM 3rd semester notes",
    "IEM 4th semester notes",
    "IEM 5th semester notes",
    "IEM 6th semester notes",
    "IEM 7th semester notes",
    "IEM 8th semester notes",
    "RV College of Engineering IEM",
    "Industrial Engineering notes RVCE",
    "VTU IEM notes",
  ],
  alternates: { canonical: "/resources/study-material" },
  openGraph: {
    title: "IEM RVCE Notes & Study Material | Semester-wise",
    description:
      "Semester-wise notes and study resources (3rd–8th semester) for Industrial Engineering & Management at RVCE, curated by the department.",
    url: "/resources/study-material",
  },
};

export default function StudyMaterialPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-gray-300">
            <Link href="/resources" className="hover:text-white hover:underline">
              Resources
            </Link>
            <span className="mx-2">/</span>
            <span>Study Material</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            Study Material &amp; Notes
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl">
            IEM RVCE Notes &amp; Resources — semester-wise study material for
            the B.E. in Industrial Engineering &amp; Management.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro note */}
        <section className="mb-10">
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-primary/10">
            <p className="text-gray-700 leading-relaxed">
              Below are the study resources and notes provided by the{" "}
              <span className="font-semibold text-primary">
                Department of Industrial Engineering &amp; Management, RV College
                of Engineering (RVCE), Bengaluru
              </span>{" "}
              to support you throughout your academic journey. Material is
              organised into semester-wise folders, from the 3rd semester
              through the 8th semester, covering lecture notes, study guides,
              question papers, and reference material for the IEM program.
            </p>
            <p className="text-sm text-text-muted leading-relaxed mt-4">
              New resources are added regularly. If a folder is empty, notes for
              that semester will be uploaded soon — check back later, or{" "}
              <Link href="/contact" className="text-primary hover:underline">
                reach out to the department
              </Link>{" "}
              if you need something specific. Looking for the official syllabus
              and scheme? See the{" "}
              <Link href="/curriculum" className="text-primary hover:underline">
                Curriculum page
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Semester folders */}
        <section aria-label="Semester resource folders">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resourceFolders.map((folder) => {
              const subCount = folder.subfolders.reduce(
                (n, sf) => n + sf.items.length,
                0,
              );
              const total = folder.items.length + subCount;
              const hasContent = total > 0;
              return (
                <div
                  key={folder.sem}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="flex items-center gap-3 p-5 border-b border-gray-100 bg-primary/5">
                    <FolderIcon />
                    <div>
                      <h2 className="font-semibold text-primary leading-tight">
                        {folder.title}
                      </h2>
                      <p className="text-xs text-text-muted mt-0.5">
                        {hasContent
                          ? `${total} item${total > 1 ? "s" : ""}`
                          : folder.subfolders.length > 0
                            ? `${folder.subfolders.length} subjects · notes coming soon`
                            : "No resources yet"}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 flex-1 space-y-5">
                    {!hasContent && folder.subfolders.length === 0 && (
                      <p className="text-sm text-text-muted italic">
                        Resources coming soon.
                      </p>
                    )}

                    {/* Subject subfolders — click the header to expand/collapse */}
                    {folder.subfolders.map((sf) => (
                      <details key={sf.name}>
                        <summary className="flex items-center gap-2 cursor-pointer list-none select-none rounded-md py-1 hover:text-primary [&::-webkit-details-marker]:hidden">
                          <ChevronIcon />
                          <SubfolderIcon />
                          <h3 className="text-sm font-semibold text-primary">
                            {sf.name}
                          </h3>
                          <span className="ml-auto text-xs text-text-muted">
                            {sf.items.length > 0 ? sf.items.length : "soon"}
                          </span>
                        </summary>
                        {sf.items.length > 0 ? (
                          <ul className="mt-2 ml-2 space-y-2 pl-6 border-l-2 border-accent/30">
                            {sf.items.map((item) => (
                              <li key={item.file}>
                                <FileLink item={item} />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 ml-2 pl-6 border-l-2 border-accent/30 text-sm text-text-muted italic">
                            Notes coming soon.
                          </p>
                        )}
                      </details>
                    ))}

                    {/* Loose files (not in a subfolder) */}
                    {folder.items.length > 0 && (
                      <ul className="space-y-2">
                        {folder.items.map((item) => (
                          <li key={item.file}>
                            <FileLink item={item} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Other resources */}
        <section
          aria-label="Other resources"
          className="mt-14 border-t border-primary/10 pt-8"
        >
          <h2 className="text-xl font-bold text-primary">Also in Resources</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Link
              href="/resources/gpa-calculator"
              className="group rounded-xl border border-primary/10 bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-white"
            >
              <h3 className="font-display text-base font-semibold text-primary">
                GPA Calculator
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </h3>
              <p className="mt-1 text-sm leading-snug text-text-muted">
                Work out your SGPA and CGPA from CIE and Semester End marks,
                with the IEM scheme pre-filled semester by semester.
              </p>
            </Link>
            <Link
              href="/resources/resume-builder"
              className="group rounded-xl border border-primary/10 bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-white"
            >
              <h3 className="font-display text-base font-semibold text-primary">
                Résumé Builder
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </h3>
              <p className="mt-1 text-sm leading-snug text-text-muted">
                Seventeen university careers-office templates. Fill in the form
                fields and download as PDF, Word or LaTeX.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function FileLink({ item }: { item: ResourceItem }) {
  return (
    <Link
      href={item.file}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 text-sm text-gray-700 hover:text-primary group"
    >
      <span className="flex items-center gap-2 min-w-0">
        <FileIcon />
        <span className="truncate group-hover:underline">{item.label}</span>
      </span>
      {item.size && (
        <span className="text-xs text-text-muted shrink-0">{item.size}</span>
      )}
    </Link>
  );
}

function FileIcon() {
  return (
    <svg
      className="w-4 h-4 text-text-muted shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 3v4a1 1 0 0 0 1 1h4M5 21V5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="res-chevron w-4 h-4 text-text-muted shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
    </svg>
  );
}

function SubfolderIcon() {
  return (
    <svg
      className="w-5 h-5 text-accent shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      className="w-8 h-8 text-accent shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
      />
    </svg>
  );
}
