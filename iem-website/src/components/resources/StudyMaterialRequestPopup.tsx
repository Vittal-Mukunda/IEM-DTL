"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pop-up on the study-material page: announces that the Sem 3 and Sem 5 CIE 2
 * papers are up (with a one-off burst of confetti) and asks students to send
 * in any notes they have.
 *
 * A native <dialog> opened with showModal(): the browser supplies the focus
 * trap, Escape-to-close and the backdrop. It opens on its own shortly after
 * the page loads, at most once per SHOW_EVERY_DAYS in this browser (the time
 * is stored when it opens, so reloading doesn't bring it back). The confetti
 * only fires on that automatic opening, never when the button reopens it.
 *
 * Whenever the pop-up is closed, a small button in the bottom-right corner
 * reopens it.
 */

const EMAIL = "vittalmukunda.im24@rvce.edu.in";
const REPO_URL = "https://github.com/Vittal-Mukunda/IEM-DTL";
const SUBJECT = "Study material for the IEM website";

// Bump the suffix when the request changes so people who closed the previous
// pop-up see the new one.
const KEY = "iem:study-material-popup-shown-cie2-sem3-sem5";
const SHOW_EVERY_DAYS = 7;
const OPEN_DELAY_MS = 1200;

function recentlyShown(): boolean {
  try {
    const at = Number(localStorage.getItem(KEY));
    return at > 0 && Date.now() - at < SHOW_EVERY_DAYS * 86_400_000;
  } catch {
    return false; // storage blocked: ask once per page load
  }
}

function rememberShown() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* storage blocked: nothing to remember */
  }
}

const CONFETTI_COLORS = ["#c0392b", "#f4d03f", "#2e86c1", "#27ae60", "#8e44ad", "#e67e22"];

/** One burst of confetti on a full-screen canvas; the canvas hides itself after. */
function launchConfetti(canvas: HTMLCanvasElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.display = "block";

  const pieces = Array.from({ length: 160 }, (_, i) => {
    const fromLeft = i % 2 === 0;
    const angle = (fromLeft ? -60 : -120) * (Math.PI / 180) + (Math.random() - 0.5) * 0.9;
    const speed = 11 + Math.random() * 11;
    return {
      x: fromLeft ? 0 : w,
      y: h * 0.85,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.4,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    };
  });

  const start = performance.now();
  const DURATION = 4200;
  const frame = (now: number) => {
    const t = now - start;
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = t > DURATION - 800 ? Math.max(0, (DURATION - t) / 800) : 1;
    for (const p of pieces) {
      p.vy += 0.32;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    if (t < DURATION) requestAnimationFrame(frame);
    else {
      ctx.clearRect(0, 0, w, h);
      canvas.style.display = "none";
    }
  };
  requestAnimationFrame(frame);
}

export default function StudyMaterialRequestPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  // Hidden until the first timer decides, so the server render and hydration
  // match and the button doesn't flash before the pop-up opens on its own.
  const [showReopen, setShowReopen] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const seenRecently = recentlyShown();
    const timer = window.setTimeout(
      () => {
        if (seenRecently) setShowReopen(true);
        else if (!dialog.open) {
          rememberShown();
          dialog.showModal();
          if (confettiRef.current) launchConfetti(confettiRef.current);
        }
      },
      seenRecently ? 0 : OPEN_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  const onClosed = () => setShowReopen(true);

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
        <canvas
          ref={confettiRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 hidden h-screen w-screen"
        />
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
            Good news &middot; Semesters 3 &amp; 5
          </p>
          <h2 id="material-request-heading" className="mt-1 pr-8 text-xl font-bold text-primary">
            🎉 We got the CIE 2 papers for Sem 3 and Sem 5!
          </h2>
          <p className="mt-3 leading-relaxed text-gray-700">
            The <span className="font-semibold">CIE 2 question papers</span> for
            Semester 3 and Semester 5 are now up in the study material. Thank
            you to everyone who sent them in.
          </p>
          <p className="mt-3 leading-relaxed text-gray-700">
            Keep it going: if you have any{" "}
            <span className="font-semibold">notes</span> (typed, or clear photos
            of handwritten ones), lecture slides, assignments or question banks
            for any semester, please send them to us. Every file helps your
            classmates and every batch after you.
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
              with the semester and course name (e.g. &quot;Sem 5 Operations Management notes&quot;).
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
            Thank you to everyone who sends something. It really helps.
          </p>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
