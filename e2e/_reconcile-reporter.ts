import { writeFileSync } from "node:fs";
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

/**
 * Reconciles the tests Playwright collected against the tests it actually ran.
 *
 * Three e2e projects — firefox, webkit and Mobile Safari — had no browser
 * binary installed, so every test in them failed at launch. That is 3 of 5
 * projects and roughly 1191 of 1986 tests, and it went unnoticed for the whole
 * branch, because the `list` reporter prints `N failed` *before* the failure
 * list and `N passed` *last*. Reading the tail of the output showed the end of
 * the failure list followed by a passing count, which looks exactly like a
 * clean run. Piping through `tail` also replaces Playwright's exit code with
 * `tail`'s, which is always 0.
 *
 * So the runner was never wrong. The summary is simply not safe to read from
 * its last few lines, and nothing forced the two numbers to agree.
 *
 * This makes them agree, in one line, at the very end of the output:
 *
 * - every collected test must reach a terminal status
 * - a skip must carry a reason, so a quietly dropped test cannot masquerade as
 *   a deliberate one
 * - the run fails if the two counts diverge, whatever the tests themselves did
 *
 * It reports rather than replaces: pair it with `list` or `line`.
 */
/** The three terminal statuses that are not a pass. */
const NOT_PASSED = new Set(["failed", "timedOut", "interrupted"]);

interface Row {
  title: string;
  project: string;
  status: string;
  /** `e2e/visual.spec.ts:509`, so a non-pass can be opened rather than hunted. */
  where: string;
}

export default class ReconcileReporter implements Reporter {
  private collected = 0;
  private readonly seen = new Map<string, Row>();
  private readonly byStatus = new Map<string, number>();
  private readonly unexplainedSkips: string[] = [];

  private static id(test: TestCase): string {
    return `${test.titlePath().join(" › ")}`;
  }

  onBegin(_config: FullConfig, suite: Suite): void {
    this.collected = suite.allTests().length;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const project = test.parent.project()?.name ?? "?";
    const file = test.location.file.replace(`${process.cwd()}/`, "");
    this.seen.set(ReconcileReporter.id(test), {
      title: test.title,
      project,
      status: result.status,
      where: `${file}:${test.location.line}`,
    });
    this.byStatus.set(result.status, (this.byStatus.get(result.status) ?? 0) + 1);

    // `test.skip()` with no argument, and a `skip` annotation with no
    // description, both produce a test nobody has to justify. Those are the
    // ones that vanish quietly.
    if (result.status === "skipped") {
      const reason = test.annotations.find((a) => a.type === "skip" || a.type === "fixme")
        ?.description;
      if (!reason?.trim()) {
        this.unexplainedSkips.push(`${project} › ${ReconcileReporter.id(test)}`);
      }
    }
  }

  async onEnd(result: FullResult): Promise<{ status: FullResult["status"] } | void> {
    const executed = this.seen.size;
    const counts = [...this.byStatus.entries()]
      .sort()
      .map(([status, n]) => `${status}=${n}`)
      .join(" ");

    const byProject = new Map<string, number>();
    for (const row of this.seen.values()) {
      byProject.set(row.project, (byProject.get(row.project) ?? 0) + 1);
    }

    const bad =
      (this.byStatus.get("failed") ?? 0) +
      (this.byStatus.get("timedOut") ?? 0) +
      (this.byStatus.get("interrupted") ?? 0);

    const lines = [
      "",
      "── e2e reconciliation ─────────────────────────────────────────────",
      `  collected ${this.collected}   executed ${executed}   ${counts}`,
      `  projects: ${[...byProject.entries()]
        .sort()
        .map(([p, n]) => `${p}=${n}`)
        .join("  ")}`,
    ];

    let failed = false;

    // A run that collected nothing is not a clean run. Playwright exits 1 on
    // "No tests found", but a filter that silently matches fewer tests than
    // intended exits 0 — and a gate that reports success on an empty set is
    // exactly the way a suite stops being a gate.
    if (this.collected === 0) {
      failed = true;
      lines.push(
        "  COLLECTED NOTHING. A filter that matches no test is not a pass;",
        "  check the --project, --grep or file arguments.",
      );
    }

    // The outcome is restated here because this is the last line of the run:
    // `list` puts `N failed` above its failure list and `N passed` at the
    // bottom, so the tail of a failing run reads like a passing one.
    //
    // Each one is NAMED. "timedOut=1" cost two full suite re-runs to answer
    // once, and the second run cleaned up `test-results/` before the first
    // could be read. The location was in this reporter all along.
    const notPassedTests = [...this.seen.values()]
      .filter((row) => NOT_PASSED.has(row.status))
      .map((row) => ({ ...row }));

    if (bad > 0) {
      failed = true;
      lines.push(`  ${bad} test(s) did not pass — the count above is not a pass.`);
      for (const row of notPassedTests.slice(0, 30)) {
        lines.push(`    ${row.status.padEnd(11)} ${row.where}  ${row.title}  [${row.project}]`);
      }
      if (notPassedTests.length > 30) {
        lines.push(`    … and ${notPassedTests.length - 30} more`);
      }
    }

    const emptyProjects = [...byProject.entries()].filter(([, n]) => n === 0);
    if (emptyProjects.length > 0) {
      failed = true;
      lines.push(
        `  project(s) that ran nothing: ${emptyProjects.map(([p]) => p).join(", ")}`,
      );
    }

    if (executed !== this.collected) {
      failed = true;
      lines.push(
        `  MISSING ${this.collected - executed} collected test(s) never reported a result.`,
        "  A test that is collected and never runs is not a pass. Common causes:",
        "  a browser binary that is not installed, a worker that died, or the run",
        "  being interrupted.",
      );
    }

    if (this.unexplainedSkips.length > 0) {
      failed = true;
      lines.push(
        `  ${this.unexplainedSkips.length} skip(s) with no reason:`,
        ...this.unexplainedSkips.slice(0, 20).map((s) => `    ${s}`),
      );
    }

    lines.push(
      failed
        ? "  RESULT: FAILED"
        : "  RESULT: every collected test ran and passed",
      "───────────────────────────────────────────────────────────────────",
      "",
    );
    process.stdout.write(lines.join("\n"));

    // Machine-readable twin of the block above, for the matrix runner. It reads
    // this rather than parsing the printed summary: a gate that scrapes its own
    // console output breaks the first time someone rewords a line.
    const jsonPath = process.env.E2E_RECONCILE_JSON;
    if (jsonPath) {
      writeFileSync(
        jsonPath,
        JSON.stringify(
          {
            collected: this.collected,
            executed,
            byStatus: Object.fromEntries(this.byStatus),
            byProject: Object.fromEntries(byProject),
            unexplainedSkips: this.unexplainedSkips,
            notPassed: bad,
            notPassedTests,
            reconciled: !failed,
            playwrightStatus: result.status,
          },
          null,
          2,
        ),
        "utf8",
      );
    }

    if (failed && result.status === "passed") return { status: "failed" };
  }
}
