import Link from "next/link";
import { studyUpdates } from "@/lib/updates";
import { formatUpdateDate, itemCountLabel } from "./UpdateParts";

/**
 * Compact, scrollable update log for the Resources page header (dark
 * background). Every upload batch is a row; click a row to expand it and see
 * the notes and papers added. Native <details>, so no client JS. Add entries in
 * src/lib/updates.ts.
 */
export default function UpdatesLogBox() {
  if (studyUpdates.length === 0) return null;
  return (
    <aside
      aria-labelledby="updates-log-heading"
      className="w-full rounded-lg border border-white/25 bg-white/5"
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-white/15 px-4 py-2.5">
        <h2
          id="updates-log-heading"
          className="text-xs font-semibold uppercase tracking-wider text-gray-300"
        >
          What&apos;s new
        </h2>
        <Link
          href="/resources/updates"
          className="text-xs text-gray-300 hover:text-white hover:underline"
        >
          Full page &rarr;
        </Link>
      </div>

      <div className="max-h-80 divide-y divide-white/10 overflow-y-auto">
        {studyUpdates.map((update) => (
          <details key={update.date} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/5 [&::-webkit-details-marker]:hidden">
              <svg
                className="h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform group-open:rotate-90"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
              </svg>
              <time
                dateTime={update.date}
                className="w-[5.5rem] shrink-0 text-xs tabular-nums text-gray-300"
              >
                {formatUpdateDate(update.date)}
              </time>
              <span className="min-w-0 flex-1 truncate text-white">
                {update.summary}
              </span>
              <span className="shrink-0 text-xs text-gray-400">
                {update.items.length}
              </span>
            </summary>
            <ul className="space-y-1 px-4 pb-3 pl-[2.1rem]">
              <li className="sr-only">{itemCountLabel(update.items.length)}</li>
              {update.items.map((item) => {
                const isPdf = item.href.startsWith("/notes/");
                return (
                  <li key={`${item.href}|${item.title}`}>
                    <Link
                      href={item.href}
                      {...(isPdf ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="block text-sm text-gray-200 hover:text-white hover:underline"
                    >
                      <span className="mr-2 text-xs font-medium text-gray-400">
                        Sem {item.sem}
                      </span>
                      {item.course}: {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>
    </aside>
  );
}
