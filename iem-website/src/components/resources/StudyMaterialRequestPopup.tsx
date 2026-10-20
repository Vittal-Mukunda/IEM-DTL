"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pop-up on the study-material page asking students to share study material
 * (notes, slides, lab manuals, question banks) for any semester.
 *
 * A native <dialog> opened with showModal(): the browser supplies the focus
 * trap, Escape-to-close and the backdrop. It opens shortly after the page
 * loads, and once closed (any way) it stays closed in this browser for
 * DISMISS_DAYS, so returning students aren't asked on every visit.
 *
 * Whenever the pop-up is closed, a small button in the bottom-right corner
 * reopens it.
 */

const EMAIL = "vittalmukunda.im24@rvce.edu.in";
const REPO_URL = "https://github.com/Vittal-Mukunda/IEM-DTL";
const SUBJECT = "Study material for the IEM website";

const KEY = "iem:study-material-request-dismissed";
const DISMISS_DAYS = 7;
const OPEN_DELAY_MS = 1200;

function recentlyDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 86_400_000;
  } catch {
    return false; // storage blocked: ask once per page load
  }
}

function rememberDismissal() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* storage blocked: nothing to remember */
  }
}

export default function StudyMaterialRequestPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  // Hidden until the first timer decides, so the server render and hydration
  // match and the button doesn't flash before the pop-up opens on its own.
  const [showReopen, setShowReopen] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const dismissed = recentlyDismissed();
    const timer = window.setTimeout(
      () => {
        if (dismissed) setShowReopen(true);
        else if (!dialog.open) dialog.showModal();
      },
      dismissed ? 0 : OPEN_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  const onClosed = () => {
    rememberDismissal();
    setShowReopen(true);
  };

  const close = () => ref.current?.close();

  const reopen = () => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    setShowReopen(false);
    dialog.showModal();
  };

  return (
    <>
      {showReopen && (
        <button
          type="button"
          onClick={reopen}
          aria-haspopup="dialog"
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-lg ring-1 ring-black/5 hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:bottom-6 sm:right-6"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          Share study material
        </button>
      )}
      <dialog
        ref={ref}
        aria-labelledby="material-request-heading"
        onClose={onClosed}
        // A click on the backdrop lands on the <dialog> itself.
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border-t-4 border-accent bg-white p-0 text-left shadow-2xl backdrop:bg-black/50"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-primary/5 hover:text-primary"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Request · All semesters
          </p>
          <h2 id="material-request-heading" className="mt-1 pr-8 text-xl font-bold text-primary">
            Have good study material? Please share it
          </h2>
          <p className="mt-3 leading-relaxed text-gray-700">
            Thank you to everyone who sent in their CIE papers. Next,
            we&apos;re collecting study material for every
            semester: class notes (typed, or clear phone photos of handwritten
            ones), lecture slides, lab manuals, assignments and question banks.
            We&apos;ll upload them here so your classmates and every batch after
            you can use them. This collection is a community effort, and every
            file helps.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-gray-700 [overflow-wrap:break-word]">
            <li>
              <span className="font-semibold text-primary">Email:</span> send them
              to{" "}
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}`}
                className="font-medium text-primary underline underline-offset-2 hover:text-primary-light"
              >
                {EMAIL}
              </a>{" "}
              with the course name and semester.
            </li>
            <li>
              <span className="font-semibold text-primary">GitHub:</span> or{" "}
              <a
                href={`${REPO_URL}/issues/new?title=${encodeURIComponent(SUBJECT)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary-light"
              >
                open a request on this website&apos;s GitHub
              </a>{" "}
              and attach the files there (
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                github.com/Vittal-Mukunda/IEM-DTL
              </a>
              ).
            </li>
          </ul>

          <p className="mt-4 text-sm font-medium text-primary">
            Thank you to everyone who sends one — it really helps.
          </p>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
            >
              Maybe later
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
