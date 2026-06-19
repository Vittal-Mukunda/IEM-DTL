"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

interface Tilt3DProps {
  children: React.ReactNode;
  /** classes on the OUTER element that owns the perspective */
  className?: string;
  /** classes on the INNER tilting stage (preserve-3d lives here) */
  innerClassName?: string;
  /** perspective distance in px — smaller = stronger depth */
  perspective?: number;
  /** max tilt in degrees */
  max?: number;
  /** inline style merged onto the inner stage */
  innerStyle?: React.CSSProperties;
}

/**
 * Pointer-driven 3D tilt scene. The inner stage carries `preserve-3d`, so any
 * child using `translateZ(...)` floats at its own depth and parallaxes as the
 * stage tilts toward the cursor.
 */
export default function Tilt3D({
  children,
  className,
  innerClassName,
  perspective = 1200,
  max = 10,
  innerStyle,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  function onMouseMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }
  function onMouseLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  // preserve-3d is applied via className (NOT motion's style object): keeping a
  // non-transform CSS property out of `style` lets motion bind the rotateX/Y
  // MotionValues reactively instead of committing a one-shot static transform.
  return (
    <div className={className} style={{ perspective }}>
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={`[transform-style:preserve-3d] ${innerClassName ?? ""}`}
        style={
          reduced
            ? innerStyle
            : { rotateX, rotateY, transformPerspective: perspective, ...innerStyle }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
