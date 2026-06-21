"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Lab photo with a graceful fallback.
 *
 * The lab photos ship locally in /public, so they go through next/image
 * (AVIF/WebP, responsive sizes). If a file ever fails to load, we swap to an
 * on-theme sketch placeholder so the card always looks intentional rather than
 * rendering the browser's broken-image glyph.
 *
 * `className` sizes the frame (e.g. "w-full h-40"); the image fills it.
 */
export default function LabImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${className ?? ""} flex items-center justify-center bg-surface-dark`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-10 h-10 text-text-muted/50"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18.75V5.25A2.25 2.25 0 014.5 3h15a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0119.5 21h-15A2.25 2.25 0 012.25 18.75z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onError={() => setFailed(true)}
        className="object-cover"
      />
    </div>
  );
}
