import Link from "next/link";
import type { StudyUpdate, UpdateItem } from "@/lib/updates";

/**
 * Shared rendering for the "What's new" log: used by the full page
 * (/resources/updates) and the "Latest additions" panel on the study-material
 * page. Server components, no state.
 */

/** "2026-11-19" -> "19 Nov 2026". Fixed locale and UTC so server and client agree. */
export function formatUpdateDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function itemCountLabel(n: number): string {
  return `${n} new item${n === 1 ? "" : "s"}`;
}

function UpdateRow({ item }: { item: UpdateItem }) {
  const isPdf = item.href.startsWith("/notes/");
  return (
    <li>
      <Link
        href={item.href}
        {...(isPdf ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex flex-wrap items-start gap-x-3 gap-y-1 rounded-lg px-3 py-2.5 transition-colors hover:bg-primary/5"
      >
        <span className="mt-0.5 shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
          Sem {item.sem}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-primary group-hover:underline">
            {item.title}
          </span>
          <span className="block text-sm text-gray-700">{item.course}</span>
          {item.note && (
            <span className="block text-xs text-text-muted">{item.note}</span>
          )}
        </span>
        <span className="shrink-0 rounded border border-primary/20 px-2 py-0.5 text-xs text-text-muted">
          {item.kind}
        </span>
      </Link>
    </li>
  );
}

export function UpdateBatch({
  update,
  headingLevel = "h3",
}: {
  update: StudyUpdate;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <section aria-label={`Added on ${formatUpdateDate(update.date)}`}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-primary/10 pb-2">
        <time dateTime={update.date} className="text-sm font-bold text-accent">
          {formatUpdateDate(update.date)}
        </time>
        <Heading className="font-semibold text-primary">{update.summary}</Heading>
        <span className="ml-auto text-xs text-text-muted">
          {itemCountLabel(update.items.length)}
        </span>
      </div>
      <ul className="mt-2 divide-y divide-primary/5">
        {update.items.map((item) => (
          <UpdateRow key={`${item.href}|${item.title}`} item={item} />
        ))}
      </ul>
    </section>
  );
}
