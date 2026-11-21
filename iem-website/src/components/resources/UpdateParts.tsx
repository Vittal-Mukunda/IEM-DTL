import Link from "next/link";
import type { StudyUpdate, UpdateItem } from "@/lib/updates";

/**
 * Shared rendering for the full "What's new" log page (/resources/updates), in
 * the site's sketchbook style. Server components, no state.
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
        className="group flex flex-wrap items-start gap-x-3 gap-y-1 py-2.5"
      >
        <span className="mt-0.5 w-12 shrink-0 font-mono text-xs text-accent">
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
        <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-text-muted">
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
    <section
      aria-label={`Added on ${formatUpdateDate(update.date)}`}
      className="card-sketch p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <time
            dateTime={update.date}
            className="font-mono text-xs uppercase tracking-[0.12em] text-accent"
          >
            {formatUpdateDate(update.date)}
          </time>
          <Heading className="mt-0.5 text-xl font-bold text-primary">
            {update.summary}
          </Heading>
          {update.credit && (
            <p className="mt-0.5 text-[0.7rem] italic text-text-muted">
              {update.credit}
            </p>
          )}
        </div>
        <span className="tag-sketch shrink-0">
          {itemCountLabel(update.items.length)}
        </span>
      </div>
      <ul className="mt-3 divide-y-2 divide-dashed divide-primary/20 border-t-2 border-dashed border-primary/20">
        {update.items.map((item) => (
          <UpdateRow key={`${item.href}|${item.title}`} item={item} />
        ))}
      </ul>
    </section>
  );
}
