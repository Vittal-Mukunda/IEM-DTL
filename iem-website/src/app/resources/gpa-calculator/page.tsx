import type { Metadata } from "next";
import Link from "next/link";
import GPACalculator from "@/components/resources/GPACalculator";

export const metadata: Metadata = {
  title: "GPA Calculator",
  description:
    "SGPA and CGPA calculator for the RVCE Industrial Engineering & Management scheme. Subjects, course types and credits come pre-filled for the 3rd through 7th semesters — enter your CIE, Lab SEE and Semester End marks to get grade points, SGPA and CGPA, plus the marks you still need for each grade.",
  keywords: [
    "RVCE GPA calculator",
    "IEM SGPA calculator",
    "RVCE CGPA calculator",
    "SGPA calculator RVCE",
    "IEM RVCE grade points",
    "VTU SGPA calculator",
    "Industrial Engineering and Management RVCE marks",
    "CIE SEE calculator",
  ],
  alternates: { canonical: "/resources/gpa-calculator" },
  openGraph: {
    title: "GPA Calculator | IEM RVCE",
    description:
      "Compute SGPA and CGPA against the IEM scheme at RVCE — credits pre-filled, target marks included.",
    url: "/resources/gpa-calculator",
  },
};

const NOTES = [
  {
    title: "The scheme is already loaded",
    body: "Pick a semester and its subjects, course types and credits fill in from the 2022 IEM scheme for the 3rd through 7th semesters. Add or edit rows if your electives differ.",
  },
  {
    title: "CIE and Sem End, weighted correctly",
    body: "Theory, lab and integrated courses each carry their own split. Enter your marks as you actually received them and the grade point follows the scheme's own rules.",
  },
  {
    title: "Targets, not just totals",
    body: "The target table works backwards: for every grade it shows the Semester End mark you still need, so you know what a subject is asking of you before the exam.",
  },
];

export default function GPACalculatorPage() {
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
            <span>GPA Calculator</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">GPA Calculator</h1>
          <p className="text-lg text-gray-200 max-w-3xl">
            Compute your SGPA and CGPA against the IEM scheme — credits and
            course types pre-filled, marks in, grade points out.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <section aria-label="How it works" className="mb-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {NOTES.map((note) => (
              <div
                key={note.title}
                className="rounded-xl border border-primary/10 bg-surface p-5"
              >
                <h2 className="font-display text-base font-semibold text-primary">
                  {note.title}
                </h2>
                <p className="mt-1 text-sm leading-snug text-text-muted">
                  {note.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-text-muted">
            Everything is worked out in your own browser — nothing you type is
            stored or sent anywhere. The evaluation split this follows is
            documented on the{" "}
            <Link href="/curriculum" className="text-primary hover:underline">
              Curriculum page
            </Link>
            .
          </p>
        </section>

        <section id="gpa-calculator" aria-label="GPA calculator">
          <GPACalculator />
        </section>

        {/* Other resources */}
        <section
          aria-label="Other resources"
          className="mt-14 border-t border-primary/10 pt-8"
        >
          <h2 className="text-xl font-bold text-primary">Also in Resources</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Link
              href="/resources/study-material"
              className="group rounded-xl border border-primary/10 bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-white"
            >
              <h3 className="font-display text-base font-semibold text-primary">
                Study Material
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </h3>
              <p className="mt-1 text-sm leading-snug text-text-muted">
                Semester-wise notes, question banks and past papers for the 3rd
                through 8th semesters.
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
