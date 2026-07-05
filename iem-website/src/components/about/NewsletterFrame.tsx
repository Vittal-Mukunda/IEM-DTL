"use client";

import { useState } from "react";
import type { Newsletter } from "@/lib/data";

/**
 * Embeds a single newsletter PDF for in-page reading, with graceful
 * degradation:
 *
 *  - The PDF renders inline in an <iframe> (the `#toolbar=0…` hints ask the
 *    browser's PDF viewer to hide its chrome).
 *  - If the frame errors, or on devices that won't render a PDF inline, a
 *    friendly fallback panel with "open in a new tab" and "download" actions
 *    is shown instead — the reader is never left staring at a blank frame.
 *  - A persistent helper line under the frame offers the same actions even
 *    when the embed appears to work, since some mobile browsers silently
 *    refuse to paint PDFs inside frames.
 */
export default function NewsletterFrame({ item }: { item: Newsletter }) {
  const [failed, setFailed] = useState(false);

  const actions = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <a
        href={item.file}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium text-primary-light hover:underline"
      >
        Open in a new tab &rarr;
      </a>
      <a
        href={item.file}
        download
        className="text-xs font-medium text-accent hover:underline"
      >
        Download PDF &darr;
      </a>
    </div>
  );

  if (failed) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center gap-3 bg-surface px-6 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-primary">
            This newsletter can&apos;t be displayed here
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-text-muted">
            Your browser couldn&apos;t show the PDF inline. You can still open
            or download it below.
          </p>
        </div>
        {actions}
      </div>
    );
  }

  return (
    <div>
      <iframe
        src={`${item.file}#toolbar=0&navpanes=0&view=FitH`}
        title={item.title}
        onError={() => setFailed(true)}
        className="h-[70vh] max-h-[900px] min-h-[480px] w-full bg-surface"
      />
      <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-5 py-3">
        <p className="text-xs text-text-muted">
          Newsletter not showing above?
        </p>
        {actions}
      </div>
    </div>
  );
}
