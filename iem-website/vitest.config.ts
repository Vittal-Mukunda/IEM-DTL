import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * The résumé engine is pure — no DOM, no React — so its tests run in plain
 * Node. That is deliberate: a layout engine that needs a browser to be tested
 * is a layout engine nobody tests.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    testTimeout: 30_000,
  },
});
