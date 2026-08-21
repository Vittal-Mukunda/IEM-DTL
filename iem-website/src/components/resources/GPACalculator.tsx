"use client";

import { useRef, useState } from "react";
import {
  COURSE_TYPES,
  semesterSchemes,
  type CourseType,
  type SemesterScheme,
} from "@/lib/gpaScheme";

interface SubjectRow {
  id: number;
  name: string;
  type: CourseType;
  cie: string;
  labSee: string;
  semEnd: string;
  credits: string;
}

const rowsFromScheme = (scheme: SemesterScheme): SubjectRow[] =>
  scheme.courses.map((c, i) => ({
    id: i,
    name: c.name,
    type: c.type,
    cie: "",
    labSee: "",
    semEnd: "",
    credits: String(c.credits),
  }));

const initialRows = (): Record<number, SubjectRow[]> =>
  Object.fromEntries(semesterSchemes.map((s) => [s.sem, rowsFromScheme(s)]));

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

/**
 * Grade points the four `thresholds` entries stand for, in order.
 *
 * Shared so the wide table's headings and the narrow cards' labels cannot
 * drift apart from each other, or from the thresholds they describe.
 */
const TARGET_GRADES = ["10 GP", "9 GP", "8 GP", "7 GP"] as const;

// Sem End marks still needed to reach a grade cutoff, given CIE (+ Lab SEE)
// already earned. Mirrors the sheet: MAX(0, cutoff - earned).
function requiredSemEnd(row: SubjectRow, cutoff: number) {
  const lab = COURSE_TYPES[row.type].hasLab ? num(row.labSee) : 0;
  return Math.max(0, cutoff - num(row.cie) - lab);
}

const hasMarks = (rows: SubjectRow[]) =>
  rows.some((r) => r.cie !== "" || r.labSee !== "" || r.semEnd !== "");

function semesterTotals(rows: SubjectRow[]) {
  const credits = rows.reduce((n, r) => n + num(r.credits), 0);
  const weighted = rows.reduce((n, r) => n + num(r.credits) * gradePoints(r), 0);
  return { credits, weighted, sgpa: credits > 0 ? weighted / credits : 0 };
}

