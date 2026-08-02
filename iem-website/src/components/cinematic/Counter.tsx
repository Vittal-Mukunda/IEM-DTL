"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    const node = ref.current;
    // The tween writes straight to the text node instead of through state:
    // a `setState` per frame would re-render this component (and, on the
    // placements page, four of them side by side) ~60 times a second for a
    // number that no other markup depends on.
    // Reduced motion → duration 0 snaps straight to the value.
    const controls = animate(0, value, {
      duration: reduced ? 0 : 1.6,
      ease: [0.16, 0.72, 0.3, 1],
      onUpdate: (v) => {
        if (node) node.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, reduced, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {`${prefix}${(0).toFixed(decimals)}${suffix}`}
    </span>
  );
}
