import Link from "next/link";
import { studyUpdates } from "@/lib/updates";
import { formatUpdateDate } from "./UpdateParts";

/**
 * "What's new" card for the Resources page header, in the site's sketchbook
 * style (paper card, ink border, dashed dividers, mono kicker). Shows the last
 * few upload batches; click a batch to see the notes and papers added. Native
 * <details>, so no client JS. Add entries in src/lib/updates.ts.
 */
const PREVIEW_COUNT = 6;

export default function UpdatesLogBox() {
  const recent = studyUpdates.slice(0, PREVIEW_COUNT);
  if (recent.length === 0) return null;
  const hasMore = studyUpdates.length > recent.length;

  return (
    <aside
      aria-labelledby="updates-log-heading"
      className="card-sketch w-full p-5 text-primary"
      // The ink shadow would vanish against the dark header, so use the accent.
      style={{ boxShadow: "5px 5px 0 0 var(--accent)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-accent">
            Fresh uploads
          </p>
          <h2
            id="updates-log-heading"
            className="mt-0.5 text-2xl font-bold text-primary"
          >
            What&apos;s new
          </h2>
        </div>
        <span className="tag-sketch shrink-0">
          {formatUpdateDate(recent[0].date)}
        </span>
      </div>

      <div className="mt-3 border-t-2 border-dashed border-primary/20">
        {recent.map((update) => (
          <details
            key={update.date}
            className="border-b-2 border-dashed border-primary/20"
          >
            <summary className="res-summary cursor-pointer list-none py-2.5 [&::-webkit-details-marker]:hidden">
              <svg
                className="res-chevron h-4 w-4 shrink-0 text-text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
              </svg>
              <span className="w-[4.6rem] shrink-0 font-mono text-xs uppercase tracking-wide text-accent">
                {formatUpdateDate(update.date).replace(/ 20\d\d$/, "")}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-primary">
                {update.summary}
              </span>
              <span className="shrink-0 font-mono text-xs text-text-muted">
                {update.items.length}
              </span>
            </summary>
            <ul className="mb-3 ml-2 space-y-1.5 border-l-2 border-accent/30 pl-4">
              {update.items.map((item) => {
                const isPdf = item.href.startsWith("/notes/");
                return (
                  <li key={`${item.href}|${item.title}`}>
                    <Link
                      href={item.href}
                      {...(isPdf ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group/item flex items-baseline gap-2 text-sm leading-snug text-gray-700 hover:text-primary"
                    >
                      <span className="shrink-0 font-mono text-xs text-accent">
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
        className="group mt-3 inline-block font-semibold text-primary hover:text-accent"
      >
        {hasMore ? "See all updates" : "Open the full log"}
        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
          &rarr;
        </span>
      </Link>
    </aside>
  );
}
