"use client";

// ──────────────────────────────────────────────────────────────────
//  The "engineered layer" revealed under each photograph.
//  Six SVG system motifs, one per career world, each echoing its photo:
//  a digital twin, a logistics network, a control chart, a CAD part,
//  a workflow graph, a market chart. Structure draws in (motion
//  pathLength) when its world becomes active; ambient life comes from
//  the fx-* CSS utilities in globals.css. Transparent background —
//  the dark blueprint grid sits behind, supplied by the stage.
//
//  All coordinates are authored as literals (no runtime trig) so SSR
//  and client markup are bit-identical — see the hydration gotcha.
// ──────────────────────────────────────────────────────────────────

import { motion, type Variants } from "motion/react";

type SysProps = { color: string; active: boolean };

const VB = "0 0 1200 800";
const svgClass =
  "absolute inset-0 h-full w-full";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Shared draw variants — a stroke that traces itself in.
const draw: Variants = {
  off: { pathLength: 0, opacity: 0 },
  on: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.1, delay: 0.15 + i * 0.08, ease: EASE },
      opacity: { duration: 0.3, delay: 0.15 + i * 0.08 },
    },
  }),
};

const pop: Variants = {
  off: { scale: 0, opacity: 0 },
  on: (i: number = 0) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: 0.5 + i * 0.06, type: "spring", stiffness: 300, damping: 18 },
  }),
};

function Sys({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <motion.svg
      viewBox={VB}
      preserveAspectRatio="xMidYMid slice"
      className={svgClass}
      initial="off"
      animate={active ? "on" : "off"}
      aria-hidden="true"
    >
      {children}
    </motion.svg>
  );
}

/* ── 01 · Operations & Analytics — digital twin + rising forecast ── */
export function OpsSystem({ color, active }: SysProps) {
  // isometric "building" footprints (echo the wireframe factory)
  const boxes = [
    "M120 470 L320 400 L520 470 L320 540 Z",
    "M560 440 L760 370 L960 440 L760 510 Z",
    "M150 600 L350 530 L550 600 L350 670 Z",
  ];
  // extruded verticals for the first box
  const risers = [
    "M120 470 L120 380 M320 400 L320 310 M520 470 L520 380 M320 540 L320 450",
  ];
  // a forecast line that climbs
  const chart = "M700 720 L780 690 L860 700 L940 630 L1020 650 L1100 540";
  const dots = [
    [780, 690], [860, 700], [940, 630], [1020, 650], [1100, 540],
  ];
  return (
    <Sys active={active}>
      {boxes.map((d, i) => (
        <motion.path key={`b${i}`} d={d} fill="none" stroke={color} strokeWidth={2}
          custom={i} variants={draw} />
      ))}
      <motion.path d={risers[0]} fill="none" stroke={color} strokeWidth={1.5}
        strokeOpacity={0.7} custom={3} variants={draw} />
      <motion.path d={chart} fill="none" stroke={color} strokeWidth={2.5}
        custom={4} variants={draw} className="fx-pulse" />
      {dots.map(([x, y], i) => (
        <motion.circle key={`d${i}`} cx={x} cy={y} r={5} fill={color}
          custom={i} variants={pop} />
      ))}
      {/* pulsing data nodes over the twin */}
      {[[320, 400], [760, 370], [350, 530]].map(([x, y], i) => (
        <motion.circle key={`n${i}`} cx={x} cy={y} r={7} fill="none" stroke={color}
          strokeWidth={2} custom={i} variants={pop} className="fx-pulse" />
      ))}
    </Sys>
  );
}

/* ── 02 · Supply Chain — node-and-arc logistics network ── */
export function ScmSystem({ color, active }: SysProps) {
  const nodes = [
    [180, 300], [430, 200], [620, 420], [840, 260], [1010, 440], [560, 640], [260, 560],
  ];
  // quadratic arcs between nodes (literal control points)
  const arcs = [
    "M180 300 Q300 150 430 200",
    "M430 200 Q540 280 620 420",
    "M620 420 Q740 280 840 260",
    "M840 260 Q950 320 1010 440",
    "M620 420 Q580 560 560 640",
    "M560 640 Q380 640 260 560",
    "M260 560 Q200 420 180 300",
  ];
  return (
    <Sys active={active}>
      {arcs.map((d, i) => (
        <motion.path key={`a${i}`} d={d} fill="none" stroke={color} strokeWidth={2}
          strokeOpacity={0.85} custom={i} variants={draw} className="fx-flow" />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={`p${i}`}>
          <motion.circle cx={x} cy={y} r={10} fill="#0a1020" stroke={color}
            strokeWidth={2.5} custom={i} variants={pop} />
          <motion.circle cx={x} cy={y} r={20} fill="none" stroke={color}
            strokeWidth={1} strokeOpacity={0.4} custom={i} variants={pop}
            className="fx-pulse" />
        </g>
      ))}
    </Sys>
  );
}

