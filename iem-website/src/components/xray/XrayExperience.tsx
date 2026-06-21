"use client";

// ──────────────────────────────────────────────────────────────────
//  "The X-Ray" — IEM RVCE homepage.
//
//  A scanner sweeps across six photographs of the real world; each one
//  dissolves into the engineered systems an Industrial Engineer designs
//  and runs underneath it. One continuous pinned scroll track, no
//  sections, no fade-in blocks.
//
//  Reliability notes (hard-won in this Next 16 + motion v12 repo):
//   • Scene VISIBILITY is driven by React STATE derived from scroll
//     (phase / activeWorld / textStage via useMotionValueEvent), then
//     crossfaded with CSS transition-opacity. Scroll-linked `opacity`
//     MotionValues are NOT used — they compile to native ScrollTimeline
//     here and never reach 0 (old scenes linger).
//   • Only a CONTINUOUS transform-like value is scrubbed: the scanner
//     position, pushed into a CSS custom property (--line) on the stage.
//     CSS clip-path reads it, so the wipe scrubs smoothly per frame.
//   • No AnimatePresence (exit unmount stalls here). Swaps use keyed
//     remount; the finale/HUD use state-gated `animate`.
//   • Reduced-motion swap is gated behind a `mounted` flag so SSR and
//     first client render both show the scroll version (no hydration
//     mismatch); the static version takes over after mount.
// ──────────────────────────────────────────────────────────────────

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import {
  worlds,
  introPhoto,
  careerConstellation,
  futureEmployers,
} from "./xrayData";
import { SYSTEMS } from "./XraySystems";

const INTRO_END = 0.06;
const FINALE_START = 0.9;
const W = (FINALE_START - INTRO_END) / worlds.length;

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

type Phase = "intro" | "world" | "finale";