export default function GPACalculator() {
  const [activeSem, setActiveSem] = useState(semesterSchemes[0].sem);
  const [bySem, setBySem] = useState<Record<number, SubjectRow[]>>(initialRows);
  const nextId = useRef(1000);

  const scheme = semesterSchemes.find((s) => s.sem === activeSem)!;
  const rows = bySem[activeSem];

  const setRows = (fn: (rs: SubjectRow[]) => SubjectRow[]) =>
    setBySem((all) => ({ ...all, [activeSem]: fn(all[activeSem]) }));

  const update = (id: number, patch: Partial<SubjectRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRow = (id: number) => setRows((rs) => rs.filter((r) => r.id !== id));

  const addRow = () =>
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

  const resetSemester = () =>
    setBySem((all) => ({ ...all, [activeSem]: rowsFromScheme(scheme) }));

  const { credits: totalCredits, weighted: totalWeighted, sgpa } =
    semesterTotals(rows);

  // CGPA across every semester the student has actually entered marks for.
  const filled = semesterSchemes
    .map((s) => ({ scheme: s, rows: bySem[s.sem] }))
    .filter((s) => hasMarks(s.rows))
    .map((s) => ({ ...s, ...semesterTotals(s.rows) }));
  const cgpaCredits = filled.reduce((n, s) => n + s.credits, 0);
  const cgpa =
    cgpaCredits > 0
      ? filled.reduce((n, s) => n + s.weighted, 0) / cgpaCredits
      : 0;

  // `min-h-11` is the 44px touch target the subject cards need on a phone,
  // where these fields are the whole interaction. It is dropped at `lg`, where
  // the same class dresses the dense desktop table and the extra height would
  // only stretch the rows.
  const inputCls =
    "w-full min-h-11 lg:min-h-0 rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15";

  return (
    <div className="space-y-6">
      {/* Semester picker */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-primary mr-1">
            Semester
          </span>
          {semesterSchemes.map((s) => {
            const active = s.sem === activeSem;
            return (
              <button
                key={s.sem}
                onClick={() => setActiveSem(s.sem)}
                aria-pressed={active}
                className={`min-w-[3.25rem] min-h-11 sm:min-h-0 rounded-lg px-3 py-1.5 text-sm font-semibold border transition-colors ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary/50 hover:text-primary"
                }`}
              >
                {s.label}
                {hasMarks(bySem[s.sem]) && (
                  <span
                    className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full align-middle ${
                      active ? "bg-white" : "bg-accent"
                    }`}
                    aria-label="marks entered"
                  />
                )}
              </button>
            );
          })}
          <button
            onClick={resetSemester}
            className="ml-auto inline-flex min-h-11 items-center text-sm text-text-muted hover:text-accent underline underline-offset-2 sm:min-h-0"
          >
            Reset {scheme.label} sem
          </button>
        </div>
        <p className="text-xs text-text-muted mt-3 leading-relaxed">
          Subjects, course types and credits are pre-filled from the IEM scheme
          for the {scheme.label} semester
          {scheme.totalCredits ? ` (${scheme.totalCredits} credits)` : ""}.
          Electives are listed by their group — rename them to the course you
          took. Marks stay saved as you switch between semesters.
          {scheme.partial && (
            <>
              {" "}
              <span className="text-accent">
                Any additional rows in your scheme table (audit, ability
                enhancement or 0-credit courses) can be added below.
              </span>
            </>
          )}
        </p>
      </div>

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
                    className="w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-md border border-gray-200 text-text-muted hover:text-white hover:bg-accent transition-colors"
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
          <p className="text-sm text-gray-200">
            SGPA &middot; {scheme.label} Semester
          </p>
          <p className="text-3xl font-bold mt-1 tabular-nums">
            {sgpa.toFixed(2)}
          </p>
        </div>
      </div>

      {/* CGPA across semesters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-primary/5 border-b border-gray-100">
          <h3 className="font-semibold text-primary">CGPA Across Semesters</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Credit-weighted across every semester you have entered marks for.
          </p>
        </div>
        {filled.length === 0 ? (
          <p className="px-4 py-5 text-sm text-text-muted italic">
            Enter marks in one or more semesters to see your CGPA.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-primary border-b border-gray-100">
                  <th className="px-4 py-2.5 font-semibold">Semester</th>
                  <th className="px-3 py-2.5 font-semibold text-right">
                    Credits
                  </th>
                  <th className="px-3 py-2.5 font-semibold text-right">
                    Weighted GP
                  </th>
                  <th className="px-4 py-2.5 font-semibold text-right">SGPA</th>
                </tr>
              </thead>
              <tbody>
                {filled.map((s) => (
                  <tr key={s.scheme.sem} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-gray-800">
                      {s.scheme.label} Semester
                    </td>
                    <td className="px-3 py-2 text-right text-gray-800 tabular-nums">
                      {s.credits}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-800 tabular-nums">
                      {s.weighted}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-800 tabular-nums">
                      {s.sgpa.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-primary/20 bg-primary/5">
                  <td className="px-4 py-2.5 font-semibold text-primary">
                    CGPA
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-primary tabular-nums">
                    {cgpaCredits}
                  </td>
                  <td className="px-3 py-2.5" />
                  <td className="px-4 py-2.5 text-right font-bold text-primary tabular-nums">
                    {cgpa.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Required Sem End marks for each grade */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-primary/5 border-b border-gray-100">
          <h3 className="font-semibold text-primary">
            Required Sem End Marks for Target Grade
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Based on the CIE (and Lab SEE) marks entered for the {scheme.label}{" "}
            semester above.
          </p>
        </div>
        {/* Five columns need the room. Below `sm` the subject name was being
            squeezed into about 160px and wrapping to three lines, leaving the
            four marks in 43px columns beside a ragged 77px row — so on a phone
            each subject gets a card instead, the same way the marks table does. */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-primary border-b border-gray-100">
                <th className="px-4 py-2.5 font-semibold">Subject</th>
                {TARGET_GRADES.map((grade) => (
                  <th
                    key={grade}
                    className="px-3 py-2.5 font-semibold text-right whitespace-nowrap"
                  >
                    {grade}
                  </th>
                ))}
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

        {/* Target marks — one card per subject (mobile) */}
        <div className="sm:hidden divide-y divide-gray-100">
          {rows.map((row) => (
            <div key={row.id} className="p-4">
              <p className="text-sm font-medium text-gray-800">
                {row.name || (
                  <span className="text-text-muted italic">Untitled</span>
                )}
              </p>
              <dl className="mt-2 grid grid-cols-4 gap-2">
                {COURSE_TYPES[row.type].thresholds.map((cutoff, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-primary/5 px-2 py-1.5 text-center"
                  >
                    <dt className="text-xs text-text-muted">
                      {TARGET_GRADES[i]}
                    </dt>
                    <dd className="font-bold tabular-nums text-gray-800">
                      {requiredSemEnd(row, cutoff)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>

      {/* Grading scale reference */}
      <div className="bg-surface rounded-2xl p-6 border border-primary/10">
        <h3 className="font-semibold text-primary mb-2">Grading Scale</h3>
        <ul className="text-sm text-gray-700 space-y-1.5 leading-relaxed">
          <li>
            <span className="font-medium">
              Theory + Lab, 300 marks (CIE 100 + Lab 50 + SEE 100 + Lab SEE 50):
            </span>{" "}
            268+ = 10 &middot; 240&ndash;267 = 9 &middot; 210&ndash;239 = 8
            &middot; 180&ndash;209 = 7
          </li>
          <li>
            <span className="font-medium">
              Theory, 200 marks (CIE 100 + SEE 100):
            </span>{" "}
            180+ = 10 &middot; 160&ndash;179 = 9 &middot; 140&ndash;159 = 8
            &middot; 120&ndash;139 = 7
          </li>
          <li>
            <span className="font-medium">Basket Course, 200 marks:</span> 179+
            = 10 &middot; 161&ndash;178 = 9 &middot; 141&ndash;160 = 8 &middot;
            121&ndash;140 = 7
          </li>
          <li>
            <span className="font-medium">
              Theory / Lab, 100 marks (CIE 50 + SEE 50):
            </span>{" "}
            90+ = 10 &middot; 80&ndash;89 = 9 &middot; 70&ndash;79 = 8 &middot;
            60&ndash;69 = 7
          </li>
          <li>
            <span className="font-medium">NPTEL, 50 marks (SEE only):</span> 45+
            = 10 &middot; 40&ndash;44 = 9 &middot; 35&ndash;39 = 8 &middot;
            30&ndash;34 = 7
          </li>
        </ul>
        <p className="text-xs text-text-muted mt-3">
          Projects and the summer internship are graded 100 CIE + 100 SEE, so
          they use the same 200-mark scale as theory courses. Totals below the
          7-grade-point cutoff score 0 grade points. Enter CIE, Lab SEE (for lab
          courses) and Sem End marks &mdash; totals, grade points, SGPA and CGPA
          update automatically.
        </p>
      </div>
    </div>
  );
}
