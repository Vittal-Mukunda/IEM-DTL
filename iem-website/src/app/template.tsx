"use client";

// A template (unlike a layout) is given a fresh key and remounts on every
// navigation — so this wrapper fades each incoming page in. App Router
// unmounts the outgoing page immediately, so this is an enter fade (the
// most reliable cross-page transition without canary View Transitions).
// Reduced-motion users get no animation: content is simply shown.

import { motion, useReducedMotion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
