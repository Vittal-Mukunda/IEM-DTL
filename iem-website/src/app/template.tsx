// A template (unlike a layout) is given a fresh key and remounts on every
// navigation — so this wrapper fades each incoming page in. App Router
// unmounts the outgoing page immediately, so this is an enter fade (the
// most reliable cross-page transition without canary View Transitions).
//
// The fade is a plain CSS animation (see .page-enter in globals.css) rather
// than a motion component: the effect is a single opacity keyframe, and doing
// it in CSS keeps this a Server Component — otherwise every route in the app
// would pull the motion runtime into its client bundle just to cross-fade.
// Reduced-motion users get no animation; the CSS drops it.

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
