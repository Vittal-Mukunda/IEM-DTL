"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Measured once on enter and reused for the whole hover. Calling
  // getBoundingClientRect() inside onMouseMove forced a synchronous layout on
  // every pointer event, which is the one thing a tilt effect must not do.
  const rect = useRef<DOMRect | null>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), {
    stiffness: 200,
    damping: 22,
  });

  function onMouseEnter() {
    if (reduced) return;
    rect.current = ref.current?.getBoundingClientRect() ?? null;
  }

  function onMouseMove(e: React.MouseEvent) {
    const r = rect.current;
    if (reduced || !r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  function onMouseLeave() {
    rect.current = null;
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900 }
      }
    >
      {children}
    </motion.div>
  );
}
