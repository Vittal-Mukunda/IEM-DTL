import Link from "next/link";
import { studyUpdates } from "@/lib/updates";
import { UpdateBatch } from "./UpdateParts";

/**
 * "Latest additions" panel at the top of the study-material page: the newest
 * upload batches, with a link to the full history. Add entries in
 * src/lib/updates.ts.
 */
export default function LatestUpdates({ batches = 2 }: { batches?: number }) {
  const latest = studyUpdates.slice(0, batches);
  if (latest.length === 0) return null;
  return (
    <section aria-labelledby="latest-additions-heading" className="mb-10">
      <div className="rounded-2xl border border-accent/30 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="latest-additions-heading"
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <span className="rounded bg-accent px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
              New
            </span>
            Latest additions
          </h2>
          <Link
            href="/resources/updates"
            className="text-sm font-semibold text-primary hover:text-accent hover:underline"
          >
            See everything that&apos;s new &rarr;
          </Link>
        </div>
        <div className="mt-5 space-y-6">
          {latest.map((update) => (
            <UpdateBatch key={update.date} update={update} />
          ))}
        </div>
      </div>
    </section>
  );
}
