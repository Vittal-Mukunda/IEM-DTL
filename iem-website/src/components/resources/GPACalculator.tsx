"use client";

import { useRef, useState } from "react";

// Grade boundaries per course type — [10, 9, 8, 7] grade-point cutoffs on
// total marks (CIE + Lab SEE + Sem End). Below the last cutoff scores 0.
const COURSE_TYPES = {
  lab: {
    label: "Theory + Lab",
    thresholds: [268, 240, 210, 180],
    hasLab: true,
    defaultCredits: 4,
  },
  theory: {
    label: "Theory (200 marks)",
    thresholds: [180, 160, 140, 120],
    hasLab: false,
    defaultCredits: 4,
  },
  basket: {
    label: "Basket Course",
    thresholds: [179, 161, 141, 121],
    hasLab: false,
    defaultCredits: 3,
  },
  small: {
    label: "Theory (100 marks)",
    thresholds: [90, 80, 70, 60],
    hasLab: false,
    defaultCredits: 2,
  },
} as const;

type CourseType = keyof typeof COURSE_TYPES;

interface SubjectRow {
  id: number;
  name: string;
  type: CourseType;
  cie: string;
  labSee: string;
  semEnd: string;
  credits: string;
}

const DEFAULT_SUBJECTS: SubjectRow[] = [
  { id: 0, name: "OR", type: "lab", cie: "", labSee: "", semEnd: "", credits: "4" },
  { id: 1, name: "CAD", type: "lab", cie: "", labSee: "", semEnd: "", credits: "4" },
  { id: 2, name: "Mathematics", type: "theory", cie: "", labSee: "", semEnd: "", credits: "4" },
  { id: 3, name: "Basket Course", type: "basket", cie: "", labSee: "", semEnd: "", credits: "3" },
  { id: 4, name: "UHV", type: "small", cie: "", labSee: "", semEnd: "", credits: "2" },
  { id: 5, name: "DTL", type: "small", cie: "", labSee: "", semEnd: "", credits: "2" },
  { id: 6, name: "NPTEL", type: "small", cie: "", labSee: "", semEnd: "", credits: "2" },
];

const num = (s: string) => {
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : 0;
};

function totalMarks(row: SubjectRow) {
  const lab = COURSE_TYPES[row.type].hasLab ? num(row.labSee) : 0;
  return num(row.cie) + lab + num(row.semEnd);
}

function gradePoints(row: SubjectRow) {
  const total = totalMarks(row);
  const [t10, t9, t8, t7] = COURSE_TYPES[row.type].thresholds;
  if (total >= t10) return 10;
  if (total >= t9) return 9;
  if (total >= t8) return 8;
  if (total >= t7) return 7;
  return 0;
}

// Sem End marks still needed to reach a grade cutoff, given CIE (+ Lab SEE)
// already earned. Mirrors the sheet: MAX(0, cutoff - earned).
function requiredSemEnd(row: SubjectRow, cutoff: number) {
  const lab = COURSE_TYPES[row.type].hasLab ? num(row.labSee) : 0;
  return Math.max(0, cutoff - num(row.cie) - lab);
}

