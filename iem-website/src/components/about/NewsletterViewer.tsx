import type { Newsletter } from "@/lib/data";
import NewsletterReader from "@/components/about/NewsletterReader";

/**
 * Newsletter reader for the About page.
 *
 * The most recent edition opens as a page-turning book (see NewsletterReader →
 * NewsletterBook): the whole edition is rendered to pages you flip through in
 * place, like a printed magazine. It degrades gracefully — to a scrollable PDF
 * frame, then to open/download links — if a browser can't render it.
 *
 * Older editions are offered as download links (the `download` attribute saves
 * the PDF rather than embedding it).
 *
 * With no newsletters configured (see `newsletters` in lib/data.ts) it renders
 * an intentional "coming soon" placeholder instead of an empty frame.
 */
export default function NewsletterViewer({ items }: { items: Newsletter[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-primary/20 bg-surface p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <p className="font-semibold text-primary">Newsletters coming soon</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
          Department newsletters will be published here. You&apos;ll be able to
          read each edition inline — just scroll through it on the page, no
          download needed.
        </p>
      </div>
    );
  }

  const [latest, ...past] = items;

  return (
    <div>
      {/* Latest edition — embedded for in-page reading */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-primary">
              {latest.title}
            </p>
            <p className="text-xs text-text-muted">
              {latest.edition ? `${latest.edition} · ` : ""}Latest edition
            </p>
          </div>
          <a
            href={latest.file}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-medium text-primary-light hover:underline"
          >
            Open full screen &rarr;
          </a>
        </div>
        <NewsletterReader item={latest} />
      </div>

      {/* Past editions — download links */}
      {past.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Past editions
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((n) => (
              <a
                key={n.file}
                href={n.file}
                download
                className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-xs font-bold text-primary">
                  PDF
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary">
                    {n.edition ?? n.title}
                  </p>
                  <p className="text-xs font-medium text-accent">
                    Download ↓
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
