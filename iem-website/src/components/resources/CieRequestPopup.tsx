"use client";

import { useEffect, useRef } from "react";

/**
 * Pop-up on the study-material page asking 3rd-semester students to share
 * scans of their CIE question papers.
 *
 * A native <dialog> opened with showModal(): the browser supplies the focus
 * trap, Escape-to-close and the backdrop. It opens shortly after the page
 * loads, and once closed (any way) it stays closed in this browser for
 * DISMISS_DAYS, so returning students aren't asked on every visit.
 */

const EMAIL = "vittalmukunda.im24@rvce.edu.in";
const REPO_URL = "https://github.com/Vittal-Mukunda/IEM-DTL";
const SUBJECT = "CIE question papers — 3rd semester";

const KEY = "iem:cie-request-dismissed";
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

export default function CieRequestPopup() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || recentlyDismissed()) return;
    const timer = window.setTimeout(() => {
      if (!dialog.open) dialog.showModal();
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby="cie-request-heading"
      onClose={rememberDismissal}
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
          Request · 3rd semester
        </p>
        <h2 id="cie-request-heading" className="mt-1 pr-8 text-xl font-bold text-primary">
          Have your CIE question papers? Please share a scan
        </h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          If you&apos;re in the 3rd semester, we&apos;d be grateful for scans (or
          clear phone photos) of your CIE question papers — both this
          year&apos;s and last year&apos;s. We&apos;ll upload them here so your
          classmates and every batch after you can practise with them. This
          collection is a community effort, and every paper helps.
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
            with the subject and CIE number.
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
            and attach the scans there (
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
  );
}
