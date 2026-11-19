import Link from "next/link";
import { studyUpdates } from "@/lib/updates";

/**
 * Small "recently added" log at the top of the study-material page: the newest
 * few items, one line each, with a link to the full log. Add entries in
 * src/lib/updates.ts.
 */
const MAX_ROWS = 5;

/** "2026-11-19" -> "19 Nov". Fixed locale and UTC so server and client agree. */
function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export default function LatestUpdates() {
  const rows = studyUpdates
    .flatMap((u) => u.items.map((item) => ({ date: u.date, item })))
    .slice(0, MAX_ROWS);
  if (rows.length === 0) return null;
  const total = studyUpdates.reduce((n, u) => n + u.items.length, 0);

  return (
    <section
      aria-labelledby="recently-added-heading"
      className="mb-8 rounded-lg border border-primary/10 bg-surface px-4 py-3"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id="recently-added-heading"
          className="text-xs font-semibold uppercase tracking-wider text-text-muted"
        >
          Recently added
        </h2>
        <Link
          href="/resources/updates"
          className="text-xs font-medium text-primary hover:text-accent hover:underline"
        >
          Full log ({total}) &rarr;
        </Link>
      </div>
      <ul className="mt-2 space-y-1">
        {rows.map(({ date, item }) => {
          const isPdf = item.href.startsWith("/notes/");
          return (
            <li key={`${date}|${item.href}|${item.title}`}>
              <Link
                href={item.href}
                {...(isPdf ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-baseline gap-2 text-sm text-gray-700 hover:text-primary"
              >
                <time
                  dateTime={date}
                  className="w-12 shrink-0 text-xs tabular-nums text-text-muted"
                >
                  {shortDate(date)}
                </time>
                <span className="shrink-0 text-xs font-medium text-text-muted">
                  Sem {item.sem}
                </span>
                <span className="min-w-0 truncate">
                  {item.course}: {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
