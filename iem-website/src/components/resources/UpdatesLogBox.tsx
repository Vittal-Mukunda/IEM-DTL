import Link from "next/link";
import { studyUpdates } from "@/lib/updates";
import { formatUpdateDate } from "./UpdateParts";

/**
 * "What's new" card for the header of the Study Material & Notes page, in the
 * site's sketchbook style (paper card, ink border, dashed dividers, mono
 * kicker). Sized at about 85% of the first design. Shows the last few upload
 * batches; click a batch to see the notes and papers added. Native <details>,
 * so no client JS. Add entries in src/lib/updates.ts.
 */
const PREVIEW_COUNT = 6;

export default function UpdatesLogBox() {
  const recent = studyUpdates.slice(0, PREVIEW_COUNT);
  if (recent.length === 0) return null;
  const hasMore = studyUpdates.length > recent.length;

  return (
    <aside
      aria-labelledby="updates-log-heading"
      className="card-sketch w-full p-4 text-primary"
      // The ink shadow would vanish against the dark header, so use the accent.
      style={{ boxShadow: "4px 4px 0 0 var(--accent)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-accent">
            Fresh uploads
          </p>
          <h2
            id="updates-log-heading"
            className="mt-0.5 text-[1.28rem] font-bold leading-tight text-primary"
          >
            What&apos;s new
          </h2>
        </div>
        <span
          className="tag-sketch shrink-0"
          style={{ fontSize: "0.68rem", padding: "0.2rem 0.7rem" }}
        >
          {formatUpdateDate(recent[0].date)}
        </span>
      </div>

      <div className="mt-2.5 border-t-2 border-dashed border-primary/20">
        {recent.map((update) => (
          <details
            key={update.date}
            className="border-b-2 border-dashed border-primary/20"
          >
            <summary className="res-summary cursor-pointer list-none py-2 [&::-webkit-details-marker]:hidden">
              <svg
                className="res-chevron h-3.5 w-3.5 shrink-0 text-text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
              </svg>
              <span className="w-[3.9rem] shrink-0 font-mono text-[0.64rem] uppercase tracking-wide text-accent">
                {formatUpdateDate(update.date).replace(/ 20\d\d$/, "")}
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.75rem] font-semibold text-primary">
                {update.summary}
              </span>
              <span className="shrink-0 font-mono text-[0.64rem] text-text-muted">
                {update.items.length}
              </span>
            </summary>
            <ul className="mb-2.5 ml-1.5 space-y-1 border-l-2 border-accent/30 pl-3.5">
              {update.items.map((item) => {
                const isPdf = item.href.startsWith("/notes/");
                return (
                  <li key={`${item.href}|${item.title}`}>
                    <Link
                      href={item.href}
                      {...(isPdf ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group/item flex items-baseline gap-2 text-[0.75rem] leading-snug text-gray-700 hover:text-primary"
                    >
                      <span className="shrink-0 font-mono text-[0.64rem] text-accent">
                        S{item.sem}
                      </span>
                      <span className="group-hover/item:underline">
                        {item.course}: {item.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>

      <Link
        href="/resources/updates"
        className="group mt-2.5 inline-block text-[0.85rem] font-semibold text-primary hover:text-accent"
      >
        {hasMore ? "See all updates" : "Open the full log"}
        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
          &rarr;
        </span>
      </Link>
    </aside>
  );
}
