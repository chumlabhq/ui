#!/usr/bin/env node
/**
 * Vitest and Playwright, at the same time.
 *
 * `test:all` ran them one after the other — typecheck, then 35s of vitest, then
 * five and a half minutes of chromium — for no reason: they share no state, no
 * ports and no fixtures. Vitest runs in workers against jsdom; Playwright drives
 * the Vite dev server it starts itself. Six minutes becomes five and a half, and
 * the vitest verdict arrives while the browser is still working.
 *
 * Output is buffered per runner and printed in a block when that runner
 * finishes, because two live progress streams interleaved is worse than either
 * alone. Vitest finishes first and prints first; the browser block follows.
 */
import { spawn } from "node:child_process";

const RUNNERS = [
  // Through the wrapper, so a vitest non-pass is named and a run that collects
  // fewer files than it should fails rather than reading as a pass.
  { name: "vitest", command: "node", args: ["scripts/run-vitest.mjs"] },
  {
    name: "playwright (chromium)",
    command: "npx",
    args: ["playwright", "test", "--project=chromium"],
    env: { PLAYWRIGHT_BROWSERS_PATH: "0" },
  },
];

const run = (runner) =>
  new Promise((resolve) => {
    const started = Date.now();
    let output = "";
    const child = spawn(runner.command, runner.args, {
      env: { ...process.env, ...runner.env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("close", (code) => {
      const seconds = Math.round((Date.now() - started) / 1000);
      process.stdout.write(
        `\n══ ${runner.name} — ${code === 0 ? "passed" : `FAILED (exit ${code})`} in ${seconds}s ` +
          "══════════\n",
      );
      process.stdout.write(output.endsWith("\n") ? output : `${output}\n`);
      resolve({ name: runner.name, ok: code === 0, seconds });
    });
  });

process.stdout.write(`▸ ${RUNNERS.map((r) => r.name).join(" and ")}, concurrently\n`);
const started = Date.now();
const results = await Promise.all(RUNNERS.map(run));
const wall = Math.round((Date.now() - started) / 1000);

process.stdout.write("\n══ test:all ════════════════════════════════════════════════════\n");
for (const result of results) {
  process.stdout.write(`  ${result.ok ? "pass" : "FAIL"}  ${result.name.padEnd(22)} ${result.seconds}s\n`);
}
process.stdout.write(
  `  wall ${wall}s, against ${results.reduce((total, r) => total + r.seconds, 0)}s serial\n`,
);
const ok = results.every((result) => result.ok);
process.stdout.write(ok ? "  RESULT: both runners passed\n" : "  RESULT: FAILED\n");
process.stdout.write("════════════════════════════════════════════════════════════════\n");
process.exit(ok ? 0 : 1);
