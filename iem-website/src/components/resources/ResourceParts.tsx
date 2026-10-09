import Link from "next/link";
import type { ResourceItem } from "@/lib/data";

/**
 * Pieces shared by the study-material page (server) and the hidden-material
 * islands in `HiddenExtras.tsx` (client). No hooks here, so both can import it.
 */

export function FileLink({ item }: { item: ResourceItem }) {
  return (
    <Link href={item.file} target="_blank" rel="noopener noreferrer" className="res-file">
      <span className="res-file-name">
        <Icon id="file" className="h-4 w-4 text-text-muted" />
        <span className="res-file-label">{item.label}</span>
      </span>
      {item.size && <span className="res-file-size">{item.size}</span>}
    </Link>
  );
}

/**
 * One reference into {@link IconSprite}.
 *
 * The page draws the same three icons once per document, and at 140 documents
 * restating the path each time cost about 56 kB of markup — paid twice, since
 * the RSC payload carries a copy of everything the HTML already holds. The
 * stroke geometry lives on the sprite's `<symbol>`s, so each use site is only
 * a class and a reference.
 */
export function Icon({ id, className }: { id: "file" | "folder" | "chevron"; className: string }) {
  return (
    <svg className={`res-icon ${className}`} aria-hidden="true">
      <use href={`#i-${id}`} />
    </svg>
  );
}

/** Defines the three shapes once. Rendered off-screen, above the content. */
export function IconSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <symbol id="i-file" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 3v4a1 1 0 0 0 1 1h4M5 21V5a2 2 0 0 1 2-2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"
        />
      </symbol>
      <symbol id="i-folder" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
        />
      </symbol>
      <symbol id="i-chevron" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
      </symbol>
    </svg>
  );
}
