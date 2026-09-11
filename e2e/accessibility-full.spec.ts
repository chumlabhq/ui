import { test, expect } from "@playwright/test";
import { injectAxe, getViolations } from "axe-playwright";
import { gotoFixture, gotoFixtureIndex } from "./_nav";
import { markPortalRoots, PORTAL_MARK } from "./_portals.js";
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
  axeExpectationsDerivedFrom: { fixtures: string[]; recordedOn: string };
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
/**
 * The conformance level this library claims, stated rather than inherited.
 *
 * `getViolations` with no options runs axe's default rule set, which is a
 * decision the tool made — every other number in this repo is set to WCAG 2.2
 * AA and this was the one standing in for it. `best-practice` is deliberately
 * NOT here: those are axe's own opinions, not success criteria, and mixing them
 * into a conformance claim makes the claim unreadable.
 */
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
/**
 * No rule is disabled. `target-size` (SC 2.5.8, new in 2.2) reported 17 times
 * when the tag set was first authored — chip remove controls in both
 * multiselects, and Table's row select, expand, group-toggle, drag handle and
 * search clear, all under the 24x24 minimum. They were brought to the floor
 * rather than waived; where 24px would have distorted a chip, the hit area
 * exceeds the visual box by a negative margin. If a rule is ever turned off
 * here it needs the reason beside it, not just the line.
 */
const AXE_OPTIONS = { runOnly: { type: "tag" as const, values: AXE_TAGS } };

const FATAL = new Set(["critical", "serious", "moderate"]);

/**
 * The audit covers the fixture AND whatever the fixture portalled out of it.
 *
 * Scoping to `[data-fixture]` alone meant axe had never audited a portalled
 * surface. `_portals.ts` carries the marking and the reasoning; auditing the
 * whole document instead would drag in the harness page's own chrome, and with
 * it a class of finding that is about the page rather than the component.
 */
