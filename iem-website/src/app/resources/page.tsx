import type { Metadata } from "next";
import Link from "next/link";
import { resourceFolders } from "@/lib/data";

export const metadata: Metadata = {
  title: "Student Resources",
  description:
    "Student resources from the Department of Industrial Engineering & Management at RV College of Engineering, Bengaluru — semester-wise study material and notes, an SGPA/CGPA calculator built on the IEM scheme, and a free résumé builder with seventeen university careers-office templates.",
  keywords: [
    "IEM RVCE resources",
    "RVCE IEM student resources",
    "IEM RVCE Notes",
    "RVCE study material",
    "RVCE GPA calculator",
    "IEM SGPA calculator",
    "RVCE resume builder",
    "Industrial Engineering and Management RVCE",
    "RV College of Engineering IEM",
  ],
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Student Resources | IEM RVCE",
    description:
      "Study material, a GPA calculator and a résumé builder for Industrial Engineering & Management students at RVCE.",
    url: "/resources",
  },
};

/** Total number of documents currently published across every semester folder. */
const documentCount = resourceFolders.reduce(
  (n, folder) =>
    n +
    folder.items.length +
    folder.subfolders.reduce((m, sf) => m + sf.items.length, 0),
  0,
);

const subjectCount = resourceFolders.reduce(
  (n, folder) => n + folder.subfolders.length,
  0,
);

interface ResourceSection {
  href: string;
  kicker: string;
  title: string;
  tagline: string;
  body: string;
  bullets: string[];
  meta: string;
  cta: string;
  icon: React.ReactNode;
}

const sections: ResourceSection[] = [
  {
    href: "/resources/study-material",
    kicker: "Semesters 3–8",
    title: "Study Material",
    tagline: "Notes, question banks and past papers",
    body: "Lecture notes, typeset study texts, question banks and previous years' question papers, gathered semester by semester and filed under the subject they belong to. Everything opens as a PDF you can read in the browser or keep for the night before the exam.",
    bullets: [
      "Semester-wise folders, expandable by subject",
      "Question banks and solved past papers",
      "Free to open, nothing to sign in to",
    ],
    meta:
      documentCount > 0
        ? `${documentCount} documents · ${subjectCount} subjects`
        : `${subjectCount} subjects`,
    cta: "Browse the material",
    icon: <BooksIcon />,
  },
  {
    href: "/resources/gpa-calculator",
    kicker: "2022 IEM scheme",
    title: "GPA Calculator",
    tagline: "SGPA and CGPA, worked out properly",
    body: "Choose a semester and the subjects, course types and credits arrive pre-filled from the department scheme. Enter your CIE, Lab SEE and Semester End marks to see grade points, SGPA and a running CGPA — and how many marks each grade still asks of you.",
    bullets: [
      "Presets for the 3rd through 7th semesters",
      "Theory, lab and integrated courses weighted correctly",
      "Target table: the Sem End mark you still need",
    ],
    meta: "Runs entirely in your browser",
    cta: "Open the calculator",
    icon: <CalculatorIcon />,
  },
  {
    href: "/resources/resume-builder",
    kicker: "Free · no login",
    title: "Résumé Builder",
    tagline: "Seventeen careers-office templates",
    body: "Templates measured off real samples published by university careers offices — Harvard, MIT, Stanford, Berkeley, Georgia Tech, Cornell, Columbia and more, plus the LaTeX classics. Fill in ordinary form fields, watch the page redraw as you type, and download when it reads the way you want.",
    bullets: [
      "Reorder, add or hide sections as you like",
      "Download as PDF, Word or LaTeX",
      "Nothing uploaded — it stays in your browser",
    ],
    meta: "17 templates · PDF, DOCX, TeX",
    cta: "Start building",
    icon: <DocumentIcon />,
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            Student Resources
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl">
            Everything the Department of Industrial Engineering &amp; Management
            keeps for its students in one place — the notes you study from, the
            arithmetic behind your marks, and the résumé you send out at the end
            of it.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Chooser */}
        <section aria-label="Choose a resource">
          <h2 className="sr-only">Choose a resource</h2>
          <div className="grid gap-7 lg:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="card-sketch group flex flex-col p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-primary bg-surface text-accent wobble-sm"
                    aria-hidden="true"
                  >
                    {section.icon}
                  </span>
                  <span className="tag-sketch shrink-0">{section.kicker}</span>
                </div>

                <h3 className="mt-5 text-2xl font-bold text-primary">
                  {section.title}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-accent">
                  {section.tagline}
                </p>

                <p className="mt-3 leading-relaxed text-gray-700">
                  {section.body}
                </p>

                <ul className="mt-4 mb-6 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <CheckIcon />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t-2 border-dashed border-primary/20 pt-4">
                  <span className="text-xs text-text-muted">
                    {section.meta}
                  </span>
                  <span className="font-semibold text-primary group-hover:text-accent">
                    {section.cta}
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footnote */}
        <section aria-label="About these resources" className="mt-12">
          <div className="rounded-2xl border border-primary/10 bg-surface p-6 sm:p-8">
            <p className="leading-relaxed text-gray-700">
              These resources are maintained by the{" "}
              <span className="font-semibold text-primary">
                Department of Industrial Engineering &amp; Management, RV College
                of Engineering (RVCE), Bengaluru
              </span>{" "}
              and are free for every student to use. New material is added
              through the year as subjects are taught and papers are set.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Looking for the official syllabus, scheme and evaluation split?
              That lives on the{" "}
              <Link href="/curriculum" className="text-primary hover:underline">
                Curriculum page
              </Link>
              . If something you need is missing,{" "}
              <Link href="/contact" className="text-primary hover:underline">
                tell the department
              </Link>{" "}
              and it can be added.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    </svg>
  );
}

function BooksIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.5C10.5 5.2 8.5 4.7 5 4.9A1 1 0 0 0 4 5.9v11.3a1 1 0 0 0 1.1 1c3.2-.2 5.3.2 6.9 1.4 1.6-1.2 3.7-1.6 6.9-1.4a1 1 0 0 0 1.1-1V5.9a1 1 0 0 0-1-1c-3.5-.2-5.5.3-7 1.6Zm0 0v13"
      />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 3h8v3H8V6Zm0 6h.01M12 12h.01M16 12h.01M8 15h.01M12 15h.01M16 15v3M8 18h4"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 3v4a1 1 0 0 0 1 1h4M5 21V5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Zm4-11h3m-3 4h6m-6 4h6"
      />
    </svg>
  );
}
