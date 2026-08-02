"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Newsletter } from "@/lib/data";

/**
 * Client boundary for the book reader. The reader (pdf.js + react-pageflip) is
 * browser-only, so it's loaded with `ssr: false` — never evaluated on the
 * server, and code-split into its own chunk.
 *
 * That chunk is by far the heaviest thing the site ships (~100 kB compressed),
 * and the reader sits well down the About page, so the import is held back
 * until the reader is actually being approached. `next/dynamic` starts
 * fetching as soon as the component renders, so gating the *render* on an
 * IntersectionObserver — not just the PDF rasterisation inside NewsletterBook —
 * is what keeps the chunk off the initial load.
 */
const NewsletterBook = dynamic(
  () => import("@/components/about/NewsletterBook"),
  { ssr: false, loading: () => <ReaderLoading /> },
);

/* Holds the reader's height before anything is fetched. Deliberately not a
   spinner: nothing is in flight yet, and an off-screen element must not sit
   there animating. */
function ReaderIdle() {
  return <div className="min-h-[420px] bg-surface" aria-hidden="true" />;
}

function ReaderLoading() {
  return (
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
  );
}

export default function NewsletterReader({ item }: { item: Newsletter }) {
  const ref = useRef<HTMLDivElement>(null);
  const [approached, setApproached] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Enough lead time for the chunk to arrive before the reader is on
    // screen, but short enough that it stays unfetched for a visitor sitting
    // at the top of the page — the reader is only ~2 screens down, so a wide
    // margin would defeat the point.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setApproached(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {approached ? <NewsletterBook item={item} /> : <ReaderIdle />}
    </div>
  );
}