export default function XrayExperience() {
  const reduced = useReducedMotion();
  // false on the server + first client render (keeps hydration in sync),
  // true thereafter — lets the reduced-motion static swap take over
  // without a setState-in-effect.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const [phase, setPhase] = useState<Phase>("intro");
  const [activeWorld, setActiveWorld] = useState(0);
  const [textStage, setTextStage] = useState(0);

  const phaseRef = useRef<Phase>("intro");
  const worldRef = useRef(0);
  const stageRef = useRef(0);

  // scan: 0 → 1 across one world; --line is the boundary x (100% → 0%)
  const scan = useMotionValue(0);
  const linePct = useTransform(scan, (v) => `${((1 - v) * 100).toFixed(2)}%`);

  useMotionValueEvent(scrollYProgress, "change", (raw) => {
    const p = clamp(raw);
    let next: Phase;
    if (p < INTRO_END) {
      next = "intro";
      scan.set(0);
    } else if (p >= FINALE_START) {
      next = "finale";
      scan.set(1);
    } else {
      next = "world";
      const rel = (p - INTRO_END) / W;
      const idx = clamp(Math.floor(rel), 0, worlds.length - 1);
      const t = rel - idx;
      // Short lead-in / trail give the cross-world opacity fade room to
      // resolve; smoothstep easing then lets the scanner glide to rest at
      // each end instead of snapping from constant speed to a dead stop —
      // that velocity discontinuity is what read as a "stop" between worlds.
      const raw = clamp((t - 0.1) / 0.82);
      const s = raw * raw * (3 - 2 * raw);
      scan.set(s);
      const st = s < 0.06 ? 0 : s < 0.55 ? 1 : 2;
      if (st !== stageRef.current) {
        stageRef.current = st;
        setTextStage(st);
      }
      if (idx !== worldRef.current) {
        worldRef.current = idx;
        setActiveWorld(idx);
      }
    }
    if (next !== phaseRef.current) {
      phaseRef.current = next;
      setPhase(next);
    }
  });

  if (mounted && reduced) return <XrayStatic />;

  const w = worlds[activeWorld];
  const inWorld = phase === "world";

  return (
    <section
      ref={trackRef}
      className="relative bg-[#070b14]"
      style={{ height: "820vh" }}
    >
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#070b14]"
        style={{ ["--line" as string]: linePct }}
      >
        {/* ── World visuals: engineered layer (bottom) + photo (clipped, top) ── */}
        {worlds.map((world, i) => {
          const Sys = SYSTEMS[world.id];
          const visible = inWorld && i === activeWorld;
          return (
            <div
              key={world.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!visible}
            >
              {/* engineered layer */}
              <div className="absolute inset-0 xr-grid">
                <Sys color={world.color} active={visible} />
              </div>
              {/* reality layer — clipped to the left of the scan line */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "inset(0 calc(100% - var(--line)) 0 0)",
                  WebkitClipPath: "inset(0 calc(100% - var(--line)) 0 0)",
                }}
              >
                <Image
                  src={world.photo}
                  alt={world.realCaption}
                  fill
                  // Only the first world is preloaded; the rest stream in as
                  // the scanner approaches them (they're well below the fold).
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#070b14]/25" />
              </div>
            </div>
          );
        })}

        {/* ── Legibility scrim ── */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#070b14]/90 via-[#070b14]/35 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b14]/85 via-transparent to-[#070b14]/55" />

        {/* ── Scan line ── */}
        <div
          className={`pointer-events-none absolute inset-y-0 z-20 transition-opacity duration-500 ${
            inWorld ? "opacity-100" : "opacity-0"
          }`}
          style={{ left: "var(--line)" }}
        >
          <div
            className="absolute inset-y-0 -left-px w-[2px]"
            style={{ background: w.color, boxShadow: `0 0 24px 3px ${w.color}` }}
          />
          <div
            className="absolute inset-y-0 -left-16 w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${w.color}22)`,
            }}
          />
          <span
            className="absolute top-[24%] left-3 whitespace-nowrap font-mono text-[11px] tracking-[0.25em]"
            style={{ color: w.color }}
          >
            ▸ SCANNING
          </span>
        </div>

        {/* ── Per-world captions (keyed remount = replays entrance) ── */}
        {inWorld && (
          <div className="absolute inset-0 z-30">
            <motion.div
              key={activeWorld}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="absolute left-[6%] right-[6%] top-[12%] max-w-[34rem] sm:right-auto sm:top-[26%]"
            >
              <div
                className="font-mono text-sm tracking-[0.4em]"
                style={{ color: w.color }}
              >
                {w.no} · {w.scanLabel}
              </div>
              <h2 className="mt-3 font-display text-5xl leading-[1.02] text-white sm:text-6xl">
                {w.label}
              </h2>
              <div
                className="mt-4 h-1 w-24 rounded-full"
                style={{ background: w.color }}
              />
              <p className="mt-5 text-lg leading-snug text-white/85 sm:text-xl">
                {w.problem}
              </p>
            </motion.div>

            {/* engineered-side readout: the job + careers + industries */}
            <div className="absolute left-[6%] right-[6%] top-[52%] w-auto text-left sm:left-auto sm:right-[5%] sm:top-[24%] sm:w-[24rem] sm:text-right">
              <motion.p
                animate={{
                  opacity: textStage >= 1 ? 1 : 0,
                  y: textStage >= 1 ? 0 : 12,
                }}
                transition={{ duration: 0.4 }}
                className="font-mono text-xs uppercase tracking-[0.2em] text-white/55"
              >
                what the work is
              </motion.p>
              <motion.p
                animate={{
                  opacity: textStage >= 1 ? 1 : 0,
                  y: textStage >= 1 ? 0 : 12,
                }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="mt-1 text-xl font-semibold leading-snug text-white"
              >
                {w.work}
              </motion.p>

              <motion.div
                animate={{ opacity: textStage >= 2 ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 flex flex-wrap justify-start gap-2 sm:justify-end"
              >
                {w.careers.map((c, i) => (
                  <motion.span
                    key={c}
                    animate={{
                      opacity: textStage >= 2 ? 1 : 0,
                      scale: textStage >= 2 ? 1 : 0.85,
                    }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                    className="rounded-full border px-3 py-1 text-sm text-white backdrop-blur-sm"
                    style={{
                      borderColor: `${w.color}99`,
                      background: `${w.color}1f`,
                    }}
                  >
                    {c}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                animate={{ opacity: textStage >= 2 ? 0.7 : 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-5 font-mono text-xs tracking-wide text-white/70"
              >
                hires in: {w.industries.join(" · ")}
              </motion.div>
            </div>

            {/* reality tag, bottom-left over the photo */}
            <div className="absolute bottom-[7%] left-[6%] flex items-center gap-2 font-mono text-xs tracking-wide text-white/60">
              <span className="inline-block h-2 w-2 rounded-full bg-white/70" />
              {w.realCaption}
            </div>
          </div>
        )}

        {/* ── Intro ── */}
        <div
          className={`absolute inset-0 z-30 transition-opacity duration-700 ${
            phase === "intro" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={introPhoto}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/70 via-[#070b14]/55 to-[#070b14]/90" />
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.45em] text-[#5ad1c4]">
              IEM · RV College of Engineering
            </span>
            <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.08] text-white sm:text-6xl md:text-7xl">
              Industrial Engineering
              <br />
              <span className="text-[#5ad1c4]">&amp; Management</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75 sm:text-xl">
              An NBA-accredited B.E. program at RV College of Engineering —
              blending engineering precision with management strategy to shape
              graduates who design, optimize, and lead the systems behind modern
              industry.
            </p>
            <div className="mt-14 flex flex-col items-center gap-2 text-white/60">
              <span className="font-mono text-xs tracking-[0.3em]">SCROLL TO SCAN</span>
              <span className="xr-bounce text-2xl">↓</span>
            </div>
          </div>
        </div>

        {/* ── Finale: convergence of careers ── */}
        <Finale active={phase === "finale"} />

        {/* ── HUD: world progress dots ── */}
        <div
          className={`pointer-events-none absolute right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 sm:flex transition-opacity duration-500 ${
            inWorld ? "opacity-100" : "opacity-0"
          }`}
        >
          {worlds.map((world, i) => (
            <div
              key={world.id}
              className="h-2.5 w-2.5 rounded-full border transition-all duration-300"
              style={{
                borderColor: world.color,
                background: i === activeWorld ? world.color : "transparent",
                transform: i === activeWorld ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* grain / vignette */}
        <div className="pointer-events-none absolute inset-0 z-10 fx-vignette" />
      </motion.div>
    </section>
  );
}

/* ── Finale scene ── */
function Finale({ active }: { active: boolean }) {
  return (
    <div
      className={`absolute inset-0 z-30 transition-opacity duration-700 ${
        active ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 xr-grid" />
      <div className="pointer-events-none absolute inset-0 fx-vignette" />
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#5ad1c4]">
          one degree
        </span>
        <h2 className="mt-4 font-display text-5xl leading-tight text-white sm:text-7xl">
          Infinite futures.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
          Six worlds, one degree. Where IEM graduates from RVCE end up.
        </p>

        <motion.div
          initial={false}
          animate={active ? "on" : "off"}
          variants={{ on: { transition: { staggerChildren: 0.025 } } }}
          className="mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-2"
        >
          {careerConstellation.map((c) => (
            <motion.span
              key={c}
              variants={{
                off: { opacity: 0, y: 14 },
                on: { opacity: 1, y: 0 },
              }}
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm text-white/90"
            >
              {c}
            </motion.span>
          ))}
        </motion.div>

        <div className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-white/45">
          {futureEmployers.join("   ·   ")}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Reduced-motion / no-scroll fallback — same story, told statically.
   ────────────────────────────────────────────────────────────────── */
function XrayStatic() {
  return (
    <div className="bg-[#070b14] text-white">
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
        <Image src={introPhoto} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-[#070b14]/70" />
        <div className="relative">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-[#5ad1c4]">
            IEM · RV College of Engineering
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">
            Industrial Engineering <span className="text-[#5ad1c4]">&amp; Management</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">
            An NBA-accredited B.E. program at RV College of Engineering —
            blending engineering precision with management strategy to shape
            graduates who design, optimize, and lead the systems behind modern
            industry.
          </p>
        </div>
      </section>

      {worlds.map((w) => (
        <section key={w.id} className="relative min-h-[60vh] overflow-hidden">
          <Image src={w.photo} alt={w.realCaption} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/70 to-[#070b14]/30" />
          <div className="relative max-w-2xl px-6 py-16 sm:px-12">
            <div className="font-mono text-sm tracking-[0.3em]" style={{ color: w.color }}>
              {w.no} · {w.scanLabel}
            </div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">{w.label}</h2>
            <div className="mt-3 h-1 w-20 rounded-full" style={{ background: w.color }} />
            <p className="mt-4 text-lg text-white/85">{w.problem}</p>
            <p className="mt-2 text-lg font-semibold text-white">{w.work}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {w.careers.map((c) => (
                <span
                  key={c}
                  className="rounded-full border px-3 py-1 text-sm"
                  style={{ borderColor: `${w.color}99`, background: `${w.color}1f` }}
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-4 font-mono text-xs text-white/60">
              hires in: {w.industries.join(" · ")}
            </div>
          </div>
        </section>
      ))}

      <section className="px-6 py-24 text-center">
        <h2 className="font-display text-4xl sm:text-6xl">One degree. Infinite futures.</h2>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
          {careerConstellation.map((c) => (
            <span key={c} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm text-white/90">
              {c}
            </span>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/curriculum" className="rounded-full bg-[#5ad1c4] px-6 py-3 font-semibold text-[#06121f]">
            Explore the curriculum
          </Link>
          <Link href="/placements" className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white">
            See where they land
          </Link>
        </div>
      </section>
    </div>
  );
}