export default function GPACalculator() {
  const [rows, setRows] = useState<SubjectRow[]>(DEFAULT_SUBJECTS);
  const nextId = useRef(DEFAULT_SUBJECTS.length);

  const update = (id: number, patch: Partial<SubjectRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRow = (id: number) =>
    setRows((rs) => rs.filter((r) => r.id !== id));

  const addRow = () => {
    setRows((rs) => [
      ...rs,
      {
        id: nextId.current++,
        name: "",
        type: "small",
        cie: "",
        labSee: "",
        semEnd: "",
        credits: String(COURSE_TYPES.small.defaultCredits),
      },
    ]);
  };

  const totalCredits = rows.reduce((n, r) => n + num(r.credits), 0);
  const totalWeighted = rows.reduce(
    (n, r) => n + num(r.credits) * gradePoints(r),
    0,
  );
  const cgpa = totalCredits > 0 ? totalWeighted / totalCredits : 0;

  const inputCls =
    "w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15";

  return (
    <div className="space-y-6">
      {/* Marks table (desktop) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[1020px] text-sm">
            <thead>
              <tr className="bg-primary/5 text-left text-primary">
                <th className="px-4 py-3 font-semibold min-w-[10rem]">Subject</th>
                <th className="px-3 py-3 font-semibold min-w-[11rem]">Course Type</th>
                <th className="px-3 py-3 font-semibold w-24">CIE Total</th>
                <th className="px-3 py-3 font-semibold w-24">Lab SEE</th>
                <th className="px-3 py-3 font-semibold w-24">Sem End</th>
                <th className="px-3 py-3 font-semibold w-24">Credits</th>
                <th className="px-3 py-3 font-semibold text-right w-20">Total</th>
                <th className="px-3 py-3 font-semibold text-right w-24">
                  Grade Points
                </th>
                <th className="px-3 py-3 font-semibold text-right w-24">
                  Weighted GP
                </th>
                <th className="px-2 py-3 w-12">
                  <span className="sr-only">Remove subject</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const type = COURSE_TYPES[row.type];
                return (
                  <tr key={row.id} className="border-t border-gray-100">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => update(row.id, { name: e.target.value })}
                        placeholder="Subject name"
                        aria-label="Subject name"
                        className={inputCls}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={row.type}
                        onChange={(e) => {
                          const t = e.target.value as CourseType;
                          update(row.id, {
                            type: t,
                            credits: String(COURSE_TYPES[t].defaultCredits),
                            labSee: COURSE_TYPES[t].hasLab ? row.labSee : "",
                          });
                        }}
                        aria-label="Course type"
                        className={inputCls}
                      >
                        {Object.entries(COURSE_TYPES).map(([key, t]) => (
                          <option key={key} value={key}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        value={row.cie}
                        onChange={(e) => update(row.id, { cie: e.target.value })}
                        placeholder="0"
                        aria-label="CIE total marks"
                        className={inputCls}
                      />
                    </td>
                    <td className="px-3 py-2">
                      {type.hasLab ? (
                        <input
                          type="number"
                          min={0}
                          value={row.labSee}
                          onChange={(e) =>
                            update(row.id, { labSee: e.target.value })
                          }
                          placeholder="0"
                          aria-label="Lab SEE marks"
                          className={inputCls}
                        />
                      ) : (
                        <span className="block text-center text-text-muted">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        value={row.semEnd}
                        onChange={(e) =>
                          update(row.id, { semEnd: e.target.value })
                        }
                        placeholder="0"
                        aria-label="Semester end marks"
                        className={inputCls}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        value={row.credits}
                        onChange={(e) =>
                          update(row.id, { credits: e.target.value })
                        }
                        aria-label="Credits"
                        className={inputCls}
                      />
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-gray-800 tabular-nums">
                      {totalMarks(row)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-gray-800 tabular-nums">
                      {gradePoints(row)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-gray-800 tabular-nums">
                      {num(row.credits) * gradePoints(row)}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => removeRow(row.id)}
                        aria-label={`Remove ${row.name || "subject"}`}
                        title="Remove subject"
                        className="w-7 h-7 inline-flex items-center justify-center rounded-md text-text-muted hover:text-white hover:bg-accent transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Subject cards (mobile / tablet) */}
        <div className="lg:hidden divide-y divide-gray-100">
          {rows.map((row) => {
            const type = COURSE_TYPES[row.type];
            return (
              <div key={row.id} className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => update(row.id, { name: e.target.value })}
                    placeholder="Subject name"
                    aria-label="Subject name"
                    className={`${inputCls} font-medium`}
                  />
                  <button
                    onClick={() => removeRow(row.id)}
                    aria-label={`Remove ${row.name || "subject"}`}
                    title="Remove subject"
                    className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-md border border-gray-200 text-text-muted hover:text-white hover:bg-accent transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <select
                  value={row.type}
                  onChange={(e) => {
                    const t = e.target.value as CourseType;
                    update(row.id, {
                      type: t,
                      credits: String(COURSE_TYPES[t].defaultCredits),
                      labSee: COURSE_TYPES[t].hasLab ? row.labSee : "",
                    });
                  }}
                  aria-label="Course type"
                  className={inputCls}
                >
                  {Object.entries(COURSE_TYPES).map(([key, t]) => (
                    <option key={key} value={key}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-xs text-text-muted mb-1">
                      CIE Total
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={row.cie}
                      onChange={(e) => update(row.id, { cie: e.target.value })}
                      placeholder="0"
                      className={inputCls}
                    />
                  </label>
                  {type.hasLab && (
                    <label className="block">
                      <span className="block text-xs text-text-muted mb-1">
                        Lab SEE
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={row.labSee}
                        onChange={(e) =>
                          update(row.id, { labSee: e.target.value })
                        }
                        placeholder="0"
                        className={inputCls}
                      />
                    </label>
                  )}
                  <label className="block">
                    <span className="block text-xs text-text-muted mb-1">
                      Sem End
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={row.semEnd}
                      onChange={(e) =>
                        update(row.id, { semEnd: e.target.value })
                      }
                      placeholder="0"
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-xs text-text-muted mb-1">
                      Credits
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={row.credits}
                      onChange={(e) =>
                        update(row.id, { credits: e.target.value })
                      }
                      className={inputCls}
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2 text-sm text-gray-800">
                  <span>
                    Total{" "}
                    <span className="font-bold tabular-nums">
                      {totalMarks(row)}
                    </span>
                  </span>
                  <span>
                    GP{" "}
                    <span className="font-bold tabular-nums">
                      {gradePoints(row)}
                    </span>
                  </span>
                  <span>
                    Weighted{" "}
                    <span className="font-bold tabular-nums">
                      {num(row.credits) * gradePoints(row)}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-3 border-t border-gray-100">
          <button onClick={addRow} className="btn-sketch text-sm !min-h-0 !py-2">
            + Add Subject
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-sm text-text-muted">Total Credits</p>
          <p className="text-3xl font-bold text-primary mt-1 tabular-nums">
            {totalCredits}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-sm text-text-muted">Total Weighted GP</p>
          <p className="text-3xl font-bold text-primary mt-1 tabular-nums">
            {totalWeighted}
          </p>
        </div>
        <div className="bg-primary rounded-xl shadow-sm p-5 text-center text-white">
          <p className="text-sm text-gray-200">Your SGPA</p>
          <p className="text-3xl font-bold mt-1 tabular-nums">
            {cgpa.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Required Sem End marks for each grade */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-primary/5 border-b border-gray-100">
          <h3 className="font-semibold text-primary">
            Required Sem End Marks for Target Grade
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Based on the CIE (and Lab SEE) marks entered above.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-primary border-b border-gray-100">
                <th className="px-4 py-2.5 font-semibold">Subject</th>
                <th className="px-3 py-2.5 font-semibold text-right">
                  10 GP
                </th>
                <th className="px-3 py-2.5 font-semibold text-right">9 GP</th>
                <th className="px-3 py-2.5 font-semibold text-right">8 GP</th>
                <th className="px-3 py-2.5 font-semibold text-right">7 GP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-800">
                    {row.name || (
                      <span className="text-text-muted italic">Untitled</span>
                    )}
                  </td>
                  {COURSE_TYPES[row.type].thresholds.map((cutoff, i) => (
                    <td
                      key={i}
                      className="px-3 py-2 text-right text-gray-800 tabular-nums"
                    >
                      {requiredSemEnd(row, cutoff)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading scale reference */}
      <div className="bg-surface rounded-2xl p-6 border border-primary/10">
        <h3 className="font-semibold text-primary mb-2">Grading Scale</h3>
        <ul className="text-sm text-gray-700 space-y-1.5 leading-relaxed">
          <li>
            <span className="font-medium">Theory + Lab (4 credits):</span>{" "}
            268+ = 10 &middot; 240&ndash;267 = 9 &middot; 210&ndash;239 = 8
            &middot; 180&ndash;209 = 7
          </li>
          <li>
            <span className="font-medium">Theory, 200 marks (4 credits):</span>{" "}
            180+ = 10 &middot; 160&ndash;179 = 9 &middot; 140&ndash;159 = 8
            &middot; 120&ndash;139 = 7
          </li>
          <li>
            <span className="font-medium">Basket Course (3 credits):</span>{" "}
            179+ = 10 &middot; 161&ndash;178 = 9 &middot; 141&ndash;160 = 8
            &middot; 121&ndash;140 = 7
          </li>
          <li>
            <span className="font-medium">Theory, 100 marks (2 credits):</span>{" "}
            90+ = 10 &middot; 80&ndash;89 = 9 &middot; 70&ndash;79 = 8 &middot;
            60&ndash;69 = 7
          </li>
        </ul>
        <p className="text-xs text-text-muted mt-3">
          Totals below the 7-grade-point cutoff score 0 grade points. Enter CIE,
          Lab SEE (for lab courses) and Sem End marks &mdash; totals, grade
          points and SGPA update automatically.
        </p>
      </div>
    </div>
  );
}
