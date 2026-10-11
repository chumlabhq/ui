import { writeFileSync } from "node:fs";
import type { Reporter, TestCase, TestModule } from "vitest/node";

/**
 * The browser side's reconciliation, on the vitest side.
 *
 * `e2e/_reconcile-reporter.ts` exists because a summary printed `N failed`
 * above its failure list and `N passed` at the bottom, so the tail of a failing
 * run read like a passing one. Vitest had the same shape of defect and no
 * equivalent: a run reported `1 failed` and printed nothing identifying it, and
 * by the time the next run finished the first one's output was gone.
 *
 * So, at the very end of the output, in one block:
 *
 * - every non-pass named with its file, line and full title, read from the
 *   reporter's own structures rather than scraped from printed text
 * - collected against executed, because a test that is collected and never
 *   reports a result is not a pass
 * - every file it heard from, with its test count, so `scripts/run-vitest.mjs`
 *   can name a matched file that never reported: a worker that fails to start
 *   leaves no entry for its file, and one that dies leaves an entry with no
 *   tests
 * - a machine-readable twin for `scripts/run-vitest.mjs`, which owns the
 *   verdict: a reporter cannot set vitest's exit code, and a gate that scrapes
 *   its own console output breaks the first time someone rewords a line
 *
 * `includeTaskLocation` is on in the config for the line numbers. Without it
 * `TestCase.location` is undefined and this would name a file and no line.
 */
const NOT_PASSED = new Set(["failed"]);

interface Row {
  file: string;
  line: number | null;
  title: string;
  project: string;
  state: string;
}

export default class VitestReconcileReporter implements Reporter {
  onTestRunEnd(testModules: ReadonlyArray<TestModule>): void {
    const rows: Row[] = [];
    const byState = new Map<string, number>();
    const byProject = new Map<string, number>();
    const modules: { file: string; project: string; tests: number }[] = [];
    let collected = 0;

    for (const module of testModules) {
      const file = module.moduleId.replace(`${process.cwd()}/`, "");
      const project = module.project.name ?? "?";
      const entry = { file, project, tests: 0 };
      modules.push(entry);
      for (const test of module.children.allTests() as Iterable<TestCase>) {
        collected += 1;
        entry.tests += 1;
        const state = test.result().state;
        byState.set(state, (byState.get(state) ?? 0) + 1);
        byProject.set(project, (byProject.get(project) ?? 0) + 1);
        if (NOT_PASSED.has(state) || state === "pending") {
          rows.push({
            file,
            line: test.location?.line ?? null,
            title: test.fullName,
            project,
            state,
          });
        }
      }
    }

    const executed = collected - (byState.get("pending") ?? 0);
    const notPassed = rows.length;
    const counts = [...byState.entries()]
      .sort()
      .map(([state, n]) => `${state}=${n}`)
      .join(" ");

    const lines = [
      "",
      "── vitest reconciliation ──────────────────────────────────────────",
      `  files ${testModules.length}   collected ${collected}   executed ${executed}   ${counts}`,
      `  projects: ${[...byProject.entries()].sort().map(([p, n]) => `${p}=${n}`).join("  ")}`,
    ];

    if (notPassed > 0) {
      lines.push(`  ${notPassed} test(s) did not pass — the count above is not a pass.`);
      for (const row of rows.slice(0, 30)) {
        lines.push(
          `    ${row.state.padEnd(8)} ${row.file}${row.line ? `:${row.line}` : ""}  ` +
            `${row.title}  [${row.project}]`,
        );
      }
      if (notPassed > 30) lines.push(`    … and ${notPassed - 30} more`);
    }
    lines.push("───────────────────────────────────────────────────────────────────", "");
    process.stdout.write(lines.join("\n"));

    const jsonPath = process.env.VITEST_RECONCILE_JSON;
    if (jsonPath) {
      writeFileSync(
        jsonPath,
        `${JSON.stringify(
          {
            files: testModules.length,
            collected,
            executed,
            byState: Object.fromEntries(byState),
            byProject: Object.fromEntries(byProject),
            notPassed,
            notPassedTests: rows,
            modules,
          },
          null,
          2,
        )}\n`,
        "utf8",
      );
    }
  }
}
