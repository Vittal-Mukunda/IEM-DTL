"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ResourceItem } from "@/lib/data";
import { FileLink } from "./ResourceParts";

/**
 * Hidden study material.
 *
 * Clicking the word "Contact" in the footer toggles an "extras" flag that
 * reveals every resource marked `hidden: true` in `data.ts`. The flag lives in
 * this browser's localStorage, so it survives reloads and is shared by every
 * tab, and nothing is stored on a server.
 *
 * This hides the *link*, not the file: anything under `public/` is still
 * reachable by anyone who has its exact URL. Don't put anything here that has
 * to stay private.
 */

const KEY = "iem:extras";
const EVENT = "iem:extras-change";

// Fallback for browsers where localStorage throws (private windows, blocked
// site data): the flag then lasts until the page is reloaded.
let memoryFlag = false;

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return memoryFlag;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function useExtrasUnlocked(): boolean {
  // Server and first client render both see `false`, so hidden items are never
  // in the prerendered HTML and hydration always matches.
  return useSyncExternalStore(subscribe, read, () => false);
}

function setExtras(next: boolean) {
  memoryFlag = next;
  try {
    if (next) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    /* memoryFlag already holds it */
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * The footer's "Contact" heading. It looks like plain text; clicking it
 * unlocks (and, clicked again, re-hides) the extra material, with a brief
 * toast so the click visibly did something even when the files are far above
 * the footer.
 */
export function ContactToggle() {
  const unlocked = useExtrasUnlocked();
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function onClick() {
    const next = !unlocked;
    setExtras(next);
    setToast(next ? "Extra material unlocked" : "Extra material hidden");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2500);
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="cursor-default text-left"
      >
        Contact
      </button>
      <span role="status" aria-live="polite">
        {toast && (
          <span className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg">
            {toast}
          </span>
        )}
      </span>
    </>
  );
}

/** Hidden `<li>` file links for a subject folder; empty until unlocked. */
export function ExtraItems({ items }: { items: ResourceItem[] }) {
  if (!useExtrasUnlocked()) return null;
  return (
    <>
      {items.map((item) => (
        <li key={item.file}>
          <FileLink item={item} />
        </li>
      ))}
    </>
  );
}

/**
 * A count that includes the hidden items once unlocked. With `label` it
 * renders "N item(s)" for a folder header, otherwise just the number.
 */
export function ExtraCount({
  base,
  extra,
  label = false,
}: {
  base: number;
  extra: number;
  label?: boolean;
}) {
  const n = base + (useExtrasUnlocked() ? extra : 0);
  return <>{label ? `${n} item${n > 1 ? "s" : ""}` : n}</>;
}
