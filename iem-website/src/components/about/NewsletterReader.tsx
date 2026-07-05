"use client";

import dynamic from "next/dynamic";
import type { Newsletter } from "@/lib/data";

/**
 * Client boundary for the book reader. The reader (pdf.js + react-pageflip) is
 * browser-only, so it's loaded with `ssr: false` — never evaluated on the
 * server, and code-split into its own chunk fetched when the About page runs.
 */
const NewsletterBook = dynamic(
  () => import("@/components/about/NewsletterBook"),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[420px] items-center justify-center bg-surface"
        role="status"
        aria-label="Loading the newsletter reader"
      >
        <span
          className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary"
          aria-hidden="true"
        />
      </div>
    ),
  },
);

export default function NewsletterReader({ item }: { item: Newsletter }) {
  return <NewsletterBook item={item} />;
}
