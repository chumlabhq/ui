import { test, expect } from "@playwright/test";
import { injectAxe, getViolations } from "axe-playwright";
import { gotoGuarded } from "./_nav";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Which fixture may carry which rule, recorded with a reason and ratcheting
 * down only. Per-fixture, not per-rule: a rule waived across the board would
 * have hidden Avatar/with-status, which is the finding this sweep exists for.
 */
const WAIVERS_PATH = resolve(process.cwd(), "docs/adr/002-unrenderable-keys.json");

interface Waivers {
  axeFixtureExpectations: Record<string, { reason: string; fixtures: string[] }>;
  axeExpectationsDerivedFrom: { fixtures: number; recordedOn: string };
}

const waivers = JSON.parse(readFileSync(WAIVERS_PATH, "utf8")) as Waivers;
const EXPECTED = waivers.axeFixtureExpectations;
const DERIVED_FROM = waivers.axeExpectationsDerivedFrom;

/**
 * Re-derive instead of asserting: `A11Y_RERECORD=1 npm run test:e2e:a11y`.
 *
 * Two rules keep this from being a rubber stamp, and they are the difference
 * between re-deriving and blessing:
 *
 * - A finding whose **rule** has no recorded reason is never accepted. The
 *   reason is the human judgement; only the fixture list is mechanical.
 * - A finding whose **component** is not already listed under that rule is
 *   never accepted either. `Checkbox/reduce-motion-forced` is a second fixture
 *   of a component already waived for `label`; a new component that starts
 *   reporting `label` is a new defect and has to be looked at.
 */
const RERECORD = process.env.A11Y_RERECORD === "1";

/**
 * Every fixture of every component, not one per component.
 *
 * accessibility.spec.ts audits one fixture per component and prefers the one
 * named `default`. That is why Avatar's `with-status` shipped with a bare
 * `<span aria-label>` — ARIA prohibits `aria-label` on the implicit `generic`
 * role, so the status was announced to nobody, and no run ever rendered the
 * fixture that showed it (E2E-TRIAGE.md Appendix B).
 *
 * One fixture per component answers "does this component have a violation in
 * the state we happened to pick". This answers the question the record claims.
 *
 * Minutes long, so it is its own project: `--project=a11y-full`. Nothing else
 * runs it.
 */

/** Impacts that count. `minor` is recorded but does not fail the gate. */
const FATAL = new Set(["critical", "serious", "moderate"]);

interface Finding {
  component: string;
  fixture: string;
  id: string;
  impact: string;
  target: string;
  html: string;
}

