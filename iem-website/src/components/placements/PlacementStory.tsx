"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Counter from "@/components/cinematic/Counter";
import TiltCard from "@/components/cinematic/TiltCard";
import { placementData, recruiterOffers, otherRecruiters } from "@/lib/data";

/* Chronological (oldest -> newest) for the trend story. */
const series = [...placementData].sort((a, b) =>
  a.year.localeCompare(b.year),
);

/* ── chart geometry ───────────────────────────────────────── */
const CW = 720;
const CH = 300;
const PAD = { l: 44, r: 20, t: 20, b: 38 };
const innerW = CW - PAD.l - PAD.r;
const innerH = CH - PAD.t - PAD.b;
const Y_MAX = 24;

// Round to keep SSR/client SVG coordinate strings identical (no hydration drift).
const r2 = (n: number) => Math.round(n * 100) / 100;
const xAt = (i: number) =>
  r2(PAD.l + (series.length === 1 ? 0 : (i / (series.length - 1)) * innerW));
const yAt = (v: number) => r2(PAD.t + (1 - v / Y_MAX) * innerH);
const baseline = yAt(0);

function linePath(key: "avgLPA" | "maxLPA") {
  return series
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(d[key])}`)
    .join(" ");
}

export default function PlacementStory() {
  const reduced = useReducedMotion();
  // default to the latest year
  const [active, setActive] = useState(series.length - 1);
  const [hover, setHover] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInView = useInView(chartRef, { once: true, margin: "-60px" });

  const tip = hover ?? active;
  const row = series[active];

  const areaPath = useMemo(
    () =>
      `${linePath("maxLPA")} L ${xAt(series.length - 1)} ${baseline} L ${xAt(0)} ${baseline} Z`,
    [],
  );

  const funnel = [
    { label: "Companies", value: row.companies, color: "var(--primary-light)" },
    { label: "Offers", value: row.offers, color: "var(--accent)" },
    { label: "Selected", value: row.selected, color: "var(--primary)" },
  ];
  const funnelMax = Math.max(...funnel.map((f) => f.value));

  return (
    <div className="space-y-14">
      {/* ── A. Animated headline KPIs ─────────────────────── */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: 22.5, dec: 2, pre: "₹", suf: "", label: "LPA highest, 2025–26", hot: true },
            { v: 12.45, dec: 2, pre: "₹", suf: "", label: "LPA average, 2025–26" },
            { v: 70, dec: 0, pre: "", suf: "%+", label: "3-Year Placement Rate" },
            { v: 80, dec: 0, pre: "", suf: "+", label: "Recruiters (4-year)" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <TiltCard
                className={`rounded-xl p-5 text-center border ${
                  s.hot
                    ? "bg-accent/10 border-accent/20"
                    : "bg-primary/5 border-primary/10"
                }`}
              >
                <Counter
                  value={s.v}
                  prefix={s.pre}
                  suffix={s.suf}
                  decimals={s.dec}
                  className="text-3xl font-bold text-primary"
                />
                <p className="text-sm text-text-muted mt-1">{s.label}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── B. Package trend line chart ───────────────────── */}
      <section ref={chartRef}>
        <h2 className="text-2xl font-bold text-primary mb-1">Package Trends</h2>
        <p className="text-text-muted mb-6">
          Average and highest package over four placement seasons. Hover a point
          — or use the year buttons below — to explore that season.
        </p>

        <div className="relative rounded-2xl border border-gray-200 bg-white p-3 sm:p-5">
          <div className="relative w-full" style={{ aspectRatio: `${CW} / ${CH}` }}>
           <div className="absolute inset-0">
            <svg
              viewBox={`0 0 ${CW} ${CH}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
              focusable="false"
            >
              {/* y gridlines */}
              {[0, 6, 12, 18, 24].map((g) => (
                <g key={g}>
                  <line
                    x1={PAD.l}
                    x2={CW - PAD.r}
                    y1={yAt(g)}
                    y2={yAt(g)}
                    stroke="currentColor"
                    className="text-gray-200"
                    strokeWidth={1}
                  />
                  <text
                    x={PAD.l - 8}
                    y={yAt(g) + 4}
                    textAnchor="end"
                    className="fill-text-muted text-[11px]"
                  >
                    {g}
                  </text>
                </g>
              ))}

              {/* area under max */}
              <motion.path
                d={areaPath}
                fill="var(--primary-light)"
                initial={{ opacity: 0 }}
                animate={chartInView ? { opacity: 0.08 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />

              {/* max line */}
              <motion.path
                d={linePath("maxLPA")}
                fill="none"
                stroke="var(--primary-light)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: reduced ? 1 : 0 }}
                animate={chartInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
              {/* avg line */}
              <motion.path
                d={linePath("avgLPA")}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3}
                strokeDasharray="1 0"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: reduced ? 1 : 0 }}
                animate={chartInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.1, delay: 0.2, ease: "easeInOut" }}
              />

              {/* active guide */}
              <line
                x1={xAt(tip)}
                x2={xAt(tip)}
                y1={PAD.t}
                y2={baseline}
                stroke="currentColor"
                className="text-gray-300"
                strokeWidth={1}
                strokeDasharray="4 4"
              />

              {/* interactive points */}
              {series.map((d, i) => (
                <g key={d.year}>
                  {/* max point */}
                  <circle
                    cx={xAt(i)}
                    cy={yAt(d.maxLPA)}
                    r={tip === i ? 7 : 5}
                    fill="var(--primary-light)"
                    stroke="#fff"
                    strokeWidth={2}
                    className="transition-all"
                  />
                  {/* avg point */}
                  <circle
                    cx={xAt(i)}
                    cy={yAt(d.avgLPA)}
                    r={tip === i ? 7 : 5}
                    fill="var(--accent)"
                    stroke="#fff"
                    strokeWidth={2}
                    className="transition-all"
                  />
                  {/* hit area */}
                  <rect
                    x={xAt(i) - innerW / (series.length * 2)}
                    y={PAD.t}
                    width={innerW / series.length}
                    height={innerH}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setActive(i)}
                  />
                  {/* x label */}
                  <text
                    x={xAt(i)}
                    y={CH - 12}
                    textAnchor="middle"
                    className={`text-[12px] ${
                      active === i ? "fill-primary font-semibold" : "fill-text-muted"
                    }`}
                  >
                    {d.year.split("–")[0]}
                  </text>
                </g>
              ))}
            </svg>

            {/* floating tooltip — lifted toward the viewer in 3D */}
            <div
              className="pointer-events-none absolute z-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg"
              style={{
                left: `${(xAt(tip) / CW) * 100}%`,
                top: `${(yAt(series[tip].maxLPA) / CH) * 100 - 3}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <p className="font-semibold text-primary">{series[tip].year}</p>
              <p className="text-primary-light">Max ₹{series[tip].maxLPA} LPA</p>
              <p className="text-accent">Avg ₹{series[tip].avgLPA} LPA</p>
            </div>
           </div>
          </div>

          <div className="mt-3 flex gap-6 text-xs text-text-muted">
            <span className="flex items-center gap-2">
              <span className="inline-block h-1 w-4 rounded bg-primary-light" />
              Highest package
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1 w-4 rounded bg-accent" />
              Average package
            </span>
          </div>
        </div>
      </section>

      {/* ── C. Year explorer + conversion funnel ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-1">Year Explorer</h2>
        <p className="text-text-muted mb-6">
          Pick a season to watch how recruiter drives turned into offers and
          final selections.
        </p>

        {/* year tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {series.map((d, i) => (
            <button
              key={d.year}
              type="button"
              onClick={() => setActive(i)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active === i
                  ? "text-white"
                  : "text-text-muted hover:text-primary"
              }`}
            >
              {active === i && (
                <motion.span
                  layoutId="year-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {d.year}
                {d.ongoing && (
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      active === i ? "bg-accent-light" : "bg-accent"
                    }`}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* funnel */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="space-y-5">
              {funnel.map((f, i) => (
                <div key={f.label}>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <span className="font-medium text-gray-700">{f.label}</span>
                    <motion.span
                      key={`${f.label}-${active}`}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-bold text-primary"
                    >
                      {f.value}
                    </motion.span>
                  </div>
                  <div className="h-7 w-full overflow-hidden rounded-lg bg-gray-100">
                    <motion.div
                      className="flex h-full items-center justify-end rounded-lg pr-2"
                      style={{ backgroundColor: f.color }}
                      initial={false}
                      animate={{ width: `${(f.value / funnelMax) * 100}%` }}
                      transition={{
                        duration: reduced ? 0 : 0.6,
                        ease: [0.21, 0.65, 0.32, 0.95],
                        delay: i * 0.06,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-text-muted">
              Conversion from companies on campus to final selections for{" "}
              <span className="font-semibold text-primary">{row.year}</span>
              {row.ongoing && " (drive ongoing)"}.
            </p>
          </div>

          {/* package readout */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {[
              { label: "Average package", value: row.avgLPA, tone: "accent" },
              { label: "Highest package", value: row.maxLPA, tone: "primary-light" },
            ].map((m) => (
              <TiltCard
                key={m.label}
                className="flex flex-col justify-center rounded-2xl border border-gray-200 bg-surface p-5"
              >
                <motion.p
                  key={`${m.label}-${active}`}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-primary"
                >
                  ₹{m.value}
                </motion.p>
                <p className="mt-1 text-sm text-text-muted">{m.label} (LPA)</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── D. Recruiters & packages ──────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-1">
          Recruiters &amp; Packages
        </h2>
        <p className="text-text-muted mb-6">
          Companies that hired from the current 2025–26 drive — the CTC offered
          and the role, highest package first.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-surface text-primary">
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                  Package (CTC)
                </th>
                <th className="px-4 py-3 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody>
              {recruiterOffers.map((o, i) => (
                <tr
                  key={o.company}
                  className={i % 2 ? "bg-surface/40" : "bg-white"}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {o.company}
                  </td>
                  <td className="px-4 py-3 font-bold text-accent whitespace-nowrap">
                    {o.ctc}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{o.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-text-muted">
          CTC = annual cost-to-company as recorded in the department placement
          sheet; a range means multiple roles or offers at that company.
        </p>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-primary mb-3">
            Other recruiters from recent drives
          </h3>
          <div className="flex flex-wrap gap-2">
            {otherRecruiters.map((r) => (
              <span
                key={r}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
