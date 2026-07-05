"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import type { Newsletter } from "@/lib/data";
import NewsletterFrame from "@/components/about/NewsletterFrame";

// Same-origin worker (copied into public/pdfjs) — keeps PDF parsing off the
// main thread and satisfies the site's `worker-src 'self'` CSP.
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

/* react-pageflip ships strict prop types (every flip setting required) even
   though StPageFlip fills defaults. Re-type the parts we use as optional. */
interface FlipController {
  flipNext: () => void;
  flipPrev: () => void;
  turnToPage: (page: number) => void;
  getPageCount: () => number;
}
interface FlipBookRef {
  pageFlip: () => FlipController | undefined;
}
interface FlipEvent {
  data: number;
}
interface FlipBookProps {
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height: number;
  size?: "fixed" | "stretch";
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  drawShadow?: boolean;
  flippingTime?: number;
  usePortrait?: boolean;
  maxShadowOpacity?: number;
  showCover?: boolean;
  mobileScrollSupport?: boolean;
  showPageCorners?: boolean;
  startPage?: number;
  onFlip?: (e: FlipEvent) => void;
  onChangeOrientation?: (e: { data: string }) => void;
  children: ReactNode;
}
const FlipBook = HTMLFlipBook as unknown as React.ForwardRefExoticComponent<
  FlipBookProps & React.RefAttributes<FlipBookRef>
>;

type Status = "loading" | "ready" | "error";

/**
 * Book-style newsletter reader. Renders every page of the PDF to an image with
 * pdf.js, then presents them in a page-turning flip book (drag a corner, click
 * the edges, use the arrow buttons or the keyboard). The whole edition is
 * available at once — flip through it like a printed magazine.
 *
 * Rendering starts lazily (only when the reader scrolls into view) so a large
 * PDF never blocks the rest of the page. If pdf.js can't render the file, it
 * falls back to the scrollable <iframe> viewer (NewsletterFrame), which itself
 * degrades to open/download links.
 */
