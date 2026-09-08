import { test, expect } from "@playwright/test";
import { injectAxe, getViolations } from "axe-playwright";
import { gotoFixtureIndex } from "./_nav";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Violations recorded with a cause, ratcheting down only. Not a disabled rule:
 * axe still runs every rule, and anything not on this list fails the gate.
 */
const BASELINE = (
  JSON.parse(
    readFileSync(
      resolve(process.cwd(), "docs/adr/002-unrenderable-keys.json"),
      "utf8",
    ),
  ) as { axeBaseline: Record<string, { count: number }> }
).axeBaseline;

/**
 * The accessibility gate, rebuilt against fixture pages.
 *
 * `validation.accessibility` read PASS for 30 components from four e2e specs —
 * two of them scoped to a single selector, one with a rule disabled — and all
 * four were navigating to `/demo/<name>`, which redirects to the marketing home
 * page. The record described an audit of the home page (E2E-INVENTORY.md).
 *
 * This audits one fixture per component, scoped to `[data-fixture]` so the
 * subject is the component rather than the page around it, with no rule
 * disabled. The roster comes from `/__fixtures`, so a component with fixtures
 * is covered without being added here — and one without fixtures is reported as
 * uncovered rather than silently counted.
 */

/** Impacts that fail the gate. `minor` is reported but not fatal. */
const FATAL = new Set(["critical", "serious", "moderate"]);

interface Finding {
  component: string;
  fixture: string;
  id: string;
  impact: string;
  html: string;
}

test.describe("accessibility", () => {
  // One serial pass over 35 fixture pages, each with an axe injection. Explicit
  // rather than `test.slow()`, which only triples the default and left it
  // failing at 96s under a parallel run.
  test.setTimeout(300_000);

  test("no component fixture has an axe violation", async ({ page }) => {

    await gotoFixtureIndex(page);
    const paths = await page
      .locator("[data-fixture-index] a")
      .evaluateAll((links) =>
        links.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
    expect(paths.length, "the fixture index listed nothing").toBeGreaterThan(0);

    // One fixture per component keeps the run bounded while still touching
    // every component that has any fixture at all. Prefer the labelled variant:
    // auditing a bare form control reports the fixture's missing label as a
    // critical violation, which says nothing about the component.
    const PREFERRED = ["labelled", "with-label", "default"];
    const byComponent = new Map<string, string[]>();
    for (const path of paths) {
      const component = path.split("/")[2];
      byComponent.set(component, [...(byComponent.get(component) ?? []), path]);
    }
    const firstPerComponent = new Map<string, string>();
    for (const [component, candidates] of byComponent) {
      const preferred = PREFERRED.map((name) =>
        candidates.find((p) => p.endsWith(`/${name}`)),
      ).find(Boolean);
      firstPerComponent.set(component, preferred ?? candidates[0]);
    }

    const findings: Finding[] = [];
    const covered: string[] = [];

    for (const [component, path] of firstPerComponent) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // Attached is not painted. axe computes colour contrast from rendered
      // pixels, so auditing a fixture whose open transition is still running
      // measures a half-faded colour against a background that has not landed —
      // which is why `Accordion/focusable-slot` reported a serious
      // color-contrast violation in 2 of 5 sweeps and none of the others. Its
      // settled contrast is 9.12:1. Waiting for the animations makes the answer
      // the same every run, which is the only kind of answer a gate can use.
      // (`visible` is not usable here: several fixtures render a legitimately
      // zero-size wrapper, and waiting for one times out.)
      await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 });
      await page.locator("[data-fixture]").evaluate(
        (el, cap) =>
          new Promise<void>((resolve) => {
            // Capped, and only ever the finite ones: a shimmer runs
            // `animate-pulse` forever, so awaiting every animation's `finished`
            // hangs the audit rather than settling it.
            const finite = el
              .getAnimations({ subtree: true })
              .filter((a) => {
                const timing = a.effect?.getComputedTiming();
                return timing != null && Number.isFinite(timing.endTime ?? Infinity);
              })
              .map((a) => a.finished.catch(() => undefined));
            const timer = setTimeout(resolve, cap);
            void Promise.all(finite).then(() => {
              clearTimeout(timer);
              resolve();
            });
          }),
        800,
      );
      await injectAxe(page);

      const violations = await getViolations(page, "[data-fixture]");
      covered.push(component);
      for (const v of violations) {
        if (!FATAL.has(v.impact ?? "")) continue;
        findings.push({
          component,
          fixture: path.split("/").pop() ?? "",
          id: v.id,
          impact: v.impact ?? "",
          html: v.nodes[0]?.html?.slice(0, 120) ?? "",
        });
      }
    }

    // Printed whether or not the run passes: the count is what
    // validation.accessibility records, and it has to come from the run.
    console.log(
      `AXE_COVERAGE components=${covered.length} violations=${findings.length}`,
    );

    const byId = new Map<string, Finding[]>();
    for (const f of findings) byId.set(f.id, [...(byId.get(f.id) ?? []), f]);

    const unrecorded = findings.filter((f) => !(f.id in BASELINE));
    expect(
      unrecorded.map(
        (f) => `${f.component}/${f.fixture}: ${f.id} (${f.impact}) — ${f.html}`,
      ),
      "axe violations with no recorded cause",
    ).toEqual([]);

    const grown = [...byId.entries()]
      .filter(([id, list]) => list.length > (BASELINE[id]?.count ?? 0))
      .map(([id, list]) => `${id}: ${list.length} > recorded ${BASELINE[id]?.count}`);
    expect(grown, "a recorded violation spread further").toEqual([]);

    const gone = Object.entries(BASELINE)
      .filter(([id, entry]) => (byId.get(id)?.length ?? 0) < entry.count)
      .map(([id, entry]) => `${id}: ${byId.get(id)?.length ?? 0} < recorded ${entry.count} — ratchet it down`);
    expect(gone, "the baseline is stale").toEqual([]);
  });
});
