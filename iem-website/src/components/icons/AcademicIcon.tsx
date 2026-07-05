import type { SVGProps } from "react";

/**
 * Academic Excellence — graduation cap (mortarboard).
 * Flat monochrome silhouette; inherits color via `fill="currentColor"` and
 * scales with the width/height passed through `props` (e.g. a Tailwind size).
 */
export default function AcademicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V8.5L12 3z" />
    </svg>
  );
}
