/**
 * Node-side font loading, for the verifier and the test suite.
 *
 * Kept in its own module so `fonts.ts` never imports `node:fs` and the browser
 * bundle stays clean.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { FontLoader } from "./fonts";

export function nodeFontLoader(root: string): FontLoader {
  return async (file: string) => new Uint8Array(await readFile(join(root, file)));
}