test.describe("accessibility (full sweep)", () => {
  test.setTimeout(30 * 60_000);

  test("audits every fixture", async ({ page }) => {
    const started = Date.now();

    await gotoGuarded(page, "/__fixtures", "[data-fixture-index]");
    const paths = await page
      .locator("[data-fixture-index] a")
      .evaluateAll((links) =>
        links.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
    expect(paths.length, "the fixture index listed nothing").toBeGreaterThan(200);

    const findings: Finding[] = [];
    const components = new Set<string>();
    let audited = 0;

    for (const path of paths) {
      const [, , component, fixture] = path.split("/");
      components.add(component);

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

      // Scoped to the fixture, so the harness page's own markup is not the
      // subject — the mistake tabpanel.spec.ts made by passing `undefined`.
      const violations = await getViolations(page, "[data-fixture]");
      audited += 1;

      for (const v of violations) {
        if (!FATAL.has(v.impact ?? "")) continue;
        for (const node of v.nodes) {
          findings.push({
            component,
            fixture,
            id: v.id,
            impact: v.impact ?? "",
            target: String(node.target[0] ?? "").slice(0, 120),
            html: node.html.replace(/\s+/g, " ").slice(0, 160),
          });
        }
      }
    }

    const seconds = Math.round((Date.now() - started) / 1000);

    // Written to disk as well as logged: ai/system-state.json's accessibility
    // record is rebuilt from this, and a record built from a scrollback is the
    // kind that outlives its run.
    writeFileSync(
      resolve(process.cwd(), "e2e/.a11y-full-report.json"),
      JSON.stringify(
        {
          ranAt: new Date().toISOString(),
          seconds,
          fixturesAudited: audited,
          componentsCovered: components.size,
          findings,
        },
        null,
        2,
      ),
      "utf8",
    );

    console.log(
      `AXE_FULL fixtures=${audited} components=${components.size} ` +
        `violations=${findings.length} seconds=${seconds}`,
    );
    for (const f of findings) {
      console.log(
        `AXE_FINDING ${f.component}/${f.fixture} ${f.id} (${f.impact}) ${f.target} :: ${f.html}`,
      );
    }

    expect(audited, "no fixture was audited").toBeGreaterThan(200);

    const key = (f: Finding) => `${f.component}/${f.fixture}`;

    if (RERECORD) {
      let accepted = 0;
      const refused: string[] = [];
      for (const finding of findings) {
        const entry = EXPECTED[finding.id];
        if (!entry) {
          refused.push(`${key(finding)}: ${finding.id} — no recorded reason for this rule`);
          continue;
        }
        const components = new Set(entry.fixtures.map((fx) => fx.split("/")[0]));
        if (!components.has(finding.component)) {
          refused.push(`${key(finding)}: ${finding.id} — ${finding.component} is not already waived for it`);
          continue;
        }
        if (!entry.fixtures.includes(key(finding))) accepted += 1;
      }
      for (const rule of Object.keys(EXPECTED)) {
        const components = new Set(EXPECTED[rule].fixtures.map((fx) => fx.split("/")[0]));
        // Derived from this run, not merged into what was there: an entry that
        // stopped reporting has to disappear, or the list only ever grows.
        EXPECTED[rule].fixtures = [
          ...new Set(
            findings
              .filter((f) => f.id === rule && components.has(f.component))
              .map(key),
          ),
        ].sort();
      }
      waivers.axeExpectationsDerivedFrom = {
        fixtures: audited,
        recordedOn: new Date().toISOString().slice(0, 10),
      };
      // `JSON.stringify(x, null, 2)` is the file's canonical form and it round
      // trips byte-for-byte, so a re-record produces no diff beyond the fixture
      // lists. It did once: the file had been written by an older tool that
      // escaped non-ASCII, and the first re-record normalised 29 `\u2014`
      // sequences to literal em-dashes across the whole file. That
      // normalisation is committed; do not escape them again.
      writeFileSync(WAIVERS_PATH, `${JSON.stringify(waivers, null, 2)}\n`, "utf8");
      console.log(
        `AXE_RERECORDED ${accepted} newly listed, ${refused.length} refused, ` +
          `derived from ${audited} fixtures`,
      );
      for (const line of refused) console.log(`AXE_REFUSED ${line}`);
      expect(refused, "these findings cannot be re-derived — they need a decision, not a record").toEqual([]);
      return;
    }

    /**
     * The list was derived against a fixture count. If the count has moved, the
     * list describes a different suite — which is exactly how four findings on
     * fixtures added after it was written came to read as unrecorded defects.
     * Same shape as the dist fingerprint in assert-dist-records.mjs.
     */
    expect(
      audited,
      `the axe expectation list was derived from ${DERIVED_FROM.fixtures} fixtures ` +
        `(${DERIVED_FROM.recordedOn}) and this run audited ${audited}. The list ` +
        "describes a suite that no longer exists — re-derive it with " +
        "`A11Y_RERECORD=1 npm run test:e2e:a11y` and read what it refuses.",
    ).toBe(DERIVED_FROM.fixtures);

    const unexpected = findings
      .filter((f) => !(EXPECTED[f.id]?.fixtures ?? []).includes(key(f)))
      .map((f) => `${key(f)}: ${f.id} (${f.impact}) ${f.target} :: ${f.html}`);
    expect(
      [...new Set(unexpected)],
      "axe findings on fixtures with no recorded expectation — fix them, or record a reason in docs/adr/002-unrenderable-keys.json",
    ).toEqual([]);

    // The other direction, and the half that keeps the list honest: an entry
    // that no longer reports has been fixed, and leaving it listed would let
    // the next regression in for free.
    const seen = new Set(findings.map((f) => `${f.id}\u0000${key(f)}`));
    const stale = Object.entries(EXPECTED).flatMap(([rule, entry]) =>
      entry.fixtures
        .filter((fx) => !seen.has(`${rule}\u0000${fx}`))
        .map((fx) => `${rule} on ${fx} no longer reports — remove it`),
    );
    expect(stale, "the expectation list is stale").toEqual([]);
  });
});