export default function NewsletterBook({ item }: { item: Newsletter }) {
  const [status, setStatus] = useState<Status>("loading");
  const [pages, setPages] = useState<string[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  // Page aspect ratio (height / width) — defaults to A4 portrait until page 1.
  const [aspect, setAspect] = useState(1.414);
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState<"portrait" | "landscape">(() =>
    typeof window !== "undefined" && window.innerWidth < 640
      ? "portrait"
      : "landscape",
  );

  const wrapRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<FlipBookRef>(null);
  const started = useRef(false);

  // Render the PDF to page images once, off the initial paint.
  const renderPdf = useCallback(async () => {
    setStatus("loading");
    try {
      const task = pdfjsLib.getDocument({
        url: item.file,
        isEvalSupported: false,
      });
      const pdf = await task.promise;
      setProgress({ done: 0, total: pdf.numPages });

      const targetWidth = window.innerWidth < 640 ? 820 : 1200;
      const rendered: string[] = [];
      for (let n = 1; n <= pdf.numPages; n += 1) {
        const page = await pdf.getPage(n);
        const base = page.getViewport({ scale: 1 });
        if (n === 1) setAspect(base.height / base.width);
        const viewport = page.getViewport({ scale: targetWidth / base.width });

        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context unavailable");

        await page.render({ canvasContext: ctx, viewport }).promise;
        rendered.push(canvas.toDataURL("image/jpeg", 0.82));
        setProgress({ done: n, total: pdf.numPages });
        // Yield periodically so progress paints and the tab stays responsive on
        // long PDFs, without a per-page timeout that background-tab throttling
        // would stretch out.
        if (n % 4 === 0) await new Promise((r) => setTimeout(r, 0));
      }
      setPages(rendered);
      setStatus("ready");
    } catch (err) {
      console.error("Newsletter book failed to render", err);
      setStatus("error");
    }
  }, [item.file]);

  // Kick off rendering only when the reader is near/in the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          started.current = true;
          io.disconnect();
          void renderPdf();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [renderPdf]);

  const flipPrev = useCallback(() => bookRef.current?.pageFlip()?.flipPrev(), []);
  const flipNext = useCallback(() => bookRef.current?.pageFlip()?.flipNext(), []);

  // Arrow-key navigation while the reader is focused/hovered.
  useEffect(() => {
    if (status !== "ready") return;
    const onKey = (e: KeyboardEvent) => {
      if (!wrapRef.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") flipPrev();
      if (e.key === "ArrowRight") flipNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, flipPrev, flipNext]);

  if (status === "error") {
    // Graceful fallback — the reliable scroll viewer (with its own
    // open/download fallback) so the newsletter is always reachable.
    return <NewsletterFrame item={item} />;
  }

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const total = pages.length;
  // In a two-page spread each turn advances by a full spread, so show the pair
  // of visible pages ("Pages 4–5") rather than a count that jumps by two. The
  // cover, the back page, and portrait (mobile) mode show a single page.
  const showsSingle =
    mode === "portrait" || current === 0 || current + 2 > total;
  const pageLabel =
    total === 0
      ? ""
      : showsSingle
        ? `Page ${Math.min(current + 1, total)} of ${total}`
        : `Pages ${current + 1}–${current + 2} of ${total}`;

  return (
    <div ref={wrapRef} className="bg-surface px-3 py-5 sm:px-6 sm:py-8">
      {status === "loading" && (
        <div
          className="mx-auto flex min-h-[420px] max-w-md flex-col items-center justify-center gap-4 text-center"
          role="status"
          aria-live="polite"
        >
          <span
            className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold text-primary">Preparing the reader</p>
            <p className="mt-1 text-sm text-text-muted">
              {progress.total > 0
                ? `Rendering page ${progress.done} of ${progress.total}`
                : "Loading the newsletter…"}
            </p>
          </div>
        </div>
      )}

      {status === "ready" && total > 0 && (
        <div className="flex flex-col items-center">
          <div
            className="w-full max-w-[1180px]"
            aria-roledescription="Newsletter book reader"
          >
            <FlipBook
              className="mx-auto"
              width={520}
              height={Math.round(520 * aspect)}
              size="stretch"
              minWidth={280}
              maxWidth={590}
              minHeight={Math.round(280 * aspect)}
              maxHeight={Math.round(590 * aspect)}
              drawShadow={!reduceMotion}
              flippingTime={reduceMotion ? 200 : 700}
              maxShadowOpacity={0.4}
              showCover
              usePortrait
              mobileScrollSupport
              showPageCorners
              startPage={0}
              onFlip={(e) => setCurrent(e.data)}
              onChangeOrientation={(e) =>
                setMode(e.data === "portrait" ? "portrait" : "landscape")
              }
              ref={bookRef}
            >
              {pages.map((src, i) => (
                <div
                  key={i}
                  className="overflow-hidden bg-white"
                  aria-hidden="true"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                  />
                </div>
              ))}
            </FlipBook>
          </div>

          {/* Controls */}
          <div className="mt-5 flex w-full max-w-[1180px] items-center justify-center gap-4">
            <button
              type="button"
              onClick={flipPrev}
              disabled={current <= 0}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-primary shadow-sm transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <p
              className="min-w-[128px] text-center text-sm font-medium text-text-muted"
              aria-live="polite"
            >
              {pageLabel}
            </p>
            <button
              type="button"
              onClick={flipNext}
              disabled={current >= total - 1}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-primary shadow-sm transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-text-muted">
            Drag a page corner or use the arrows to turn pages.{" "}
            <a
              href={item.file}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-light hover:underline"
            >
              Open in a new tab
            </a>{" "}
            &middot;{" "}
            <a
              href={item.file}
              download
              className="font-medium text-accent hover:underline"
            >
              Download PDF
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
