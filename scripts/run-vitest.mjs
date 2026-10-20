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
 * How many tests a full run collects. A floor, not a target: raise it when
 * tests are added — `node scripts/run-vitest.mjs` prints the current number on
 * every run.
 *
 * Files have no constant. Each project's include globs are listed before the
 * run (`vitest list --filesOnly`, which globs and runs nothing), and every
 * matched file must report. A lost file is indistinguishable from a passing
 * one in every summary vitest prints, and a constant only noticed the loss once
 * it outgrew the slack: when a forks worker failed to start, the run reported
 * 106 of 107 files and cleared a floor of 92.
 *
 * 4749 from 2026-09-08 (032eb67f) to 2026-10-20, while the suite grew to 5497:
 * 748 tests could have stopped being collected without this noticing. Raised
 * to the measured count in G1; the per-file basis is the `unit+contracts` row
 * of docs/adr/002-gate-populations.json's `$basisChanges`. 5502 at M1-L1:
 * Toast's five Pause on Focus tests.
 */
const SUITE_FLOOR = { tests: 5502 };

const args = process.argv.slice(2).filter((a) => a !== "--self-check");
const selfCheck = process.argv.includes("--self-check");

/** A path or a `-t` filter means a subset, and a subset has no floor. */
const filtered = args.some((a) => !a.startsWith("-")) || args.includes("-t");

/** Every file the projects' include globs match for these arguments, as `project:path`. */
function matchedFiles(extra) {
  const dir = mkdtempSync(join(tmpdir(), "vitest-list-"));
  const jsonPath = join(dir, "files.json");
  const result = spawnSync(
    "npx",
    // A `-t` filter narrows tests, not files, so it is left off the listing.
    ["vitest", "list", "--filesOnly", `--json=${jsonPath}`, ...extra.filter((a, i) => a !== "-t" && extra[i - 1] !== "-t")],
    { cwd: ROOT, stdio: "pipe" },
  );
  const listed = existsSync(jsonPath) ? JSON.parse(readFileSync(jsonPath, "utf8")) : null;
  rmSync(dir, { recursive: true, force: true });
  if (!listed) {
    throw new Error(`vitest list wrote no file list (exit ${result.status}):\n${result.stderr}`);
  }
  return listed.map((f) => `${f.projectName}:${f.file.replace(`${ROOT}/`, "")}`);
}

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

const expected = matchedFiles(args);
const { report, status } = runVitest(args);
const problems = [];
/** Matched files that reported no test: never loaded, or loaded and collected nothing. */
const reported = new Set(
  (report?.modules ?? []).filter((m) => m.tests > 0).map((m) => `${m.project}:${m.file}`),
);
const missing = expected.filter((f) => !reported.has(f));

if (!report) {
  problems.push(`no reconciliation was written (vitest exited ${status})`);
} else {
  if (report.notPassed > 0) problems.push(`${report.notPassed} test(s) did not pass`);
  if (report.executed !== report.collected) {
    problems.push(
      `${report.collected - report.executed} collected test(s) never reported a result`,
    );
  }
  if (missing.length > 0) {
    problems.push(
      `${missing.length} matched file(s) reported no result — a file that stops reporting ` +
        "reads exactly like a file whose tests all passed:",
      ...missing.map((f) => `    ${f}`),
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
      `${filtered ? "  (subset — test floor not applied)" : `  test floor ${SUITE_FLOOR.tests}`}\n`,
  );
}
process.stdout.write(
  `  files expected ${expected.length}, reported ${expected.length - missing.length}, missing ${missing.length}\n`,
);
for (const problem of problems) process.stdout.write(`  ${problem}\n`);
process.stdout.write(
  problems.length === 0
    ? "  RESULT: every collected test ran and passed\n"
    : "  RESULT: FAILED\n",
);
process.stdout.write("════════════════════════════════════════════════════════════════\n");
process.exit(problems.length === 0 ? 0 : 1);
