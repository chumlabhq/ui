import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const CONTRACTS = "src/__tests__/contracts/**/*.{test,spec}.{ts,tsx}";

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
    reporters: ["verbose"],
  },
});
