"use client";

import dynamic from "next/dynamic";

/**
 * The builder is client-only.
 *
 * Not for convenience: the résumé lives in `localStorage`, which does not exist
 * on the server, so a server render would necessarily disagree with the first
 * client render. Rendering it only on the client removes the mismatch entirely
 * and lets the state initialise straight from storage instead of arriving one
 * render late.
 *
 * The route itself still prerenders to static HTML — only this island is
 * deferred, which is the same shape the GPA calculator uses.
 */
const ResumeBuilder = dynamic(() => import("@/resume/editor/ResumeBuilder"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[50vh] place-items-center rounded-2xl bg-surface/60 text-text-muted">
      Loading the builder…
    </div>
  ),
});

export default function BuilderClient() {
  return <ResumeBuilder />;
}
