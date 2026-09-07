#!/usr/bin/env node
/**
 * Vitest, with the verdict read from the reconciliation rather than from the
 * tail of its output.
 *
 * `src/test/reconcile-reporter.ts` names every non-pass and writes a
 * machine-readable twin; a reporter cannot set vitest's exit code, so this
 * reads that file and decides. It is the same division as
 * `run-e2e-matrix.mjs` and `_reconcile-reporter.ts` on the browser side, and
 * for the same reason: a gate that scrapes its own console output breaks the
 * first time someone rewords a line.
 *
 *   node scripts/run-vitest.mjs [vitest args…]
 *   node scripts/run-vitest.mjs --self-check   plant a failure, require it named
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * What a full run collects. A floor, not a target: a run that collects fewer
 * files than this has lost some, and a lost file is indistinguishable from a
 * passing one in every summary vitest prints. Raise it when tests are added —
 * `node scripts/run-vitest.mjs` prints the current numbers on every run.
 */
const SUITE_FLOOR = { files: 91, tests: 4738 };

const args = process.argv.slice(2).filter((a) => a !== "--self-check");
const selfCheck = process.argv.includes("--self-check");

/** A path or a `-t` filter means a subset, and a subset has no floor. */
const filtered = args.some((a) => !a.startsWith("-")) || args.includes("-t");

function runVitest(extra, { inherit = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "vitest-reconcile-"));
  const jsonPath = join(dir, "reconcile.json");
  const result = spawnSync("npx", ["vitest", "run", ...extra], {
    cwd: ROOT,
    stdio: inherit ? "inherit" : "pipe",
    env: { ...process.env, VITEST_RECONCILE_JSON: jsonPath },
  });
  const report = existsSync(jsonPath) ? JSON.parse(readFileSync(jsonPath, "utf8")) : null;
  rmSync(dir, { recursive: true, force: true });
  return { report, status: result.status ?? 1 };
}

if (selfCheck) {
  const spec = join(ROOT, "src", "__tests__", "planted-non-pass.test.ts");
  writeFileSync(
    spec,
    [
      'import { describe, expect, it } from "vitest";',
      "",
      'describe("planted", () => {',
      '  it("planted failure", () => {',
      "    expect(1, \"planted\").toBe(2);",
      "  });",
      "});",
      "",
    ].join("\n"),
    "utf8",
  );
  let ok = false;
  try {
    const { report } = runVitest([spec, "--project=unit"]);
    const named = (report?.notPassedTests ?? []).find(
      (t) =>
        t.state === "failed" &&
        t.title.includes("planted failure") &&
        /planted-non-pass\.test\.ts$/.test(t.file) &&
        typeof t.line === "number",
    );
    process.stdout.write("\n══ vitest reconciliation self-check ════════════════════════════\n");
    process.stdout.write(
      named
        ? `  named   a failing test  →  ${named.file}:${named.line}  ${named.title}\n` +
            "  RESULT: a non-pass names its file, line and title\n"
        : "  NOT NAMED  a failing test\n  RESULT: FAILED — a failure was counted and not named\n",
    );
    process.stdout.write("════════════════════════════════════════════════════════════════\n");
    ok = Boolean(named);
  } finally {
    // Before the exit, not after: `process.exit` inside the `try` skips this,
    // and the planted spec was left behind for the next full run to collect.
    rmSync(spec, { force: true });
  }
  process.exit(ok ? 0 : 1);
}

const { report, status } = runVitest(args);
const problems = [];

if (!report) {
  problems.push(`no reconciliation was written (vitest exited ${status})`);
} else {
  if (report.notPassed > 0) problems.push(`${report.notPassed} test(s) did not pass`);
  if (report.executed !== report.collected) {
    problems.push(
      `${report.collected - report.executed} collected test(s) never reported a result`,
    );
  }
  if (!filtered && report.files < SUITE_FLOOR.files) {
    problems.push(
      `collected ${report.files} files, floor ${SUITE_FLOOR.files} — a file that stops being ` +
        "collected reads exactly like a file whose tests all passed",
    );
  }
  if (!filtered && report.collected < SUITE_FLOOR.tests) {
    problems.push(`collected ${report.collected} tests, floor ${SUITE_FLOOR.tests}`);
  }
  if (status !== 0 && problems.length === 0) {
    problems.push(`vitest exited ${status} with nothing in the reconciliation to explain it`);
  }
}

process.stdout.write("\n══ vitest ══════════════════════════════════════════════════════\n");
if (report) {
  process.stdout.write(
    `  files ${report.files}  collected ${report.collected}  executed ${report.executed}  ` +
      `${Object.entries(report.byState).sort().map(([k, v]) => `${k}=${v}`).join(" ")}` +
      `${filtered ? "  (subset — floor not applied)" : `  floor ${SUITE_FLOOR.files}/${SUITE_FLOOR.tests}`}\n`,
  );
}
for (const problem of problems) process.stdout.write(`  ${problem}\n`);
process.stdout.write(
  problems.length === 0
    ? "  RESULT: every collected test ran and passed\n"
    : "  RESULT: FAILED\n",
);
process.stdout.write("════════════════════════════════════════════════════════════════\n");
process.exit(problems.length === 0 ? 0 : 1);
