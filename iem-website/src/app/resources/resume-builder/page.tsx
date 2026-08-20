import type { Metadata } from "next";
import Link from "next/link";
import BuilderClient from "./builder-client";

export const metadata: Metadata = {
  title: "Résumé Builder",
  description:
    "Free résumé builder for RVCE students — pick a professionally designed template, fill in your details, and download a polished résumé as PDF, Word or LaTeX. No login, no payment, nothing uploaded.",
  keywords: [
    "RVCE resume builder",
    "IEM resume builder",
    "free resume builder for students",
    "Harvard resume template",
    "LaTeX resume generator",
    "resume template PDF DOCX",
    "placement resume RVCE",
    "engineering student CV builder",
  ],
  alternates: { canonical: "/resources/resume-builder" },
  openGraph: {
    title: "Résumé Builder | IEM RVCE",
    description:
      "Pick a template, fill in your details, download as PDF, Word or LaTeX. Free, no login, and nothing leaves your browser.",
    url: "/resources/resume-builder",
  },
};

const STEPS = [
  { n: "1", title: "Choose a template", body: "Every one is reverse-engineered from a real university careers-office sample." },
  { n: "2", title: "Type over the example", body: "It opens as an operations-research master's packet: education, research, projects, then internships. Ordinary form fields, no LaTeX." },
  { n: "3", title: "Arrange your sections", body: "Drag to reorder, add what you need, hide what you don't." },
  { n: "4", title: "Check the preview", body: "It updates as you type, and it is drawn from the same data as the download." },
  { n: "5", title: "Download", body: "PDF to send, Word to edit, LaTeX if you want the source." },
];

export default function ResumeBuilderPage() {
  return (
    <>
      <section className="border-b-4 border-accent bg-primary py-14 text-white">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-gray-300">
            <Link href="/resources" className="hover:text-white hover:underline">
              Resources
            </Link>
            <span className="mx-2">/</span>
            <span>Résumé Builder</span>
          </nav>
          <h1 className="mb-3 text-4xl font-bold sm:text-5xl">Résumé Builder</h1>
          <p className="max-w-3xl text-lg text-gray-200">
            Pick a template, fill in your details, and download a finished résumé as PDF, Word or
            LaTeX. Free for every student, no account, and nothing you type leaves your browser.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
        <ol className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step) => (
            <li key={step.n} className="rounded-xl border border-primary/10 bg-surface p-4">
              <span className="font-mono text-xs text-accent">Step {step.n}</span>
              <h2 className="mt-1 font-display text-base font-semibold text-primary">{step.title}</h2>
              <p className="mt-1 text-sm leading-snug text-text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <BuilderClient />

        <section className="mt-14 grid gap-6 border-t border-primary/10 pt-8 md:grid-cols-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-primary">Why these templates</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Each one is measured off a real sample published by a university careers office —
              page size, margins, type size, and the spacing between every line. An automated check
              compares what this tool produces against the original and reports the difference, so
              the layout you download is the layout those offices actually recommend.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-primary">Your privacy</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              There is no account and no server. Your résumé is held in this browser&rsquo;s local
              storage and the files are built on your own machine. Nothing is uploaded, so nothing
              can leak. Use <em>Save a copy</em> to keep a backup you control.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-primary">Writing it well</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              A template only handles the layout. Lead each line with a verb, say what changed, and
              attach a number wherever you honestly can. Keep it to one page until you have enough
              experience that a second page earns itself. For a review before you apply, talk to the{" "}
              <Link href="/placements" className="text-primary underline hover:text-primary-light">
                placement cell
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
