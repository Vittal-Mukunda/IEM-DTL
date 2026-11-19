import type { Metadata } from "next";
import Link from "next/link";
import { studyUpdates } from "@/lib/updates";
import { UpdateBatch, formatUpdateDate } from "@/components/resources/UpdateParts";

export const metadata: Metadata = {
  title: "What's New: Study Material Updates",
  description:
    "Every batch of new study material added to the IEM RVCE website: new CIE question papers, notes, slides and question banks, listed by date with the semester and subject.",
  keywords: [
    "IEM RVCE new question papers",
    "IEM RVCE study material updates",
    "RVCE IEM CIE papers",
    "IEM RVCE Notes",
  ],
  alternates: { canonical: "/resources/updates" },
  openGraph: {
    title: "What's New | IEM RVCE Study Material",
    description:
      "New CIE papers, notes and slides added to the IEM RVCE website, newest first.",
    url: "/resources/updates",
  },
};

export default function UpdatesPage() {
  const total = studyUpdates.reduce((n, u) => n + u.items.length, 0);
  const latest = studyUpdates[0];
  return (
    <>
      <section className="bg-primary text-white py-16 border-b-4 border-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-gray-300">
            <Link href="/resources" className="hover:text-white hover:underline">
              Resources
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/resources/study-material"
              className="hover:text-white hover:underline"
            >
              Study Material
            </Link>
            <span className="mx-2">/</span>
            <span>What&apos;s new</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            What&apos;s new
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl">
            Everything added to the study material, newest first: CIE papers,
            notes, slides and question banks.
            {latest && (
              <>
                {" "}
                Last updated {formatUpdateDate(latest.date)}.
              </>
            )}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="mb-8 text-sm text-text-muted">
          {total} items across {studyUpdates.length} updates. Papers and notes
          open as PDFs. Where a paper sits inside a combined PDF, the note under
          it says where to look.
        </p>

        <div className="space-y-10">
          {studyUpdates.map((update) => (
            <UpdateBatch key={update.date} update={update} headingLevel="h2" />
          ))}
        </div>

        <section
          aria-label="Share material"
          className="mt-14 rounded-2xl border border-primary/10 bg-surface p-6 sm:p-8"
        >
          <h2 className="text-lg font-bold text-primary">
            Have something that&apos;s missing?
          </h2>
          <p className="mt-2 leading-relaxed text-gray-700">
            We&apos;re collecting Semester 3 CIE 2 papers and any Semester 3
            notes. Send them to{" "}
            <a
              href="mailto:vittalmukunda.im24@rvce.edu.in?subject=Study%20material%20for%20the%20IEM%20website"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-light"
            >
              vittalmukunda.im24@rvce.edu.in
            </a>{" "}
            and they&apos;ll show up here once uploaded.
          </p>
          <p className="mt-4 text-sm">
            <Link
              href="/resources/study-material"
              className="font-semibold text-primary hover:text-accent hover:underline"
            >
              Browse all study material &rarr;
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
