"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { departmentHistory } from "@/lib/data";

export default function HistoryTimeline() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(departmentHistory.length - 1);
  const [dir, setDir] = useState(1);

  const last = departmentHistory.length - 1;
  const go = (next: number) => {
    setDir(next > active ? 1 : -1);
    setActive(Math.max(0, Math.min(last, next)));
  };

  const item = departmentHistory[active];
  // progress along the rail, 0..100
  const progress = (active / last) * 100;

  return (
    <div className="rounded-2xl border border-gray-200 bg-surface/60 p-5 sm:p-7">
      {/* Rail */}
      <div className="relative overflow-x-auto pb-2">
        <div className="relative min-w-[560px] px-2">
          {/* base track */}
          <div className="absolute left-2 right-2 top-[10px] h-0.5 bg-gray-200" />
          {/* animated fill */}
          <motion.div
            className="absolute left-2 top-[10px] h-0.5 bg-accent"
            initial={false}
            animate={{ width: `calc(${progress}% )` }}
            transition={{ duration: reduced ? 0 : 0.5, ease: [0.21, 0.65, 0.32, 0.95] }}
            style={{ maxWidth: "calc(100% - 1rem)" }}
          />

          <ol className="relative flex justify-between">
            {departmentHistory.map((h, i) => {
              const isActive = i === active;
              const done = i <= active;
              return (
                <li key={h.year} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`${h.year}: ${h.title}`}
                    className="group flex flex-col items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
                  >
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      {isActive && !reduced && (
                        <motion.span
                          layoutId="history-halo"
                          className="absolute inset-0 rounded-full bg-accent/25"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span
                        className={`h-3 w-3 rounded-full border-2 transition-colors duration-200 ${
                          isActive
                            ? "border-accent bg-accent"
                            : done
                              ? "border-accent bg-accent/40"
                              : "border-gray-300 bg-white group-hover:border-accent/60"
                        }`}
                      />
                    </span>
                    <span
                      className={`mt-2 text-xs font-semibold tracking-wide transition-colors ${
                        isActive ? "text-accent" : "text-text-muted group-hover:text-primary"
                      }`}
                    >
                      {h.year}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Detail panel — remounts on year change to replay the entrance */}
      <div className="relative mt-6 min-h-[120px]">
        <motion.div
          key={active}
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.21, 0.65, 0.32, 0.95] }}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-accent leading-none">
              {item.year}
            </span>
            <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
          </div>
          <p className="mt-3 max-w-2xl text-gray-700 leading-relaxed">
            {item.text}
          </p>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Earlier
        </button>

        <span className="text-xs text-text-muted">
          {active + 1} / {departmentHistory.length}
        </span>

        <button
          type="button"
          onClick={() => go(active + 1)}
          disabled={active === last}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Later
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
