import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
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
    const where = `${file}:${test.location.line}`;
    this.seen.set(ReconcileReporter.id(test), {
      title: test.title,
      project,
      status: result.status,
      where,
    });
    if (NOT_PASSED.has(result.status)) {
      this.persistFailure(test, result, project, where);
    }
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

  /**
   * Write the reason next to the screenshot, the moment the test ends.
   *
   * Playwright already saves `test-failed-1.png` and `video.webm` per failure,
   * but the message only ever reached the runner's stdout — so a killed matrix
   * left a directory full of artifacts and nothing saying what went wrong. That
   * has now cost three re-runs on this branch. `onEnd` is too late: it does not
   * run when the process is killed. This writes per test, as each one finishes.
   */
  private persistFailure(
    test: TestCase,
    result: TestResult,
    project: string,
    where: string,
  ): void {
    // The stack already opens with the message, and Playwright colours both.
    // Neither is useful in a file read six hours later on a different machine.
    // Built rather than written as a literal: ESLint's no-control-regex fails
    // on an ESC byte inside a regex literal, and disabling the rule to keep one
    // would be the wrong trade for a string this easy to construct.
    const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
    const plain = (text: string) => text.replace(ANSI, "");
    const errors = (result.errors?.length ? result.errors : result.error ? [result.error] : [])
      .map((e) => plain(e.stack ?? e.message ?? "").trim())
      .filter(Boolean);

    const body = [
      `# ${result.status}: ${test.title}`,
      "",
      `- project: ${project}`,
      `- location: ${where}`,
      `- attempt: ${result.retry + 1}`,
      `- duration: ${result.duration}ms`,
      "",
      errors.length ? errors.join("\n\n---\n\n") : "(no error attached — a timeout or a crash)",
      "",
    ].join("\n");

    // Beside the artifacts when there are any; Playwright puts them all in the
    // test's own output directory. When there are none — an assertion that
    // never opened a page, a crash before the first screenshot — it still gets
    // its own directory, because "somewhere findable" is the whole point.
    // Only artifacts under `test-results`. A screenshot failure attaches the
    // EXPECTED baseline too, which lives in `<spec>.spec.ts-snapshots/` — and
    // a `failure.md` written there is collected as a test file by the same
    // `testMatch` that collects the spec, so the next run dies at collection
    // with "Unexpected token" on its own report.
    const outputRoot = join(process.cwd(), "test-results");
    const artifact = result.attachments.find(
      (a) => a.path && resolve(a.path).startsWith(outputRoot),
    )?.path;
    const slug = `${project}-${where}-${test.title}`
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120);
    const dir = artifact ? dirname(artifact) : join(process.cwd(), "test-results", slug);
    try {
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "failure.md"), body, "utf8");
    } catch {
      // A directory we cannot write is not worth failing the run over.
    }

    // And one append-only log, so a killed run has a single place to read
    // rather than 23 directories to open.
    try {
      const log = join(process.cwd(), "test-results", "non-passes.log");
      mkdirSync(dirname(log), { recursive: true });
      appendFileSync(
        log,
        `${new Date().toISOString()} ${project} ${result.status} ${where} ${test.title}\n` +
          (errors.length ? `${errors[0].split("\n").slice(0, 4).map((l) => `    ${l}`).join("\n")}\n` : ""),
        "utf8",
      );
    } catch {
      // Same.
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
