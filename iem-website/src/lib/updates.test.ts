import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { studyUpdates } from "./updates";

const PUBLIC_DIR = join(process.cwd(), "public");

describe("studyUpdates (the What's new log)", () => {
  it("is not empty and every batch has items", () => {
    expect(studyUpdates.length).toBeGreaterThan(0);
    for (const u of studyUpdates) expect(u.items.length).toBeGreaterThan(0);
  });

  it("uses valid ISO dates, newest first, one batch per date", () => {
    const dates = studyUpdates.map((u) => u.date);
    for (const d of dates) {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(`${d}T00:00:00Z`))).toBe(false);
    }
    expect(new Set(dates).size).toBe(dates.length);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("links only to files that exist (or internal pages)", () => {
    for (const u of studyUpdates) {
      for (const item of u.items) {
        expect(item.sem).toBeGreaterThanOrEqual(3);
        expect(item.sem).toBeLessThanOrEqual(8);
        if (item.href.startsWith("/notes/")) {
          const file = join(PUBLIC_DIR, decodeURIComponent(item.href));
          expect(existsSync(file), `${item.href} is missing`).toBe(true);
        } else {
          expect(item.href.startsWith("/resources/")).toBe(true);
        }
      }
    }
  });
});
