import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import VitestReconcileReporter from "./src/test/reconcile-reporter.js";

const CONTRACTS = "src/__tests__/contracts/**/*.{test,spec}.{ts,tsx}";
const SNIPPET_MOUNT = "src/__tests__/snippets/**/*.snippets.{ts,tsx}";

/**
 * `@chumlab/ui/<subpath>` as a consumer resolves it: through the package's own
 * `exports` map to the built files in dist/, never to src/. Derived from the
 * map so a subpath the package does not publish fails to resolve here too.
 */
const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf8")) as {
  exports: Record<string, string | { import?: { default?: string } }>;
};
const PUBLISHED = Object.entries(pkg.exports).flatMap(([key, target]) => {
  const file = typeof target === "string" ? target : target.import?.default;
  if (!file || !/\.js$/.test(file)) return [];
  return [{ find: new RegExp(`^${key.replace(/^\./, "@chumlab/ui").replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}$`), replacement: resolve(__dirname, file) }];
});

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [react()],
        test: {
          name: "unit",
          globals: true,
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
          exclude: ["**/node_modules/**", "**/dist/**", CONTRACTS],
          isolate: true,
        },
      },
      {
        // Every generated copy-paste snippet, mounted the way a consumer runs
        // it: the default React JSX runtime (not the library's marking one),
        // `@chumlab/ui` resolved to dist/, and the unit tier's jsdom setup.
        // See src/__tests__/snippets/mount.snippets.tsx.
        plugins: [react()],
        resolve: { alias: PUBLISHED, dedupe: ["react", "react-dom"] },
        test: {
          name: "snippets",
          globals: true,
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
          include: [SNIPPET_MOUNT],
          isolate: true,
          // One test mounts all 744 snippets. Measured alone: 20s with a warm
          // transform cache, 64s cold. Inside `run-vitest`, beside the other two
          // projects and straight after a regeneration, it passed 120s and timed
          // out (D4b). 300s is about 5x the cold figure; a real hang still fails.
          testTimeout: 300_000,
        },
      },
      {
        // The contracts tier compiles the library against src/jsx, the same
        // marking runtime `vite build --mode lib` uses (vite.config.ts:109).
        // Without it the cl-s marker does not exist in tests and the marker
        // contract could only ever assert its own absence. The contract test
        // files opt back out per-file with `/** @jsxImportSource react */`, so
        // the JSX they author behaves like a consumer's — which is the whole
        // point of the asChild assertions.
        plugins: [react({ jsxImportSource: resolve(__dirname, "src/jsx") })],
        test: {
          name: "contracts",
          globals: true,
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
          // Reads every export's props type once and provides the capability
          // flags the registry gates tests on; see src/test/capabilities.global.ts.
          globalSetup: ["./src/test/capabilities.global.ts"],
          include: [CONTRACTS],
          isolate: true,
          // These sweeps render every fixture of every component, and the
          // project runs its files in parallel. Under that load a render that
          // takes ~460ms alone has been measured at ~5.4s, which tripped the
          // 5s default and failed the whole file — one timeout cascading into
          // "no fixture renders `root`" for every component after it. The
          // suite was green or 99-red on the same commit depending on machine
          // load. A timeout is not an assertion; nothing here is weakened.
          testTimeout: 30_000,
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/components/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/**/types.ts",
        "src/**/index.ts",
      ],
    },
    // `includeTaskLocation` is what gives the reconciliation reporter a line
    // number; without it a non-pass names a file and nothing else.
    includeTaskLocation: true,
    reporters: ["verbose", new VitestReconcileReporter()],
  },
});
