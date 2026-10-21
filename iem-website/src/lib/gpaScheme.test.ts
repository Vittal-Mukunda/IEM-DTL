import { describe, expect, it } from "vitest";
import { COURSE_TYPES, semesterSchemes } from "./gpaScheme";

// Credit totals printed in the scheme tables of the syllabus booklets
// (2025 scheme for III–IV, 2022 scheme for V–VIII).
const BOOKLET_CREDITS: Record<number, number> = {
  3: 22,
  4: 21,
  5: 20,
  6: 24,
  7: 20,
  8: 12,
};

describe("GPA scheme", () => {
  it("covers semesters III to VIII", () => {
    expect(semesterSchemes.map((s) => s.sem)).toEqual([3, 4, 5, 6, 7, 8]);
  });

  it.each(semesterSchemes.map((s) => [s.label, s] as const))(
    "semester %s credits add up to the booklet total",
    (_, scheme) => {
      const sum = scheme.courses.reduce((n, c) => n + c.credits, 0);
      expect(sum).toBe(BOOKLET_CREDITS[scheme.sem]);
      expect(scheme.totalCredits).toBe(BOOKLET_CREDITS[scheme.sem]);
    },
  );

  it("grades NPTEL on a single score out of 100", () => {
    const nptel = semesterSchemes
      .flatMap((s) => s.courses)
      .filter((c) => c.type === "nptel");
    expect(nptel).toEqual([
      { code: "IM256TCX", name: "NPTEL", type: "nptel", credits: 2 },
    ]);
    expect(COURSE_TYPES.nptel.scoreOnly).toBe(true);
    expect(COURSE_TYPES.nptel.thresholds).toEqual([90, 80, 70, 60]);
  });
});
