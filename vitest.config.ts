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