/* ── 03 · Quality — statistical control chart + inspection reticle ── */
export function QualitySystem({ color, active }: SysProps) {
  const ucl = 250, lcl = 550, mid = 400;
  const series = "M150 410 L260 370 L370 430 L480 360 L590 420 L700 280 L810 440 L920 390 L1030 410";
  const pts = [
    [150, 410], [260, 370], [370, 430], [480, 360], [590, 420],
    [700, 280], [810, 440], [920, 390], [1030, 410],
  ];
  return (
    <Sys active={active}>
      {/* control limits */}
      <motion.line x1={120} y1={ucl} x2={1080} y2={ucl} stroke={color} strokeWidth={1.5}
        strokeDasharray="8 8" strokeOpacity={0.6} custom={0} variants={draw} />
      <motion.line x1={120} y1={mid} x2={1080} y2={mid} stroke={color} strokeWidth={1.5}
        strokeOpacity={0.9} custom={1} variants={draw} />
      <motion.line x1={120} y1={lcl} x2={1080} y2={lcl} stroke={color} strokeWidth={1.5}
        strokeDasharray="8 8" strokeOpacity={0.6} custom={2} variants={draw} />
      <text x={1086} y={ucl + 5} fill={color} fontSize={20} fontFamily="monospace" opacity={active ? 0.8 : 0}>UCL</text>
      <text x={1086} y={lcl + 5} fill={color} fontSize={20} fontFamily="monospace" opacity={active ? 0.8 : 0}>LCL</text>
      {/* the process */}
      <motion.path d={series} fill="none" stroke={color} strokeWidth={2.5}
        custom={3} variants={draw} />
      {pts.map(([x, y], i) => {
        const out = y < ucl; // the point that breaches the upper limit
        return (
          <motion.circle key={`q${i}`} cx={x} cy={y} r={out ? 9 : 5}
            fill={out ? "none" : color} stroke={color} strokeWidth={out ? 3 : 0}
            custom={i} variants={pop} className={out ? "fx-pulse" : undefined} />
        );
      })}
      {/* scanning reticle (echoes the vision camera) */}
      <motion.g custom={5} variants={pop} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx={700} cy={280} r={46} fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={0.7} className="fx-spin" style={{ transformBox: "fill-box", transformOrigin: "700px 280px" } as React.CSSProperties} />
        <line x1={640} y1={280} x2={760} y2={280} stroke={color} strokeWidth={1} strokeOpacity={0.5} />
        <line x1={700} y1={220} x2={700} y2={340} stroke={color} strokeWidth={1} strokeOpacity={0.5} />
      </motion.g>
    </Sys>
  );
}

/* ── 04 · Design & Manufacturing — CAD wireframe + dimensions ── */
export function DesignSystem({ color, active }: SysProps) {
  // a stylised connecting-rod / bracket profile
  const part =
    "M300 400 a70 70 0 1 0 0.1 0 M300 330 L760 300 a60 60 0 1 1 0 200 L300 470 Z";
  const innerBig = "M760 360 a40 40 0 1 0 0.1 0";
  const dims = [
    "M300 560 L760 560 M300 550 L300 570 M760 550 L760 570", // length dim
    "M210 330 L210 470 M200 330 L220 330 M200 470 L220 470", // height dim
  ];
  return (
    <Sys active={active}>
      {/* faint construction grid */}
      {[200, 400, 600, 800, 1000].map((x, i) => (
        <motion.line key={`gx${i}`} x1={x} y1={120} x2={x} y2={700} stroke={color}
          strokeWidth={0.5} strokeOpacity={0.18} custom={i * 0.3} variants={draw} />
      ))}
      <motion.path d={part} fill="none" stroke={color} strokeWidth={2.5}
        custom={1} variants={draw} />
      <motion.path d={innerBig} fill="none" stroke={color} strokeWidth={2}
        custom={2} variants={draw} />
      <motion.circle cx={300} cy={400} r={30} fill="none" stroke={color} strokeWidth={2}
        custom={3} variants={pop} />
      {dims.map((d, i) => (
        <motion.path key={`dim${i}`} d={d} fill="none" stroke={color} strokeWidth={1}
          strokeOpacity={0.6} custom={4 + i} variants={draw} />
      ))}
      <text x={500} y={548} fill={color} fontSize={18} fontFamily="monospace" textAnchor="middle" opacity={active ? 0.75 : 0}>460.0</text>
    </Sys>
  );
}