/**
 * `region` does not appear in these results, and it is not being suppressed.
 *
 * A body-level portal is outside this page's `<main>` by construction, so
 * "all page content should be contained by landmarks" fires on every surface
 * when axe is given a whole-document context — 36 of them, in the survey that
 * found this scope hole. Given an `include` list it reports the rule
 * inapplicable instead: the check is about the document's landmark structure,
 * which is the consumer's to compose, not the component's. Verified both ways
 * on `Dropdown/open`; nothing is disabled here, so a portal that ever does
 * report it would still be reported.
 */

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

    await gotoFixtureIndex(page);
    const paths = await page
      .locator("[data-fixture-index] a")
      .evaluateAll((links) =>
        links.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
    expect(paths.length, "the fixture index listed nothing").toBeGreaterThan(200);

    const findings: Finding[] = [];
    const components = new Set<string>();
    let audited = 0;
    const auditedFixtures: string[] = [];
    let portalled = 0;
    const actFailures: string[] = [];

    for (const path of paths) {
      const [, , component, fixture] = path.split("/");
      components.add(component);

      await page.goto(path, { waitUntil: "domcontentloaded" });
      // The fixture's `act` has to have landed, or the audit is of a state the
      // fixture is named for and has not reached yet. This waited on the
      // animation settle alone, which took ~830 ms and covered the act by
      // accident; measured against the acts' own timings, 12 of the 50 were
      // audited while the act was still pending and the other 38 passed on that
      // coincidence. Requiring the element as well as the status: a fixture
      // that has not mounted has no `main` at all, and reading through the
      // absence reports every slow fixture as ready.
      const actStatus = await page
        .waitForFunction(
          () => {
            const reported = document
              .querySelector("main[data-fixture-act]")
              ?.getAttribute("data-fixture-act");
            return reported && reported !== "pending" ? reported : null;
          },
          undefined,
          { timeout: 20000 },
        )
        .then((handle) => handle.jsonValue() as Promise<string>)
        .catch(() => "never settled");
      if (actStatus.startsWith("error") || actStatus === "never settled") {
        actFailures.push(`${component}/${fixture}: ${actStatus}`);
      }
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

      // Scoped to the fixture and its portals, so the harness page's own markup
      // is not the subject — the mistake tabpanel.spec.ts made by passing
      // `undefined` — while the surfaces the fixture opens still are.
      const portals = await markPortalRoots(page);
      portalled += portals > 0 ? 1 : 0;
      const include = [["[data-fixture]"], ...(portals > 0 ? [[`[${PORTAL_MARK}]`]] : [])];
      // Conditional because axe throws on an `include` selector that matches
      // nothing, and most fixtures portal nothing.
      const violations = await getViolations(page, { include }, AXE_OPTIONS);
      audited += 1;
      auditedFixtures.push(path.replace("/__fixtures/", ""));

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
          fixturesWithPortals: portalled,
          componentsCovered: components.size,
          findings,
        },
        null,
        2,
      ),
      "utf8",
    );

    console.log(
      `AXE_FULL fixtures=${audited} portalled=${portalled} ` +
        `components=${components.size} violations=${findings.length} seconds=${seconds}`,
    );
    for (const f of findings) {
      console.log(
        `AXE_FINDING ${f.component}/${f.fixture} ${f.id} (${f.impact}) ${f.target} :: ${f.html}`,
      );
    }

    expect(audited, "no fixture was audited").toBeGreaterThan(200);

    // Before anything is derived from this run: a fixture whose act threw is
    // not in the state its name claims, and a record built from it would be a
    // record of the wrong page.
    expect(actFailures, "these fixtures never reached their acted state").toEqual([]);

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
      // Re-read before writing. `contrast-painted` re-records into this same
      // file and the two specs run concurrently, so writing the copy read at
      // import time restores whatever the other spec had just written. That is
      // not hypothetical: the first per-fixture re-record of both lists left
      // contrast's still holding a bare count, because this write landed last
      // and put the stale value back.
      const onDisk = JSON.parse(readFileSync(WAIVERS_PATH, "utf8")) as Waivers;
      onDisk.axeFixtureExpectations = waivers.axeFixtureExpectations;
      onDisk.axeExpectationsDerivedFrom = {
        fixtures: [...auditedFixtures].sort(),
        recordedOn: new Date().toISOString().slice(0, 10),
      };
      // `JSON.stringify(x, null, 2)` is the file's canonical form and it round
      // trips byte-for-byte, so a re-record produces no diff beyond the fixture
      // lists. It did once: the file had been written by an older tool that
      // escaped non-ASCII, and the first re-record normalised 29 `\u2014`
      // sequences to literal em-dashes across the whole file. That
      // normalisation is committed; do not escape them again.
      writeFileSync(WAIVERS_PATH, `${JSON.stringify(onDisk, null, 2)}\n`, "utf8");
      console.log(
        `AXE_RERECORDED ${accepted} newly listed, ${refused.length} refused, ` +
          `derived from ${audited} fixtures`,
      );
      for (const line of refused) console.log(`AXE_REFUSED ${line}`);
      expect(refused, "these findings cannot be re-derived — they need a decision, not a record").toEqual([]);
      return;
    }

    /**
     * Keyed per fixture, not by a total.
     *
     * It was a count, and a count makes every fixture's verdict depend on every
     * other fixture's existence: adding two TabPanel fixtures invalidated a
     * record covering 429 unrelated ones and forced a full re-derive that
     * changed nothing else. A fixture's verdict belongs to that fixture.
     *
     * So the question is only whether the list still describes fixtures that
     * exist. A fixture it names that has since gone is a stale entry and has to
     * be re-derived; a fixture that is new is simply not in the list yet, and
     * its findings are caught by the unexpected check below like any other.
     * Adding a fixture adds an entry rather than invalidating the set.
     */
    const auditedNow = new Set(auditedFixtures);
    // Tolerates the old numeric form so a run before the first re-derive says
    // what to do rather than throwing on `.filter`.
    const recordedFixtures = Array.isArray(DERIVED_FROM.fixtures) ? DERIVED_FROM.fixtures : [];
    const vanished = recordedFixtures.filter((f) => !auditedNow.has(f));
    expect(
      vanished,
      `the axe expectation list names ${vanished.length} fixture(s) that no longer exist ` +
        `(recorded ${DERIVED_FROM.recordedOn}). Re-derive it with ` +
        "`A11Y_RERECORD=1 npm run test:e2e:a11y` and read what it refuses.",
    ).toEqual([]);

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

  /**
   * The self-check for the scope, planted rather than argued.
   *
   * A sweep pointed at the wrong subtree reports nothing and looks identical to
   * a sweep that found nothing, which is how the old scope survived a year of
   * green runs. This plants a violation axe cannot miss inside a real portal
   * and requires both halves: the widened scope reports it, and the scope this
   * replaced does not.
   */
  test("the audit reaches inside a portal", async ({ page }) => {
    await gotoFixture(page, "Dropdown", "open");
    await page.locator("[role='listbox']").waitFor({ state: "attached" });
    await injectAxe(page);

    expect(await markPortalRoots(page), "the fixture portalled nothing to plant into").toBe(1);
    await page.evaluate((attribute) => {
      const input = document.createElement("input");
      input.type = "text";
      document.querySelector(`[${attribute}]`)?.append(input);
    }, PORTAL_MARK);

    const widened = await getViolations(page, {
      include: [["[data-fixture]"], [`[${PORTAL_MARK}]`]],
    });
    expect(
      widened.map((v) => v.id),
      "the planted unlabelled input inside the portal was not reported",
    ).toContain("label");

    const subtreeOnly = await getViolations(page, "[data-fixture]");
    expect(
      subtreeOnly.map((v) => v.id),
      "the old scope reported it too — this plant proves nothing",
    ).not.toContain("label");
  });
});
