"use client";

// ──────────────────────────────────────────────────────────────────
//  "Six worlds. One degree." — IEM RVCE homepage.
//
//  A normal, top-to-bottom scroll narrative. After a hero, six career
//  worlds are told in sequence; each is a full-screen panel that PINS
//  (position: sticky) inside a taller track, so it rests on screen for
//  a stretch of scrolling before releasing to the next — that pin is
//  the deliberate "pause" between careers. Content reveals top-to-bottom
//  (each line enters from above, y:-28 → 0) via motion `whileInView`,
//  then a finale converges the careers.
//
//  Reliability notes:
//   • Reveals are IntersectionObserver-backed `whileInView`, NOT
//     scroll-scrubbed MotionValues — this avoids the ScrollTimeline
//     opacity-stuck bug that the old X-ray build fought.
//   • The pause is pure CSS sticky (see .career-track / .career-panel
//     in globals.css). No ancestor of a pinned panel may have
//     overflow:hidden or a transform or iOS Safari breaks sticky — the
//     tree here keeps them clear.
//   • Reduced motion is handled in ONE tree (no separate static twin):
//     a `mounted` flag keeps SSR + first client render identical, then
//     motion is neutralized (initial=false, jump to final state) and the
//     CSS drops the pin/snap so it degrades to plain downward flow.
// ──────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  worlds,
  introPhoto,
  careerConstellation,
  futureEmployers,
} from "./xrayData";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Top-to-bottom cascade: children enter from ABOVE and descend into
// place, in reading order.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: -28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const chipWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const chip: Variants = {
  hidden: { opacity: 0, y: -14, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE } },
};
const watermark: Variants = {
  hidden: { opacity: 0, y: -40 },
  show: { opacity: 0.06, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export default function XrayExperience() {
  const reduced = useReducedMotion();
  // false on the server + first client render (keeps hydration in sync),
  // true thereafter — lets the reduced-motion neutralization take over
  // without a setState-in-effect or a hydration mismatch.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const still = mounted && reduced;

  // Which career is centered — lights the right-edge progress rail.
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const idx = Number((e.target as HTMLElement).dataset.idx);
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const el of sectionRefs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  // One reveal contract, motion-off for reduced-motion users (jump
  // straight to the final visible state — never leave text at opacity 0).
  type Reveal = {
    initial: false | "hidden";
    animate?: "show";
    whileInView?: "show";
    viewport?: { once: boolean; amount: number };
  };
  const reveal: Reveal = still
    ? { initial: false, animate: "show" }
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: false, amount: 0.4 },
      };

  return (
    <div className="home-scroll bg-[#070b14] text-white">
      {/* ── Hero ── */}
      <section className="snap-start relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <Image
          src={introPhoto}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.28]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/70 via-[#070b14]/60 to-[#070b14]/95" />
        <div className="pointer-events-none absolute inset-0 fx-vignette" />

        <motion.div {...reveal} variants={container} className="relative max-w-4xl">
          <motion.span
            variants={item}
            className="font-mono text-xs uppercase tracking-[0.4em] text-[#7ec8bf]"
          >
            IEM · RV College of Engineering
          </motion.span>
          {/* h1 stays statically visible: LCP / SEO anchor that survives
              a JS or hydration failure. */}
          <h1 className="mt-6 font-display text-4xl leading-[1.08] text-white sm:text-6xl md:text-7xl">
            Industrial Engineering
            <br />
            <span className="text-[#5ad1c4]">&amp; Management</span>
          </h1>
          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-lg text-white/80 sm:text-xl"
          >
            An NBA-accredited B.E. program at RV College of Engineering —
            blending engineering precision with management strategy to shape
            graduates who design, optimize, and lead the systems behind modern
            industry.
          </motion.p>
        </motion.div>

        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/60">
          <span className="font-mono text-xs tracking-[0.3em]">SCROLL TO EXPLORE</span>
          <span className="xr-bounce text-2xl">↓</span>
        </div>
      </section>

      {/* ── Section intro ── */}
      <section className="snap-start relative flex min-h-[60svh] flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div {...reveal} variants={container} className="max-w-2xl">
          <motion.p
            variants={item}
            className="font-mono text-xs uppercase tracking-[0.4em] text-white/50"
          >
            One degree
          </motion.p>
          <motion.h2
            variants={item}
            className="mt-4 font-display text-4xl text-white sm:text-5xl"
          >
            Six worlds. One degree.
          </motion.h2>
          <motion.p variants={item} className="mt-5 text-lg text-white/75">
            Industrial Engineering is the layer beneath modern industry — the
            systems that make it faster, leaner, and smarter. Keep scrolling
            through the six worlds an IEM graduate can go on to shape.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Six career worlds (each pins = the pause) ── */}
      {worlds.map((w, i) => (
        <section
          key={w.id}
          data-idx={i}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
          aria-labelledby={`career-${w.id}`}
          className="career-track snap-start"
        >
          <div className="career-panel">
            <Image
              src={w.photo}
              alt={w.realCaption}
              fill
              loading={i === 0 ? undefined : "lazy"}
              sizes="100vw"
              className="object-cover opacity-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/85 via-[#070b14]/70 to-[#070b14]/92" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/85 via-[#070b14]/30 to-transparent" />
            <div className="pointer-events-none absolute inset-0 fx-vignette" />

            {/* ghosted index numeral for depth */}
            <motion.span
              {...reveal}
              variants={watermark}
              aria-hidden="true"
              className="ghost-num pointer-events-none absolute right-[3%] top-1/2 -translate-y-1/2 select-none font-display text-[42vw] font-bold leading-none text-white sm:text-[26vw]"
            >
              {w.no}
            </motion.span>

            <motion.div
              {...reveal}
              variants={container}
              className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:px-10"
            >
              <div className="max-w-[40rem]">
                <motion.div
                  variants={item}
                  className="font-mono text-sm tracking-[0.35em]"
                  style={{ color: w.color }}
                >
                  {w.no} · {w.scanLabel}
                </motion.div>
                <motion.h2
                  id={`career-${w.id}`}
                  variants={item}
                  className="mt-3 font-display text-5xl leading-[1.03] text-white sm:text-6xl"
                >
                  {w.label}
                </motion.h2>
                <motion.div
                  variants={item}
                  className="mt-4 h-1 w-24 rounded-full"
                  style={{ background: w.color }}
                />
                <motion.p
                  variants={item}
                  className="mt-5 text-xl leading-snug text-white/90 sm:text-2xl"
                >
                  {w.problem}
                </motion.p>
                <motion.p
                  variants={item}
                  className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-white/55"
                >
                  What the work is
                </motion.p>
                <motion.p
                  variants={item}
                  className="mt-1 text-lg font-semibold leading-snug text-white sm:text-xl"
                >
                  {w.work}
                </motion.p>
                <motion.div
                  variants={chipWrap}
                  className="mt-6 flex flex-wrap gap-2"
                >
                  {w.careers.map((c) => (
                    <motion.span
                      key={c}
                      variants={chip}
                      className="rounded-full border px-3 py-1 text-sm text-white backdrop-blur-sm"
                      style={{ borderColor: `${w.color}99`, background: `${w.color}1f` }}
                    >
                      {c}
                    </motion.span>
                  ))}
                </motion.div>
                <motion.div
                  variants={item}
                  className="mt-6 font-mono text-xs tracking-wide text-white/70"
                >
                  Hires in: {w.industries.join(" · ")}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* ── Finale ── */}
      <section
        className="snap-start relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #0c1524, #070b14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 fx-vignette" />
        <motion.div {...reveal} variants={container} className="relative">
          <motion.span
            variants={item}
            className="font-mono text-xs uppercase tracking-[0.4em] text-[#5ad1c4]"
          >
            one degree
          </motion.span>
          <motion.h2
            variants={item}
            className="mt-4 font-display text-5xl leading-tight text-white sm:text-7xl"
          >
            Infinite futures.
          </motion.h2>
          <motion.p
            variants={item}
            className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg"
          >
            Six worlds, one degree. Where IEM graduates from RVCE end up.
          </motion.p>

          <motion.div
            variants={chipWrap}
            className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-2"
          >
            {careerConstellation.map((c) => (
              <motion.span
                key={c}
                variants={chip}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm text-white/90"
              >
                {c}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-white/45"
          >
            {futureEmployers.join("   ·   ")}
          </motion.div>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/curriculum"
              className="rounded-full bg-[#5ad1c4] px-6 py-3 font-semibold text-[#06121f] transition-transform hover:scale-105"
            >
              Explore the curriculum
            </Link>
            <Link
              href="/placements"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              See where they land
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Talk to the department
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Progress rail ── */}
      <div
        className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
        aria-hidden="true"
      >
        {worlds.map((w, i) => (
          <span
            key={w.id}
            className="h-2.5 w-2.5 rounded-full border transition-all duration-300"
            style={{
              borderColor: w.color,
              background: i === active ? w.color : "transparent",
              transform: i === active ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
