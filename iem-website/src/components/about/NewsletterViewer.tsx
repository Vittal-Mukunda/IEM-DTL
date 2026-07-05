"use client";

import { useState } from "react";
import type { Newsletter } from "@/lib/data";

/**
 * Inline newsletter reader.
 *
 * Each newsletter PDF is embedded in an <iframe> so visitors read it right on
 * the page — scrolling through it in place — rather than downloading it or
 * opening a new tab. The `#toolbar=0&navpanes=0` hints ask the browser's PDF
 * viewer to hide its download/print chrome for a cleaner in-page read.
 *
 * With no newsletters configured (see `newsletters` in lib/data.ts) it renders
 * an intentional "coming soon" placeholder instead of an empty frame.
 */
export default function NewsletterViewer({ items }: { items: Newsletter[] }) {
  const [active, setActive] = useState(0);

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

  const current = items[Math.min(active, items.length - 1)];

  return (
    <div>
      {items.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {items.map((n, i) => (
            <button
              key={n.file}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                i === active
                  ? "border-transparent bg-primary text-white"
                  : "border-gray-200 text-text-muted hover:text-primary"
              }`}
            >
              {n.edition ?? n.title}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-primary">
              {current.title}
            </p>
            {current.edition && (
              <p className="text-xs text-text-muted">{current.edition}</p>
            )}
          </div>
          <a
            href={current.file}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-medium text-primary-light hover:underline"
          >
            Open full screen &rarr;
          </a>
        </div>
        <iframe
          key={current.file}
          src={`${current.file}#toolbar=0&navpanes=0&view=FitH`}
          title={current.title}
          className="h-[70vh] max-h-[900px] min-h-[480px] w-full bg-surface"
        />
      </div>
    </div>
  );
}
