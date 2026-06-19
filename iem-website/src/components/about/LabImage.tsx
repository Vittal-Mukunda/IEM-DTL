"use client";

import { useState } from "react";

/**
 * Lab photo with a graceful fallback.
 *
 * Several lab photos are hot-linked from the official RVCE site
 * (rvce.edu.in), which is intermittently slow / blocks hot-linking
 * (403 / 504). A raw <img> would render the browser's broken-image
 * glyph in those cases. Instead, on error we swap to an on-theme
 * sketch placeholder so the card always looks intentional.
 *
 * Stays a plain <img> (not next/image) so remote hosts don't need to
 * be allow-listed in next.config's remotePatterns.
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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