/* ── 05 · Management & HR — workflow / org network + gantt ── */
export function MgmtSystem({ color, active }: SysProps) {
  const nodes = [
    [600, 220], [360, 340], [840, 340], [260, 520], [520, 500], [760, 520], [980, 480],
  ];
  const links = [
    "M600 220 L360 340", "M600 220 L840 340",
    "M360 340 L260 520", "M360 340 L520 500",
    "M840 340 L760 520", "M840 340 L980 480",
  ];
  const gantt = [
    [180, 660, 260], [300, 690, 220], [420, 720, 320],
  ];
  return (
    <Sys active={active}>
      {links.map((d, i) => (
        <motion.path key={`l${i}`} d={d} fill="none" stroke={color} strokeWidth={1.5}
          strokeOpacity={0.7} custom={i} variants={draw} className="fx-flow-slow" />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={`hx${i}`}>
          <motion.circle cx={x} cy={y} r={i === 0 ? 16 : 11} fill="#0a1020"
            stroke={color} strokeWidth={2.5} custom={i} variants={pop} />
          {i === 0 && (
            <motion.circle cx={x} cy={y} r={28} fill="none" stroke={color}
              strokeWidth={1} strokeOpacity={0.4} variants={pop} className="fx-pulse" />
          )}
        </g>
      ))}
      {/* a small gantt to imply scheduling */}
      {gantt.map(([x, y, w], i) => (
        <motion.rect key={`g${i}`} x={x} y={y} width={w} height={14} rx={3}
          fill={color} fillOpacity={0.55} custom={6 + i} variants={pop} />
      ))}
    </Sys>
  );
}

/* ── 06 · Finance & Marketing — market area chart + candles ── */
export function FinanceSystem({ color, active }: SysProps) {
  const area =
    "M140 560 L260 540 L380 580 L500 480 L620 520 L740 400 L860 440 L980 320 L1080 360 L1080 700 L140 700 Z";
  const line =
    "M140 560 L260 540 L380 580 L500 480 L620 520 L740 400 L860 440 L980 320 L1080 360";
  // candlesticks: [x, highY, lowY, openY, closeY]
  const candles = [
    [340, 590, 660, 610, 640],
    [420, 540, 630, 620, 560],
    [500, 470, 560, 540, 490],
    [580, 500, 600, 580, 520],
    [660, 420, 520, 500, 440],
  ];
  return (
    <Sys active={active}>
      <motion.path d={area} fill={color} fillOpacity={0.12}
        custom={5} variants={pop} />
      <motion.path d={line} fill="none" stroke={color} strokeWidth={2.5}
        custom={0} variants={draw} />
      {candles.map(([x, hi, lo, op, cl], i) => {
        const up = cl < op;
        const top = Math.min(op, cl);
        const h = Math.abs(op - cl);
        return (
          <motion.g key={`c${i}`} custom={i} variants={pop}>
            <line x1={x} y1={hi} x2={x} y2={lo} stroke={color} strokeWidth={1.5} strokeOpacity={0.8} />
            <rect x={x - 9} y={top} width={18} height={Math.max(h, 4)} rx={2}
              fill={up ? color : "#0a1020"} stroke={color} strokeWidth={1.5} />
          </motion.g>
        );
      })}
      {/* up arrow */}
      <motion.path d="M980 320 l34 -10 l-12 32" fill="none" stroke={color}
        strokeWidth={2.5} custom={6} variants={draw} />
    </Sys>
  );
}

export const SYSTEMS: Record<string, (p: SysProps) => React.ReactElement> = {
  ops: OpsSystem,
  scm: ScmSystem,
  quality: QualitySystem,
  design: DesignSystem,
  mgmt: MgmtSystem,
  finance: FinanceSystem,
};
