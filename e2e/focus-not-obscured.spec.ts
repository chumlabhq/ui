import { expect, test } from "@playwright/test";
import { gotoFixtureIndex } from "./_nav";
import { focusFindings } from "./_clip";

/**
 * SC 2.4.11 Focus Not Obscured (Minimum), AA in WCAG 2.2. axe ships no rule for
 * it, so a green axe run is not evidence and this is the only thing asserting it.
 *
 * IT MUST FOCUS. A static rect comparison — is this element's box inside its
 * clipping ancestor's box — reports failures that do not exist, and I wrote that
 * version first: it found ten remove controls "entirely outside" a clipped chip
 * strip and called it a 2.4.11 failure. It is not. `overflow: hidden` is still
 * programmatically scrollable, and the browser scrolls it on focus — focusing
 * the last of those controls moved `scrollLeft` 0 to 744 and left it fully
 * visible. The criterion is about what happens WHEN the element receives focus,
 * so the check has to put focus there and look afterwards.
 *
 * The distinction that makes the plant work: `overflow: hidden` scrolls on
 * focus, `overflow: clip` does not. Planting `clip` on a strip is what proves
 * this gate can fail; planting `hidden` proves nothing, because `hidden`
 * behaves correctly.
 */
test("focus is never entirely obscured by a clipping ancestor", async ({ page }) => {
  test.setTimeout(1_800_000);
  await gotoFixtureIndex(page);
  const paths = await page.locator("[data-fixture-index] li a").evaluateAll((els) =>
    els.map((e) => new URL((e as HTMLAnchorElement).href).pathname),
  );

  let withClipper = 0;
  let focused = 0;
  const obscured: string[] = [];

  for (const path of paths) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.locator("[data-fixture]").waitFor({ state: "attached", timeout: 15000 }).catch(() => {});
    const r = await focusFindings(page);
    if (r.n > 0) withClipper += 1;
    focused += r.n;
    for (const b of r.bad) obscured.push(`${path.replace("/__fixtures/", "")}: ${b}`);
  }

  console.log(`FOCUS_OBSCURED fixturesWithClipper=${withClipper} focused=${focused} obscured=${obscured.length}`);
  /**
   * The findings go to stdout, not only into the assertion's diff.
   *
   * This failed twice under full parallel load and passed three times alone,
   * and both times the only thing that survived was the test name and a line
   * number: playwright's `test-results/` artefacts — the screenshot, the video,
   * the error context naming the element — were deleted by the next run before
   * anyone read them. A gate whose failure cannot be read after the fact is a
   * gate that gets re-run instead of diagnosed.
   */
  for (const o of [...new Set(obscured)]) console.log(`FOCUS_OBSCURED_FINDING ${o}`);
  /**
   * A walk that found no clipping ancestors is not a pass.
   *
   * The floor is 50 against a measured 78, 78 and 77 over three runs. It read
   * 104 until the scope was fixed, and that figure counted the index nav and
   * the page chrome on every fixture page, because five of the six focusable
   * clauses were never scoped to anything — so the fall to 77-78 is the gate
   * measuring the library instead of the harness, not coverage lost. The floor
   * is well below the measurement because the count moves by one between runs:
   * a fixture whose overlay is still opening contributes no focusable child
   * yet. That is a reason to keep the assertion a floor rather than an
   * equality, not a number to chase.
   */
  expect(withClipper, "no fixture had a focusable child inside a clipping ancestor").toBeGreaterThan(50);
  expect(
    [...new Set(obscured)],
    "these are entirely outside their clipping ancestor AFTER taking focus — a " +
      "keyboard user lands somewhere invisible with no way to bring it into view",
  ).toEqual([]);
});

/**
 * The self-check, and it has to build its own case.
 *
 * No fixture in the library has a clipping ancestor that actually overflows
 * around focusable children — measured, across all of them — so there is
 * nothing to plant on. Flipping a real component's `overflow` to `clip` does
 * not reproduce it either: with nothing pushed past the edge there is nothing
 * to obscure. Both halves are asserted here so the gate is provable rather than
 * merely green, and so the `hidden` vs `clip` difference is demonstrated rather
 * than only described above.
 */
test("the check notices an obscured focus, and clears a scrollable one", async ({ page }) => {
  await page.goto("/__fixtures", { waitUntil: "domcontentloaded" });

  const result = await page.evaluate(() => {
    const measure = (overflow: string) => {
      const host = document.createElement("div");
      host.setAttribute("data-fixture", "");
      host.style.cssText = "position:fixed;top:0;left:0;width:100px;height:40px";
      const strip = document.createElement("div");
      strip.style.cssText = `width:100px;height:40px;overflow:${overflow};white-space:nowrap`;
      for (let i = 0; i < 12; i++) {
        const b = document.createElement("button");
        b.textContent = `button ${i}`;
        b.style.cssText = "display:inline-block;width:80px";
        strip.appendChild(b);
      }
      host.appendChild(strip);
      document.body.appendChild(host);
      const last = strip.lastElementChild as HTMLElement;
      last.focus();
      const a = last.getBoundingClientRect();
      const c = strip.getBoundingClientRect();
      const visible =
        Math.min(a.right, c.right) - Math.max(a.left, c.left) > 0 &&
        Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > 0;
      const scrolled = strip.scrollLeft;
      host.remove();
      return { visible, scrolled };
    };
    return { clip: measure("clip"), hidden: measure("hidden") };
  });

  // `clip` cannot scroll, so focus lands somewhere entirely invisible.
  expect(result.clip.visible, "overflow:clip should leave the focused control obscured").toBe(false);
  expect(result.clip.scrolled).toBe(0);
  // `hidden` scrolls on focus, which is why the static version of this check
  // reported a failure that did not exist.
  expect(result.hidden.visible, "overflow:hidden should scroll the focused control into view").toBe(true);
  expect(result.hidden.scrolled).toBeGreaterThan(0);
});

/**
 * The plant for the predicate and the scope, which is the half that was missing.
 *
 * The self-check above proves the `clip` vs `hidden` distinction by measuring
 * rects directly; it never calls `clipAncestor` and never builds the selector,
 * so the two rules that decide WHAT gets measured and WHICH ancestor it is
 * measured against had no plant at all. Both were wrong and the gate reported
 * it as an intermittent failure three times. Every case here goes through
 * `focusFindings`, the same export the walk uses, and each one is written so
 * that reverting its fix turns this red.
 */
test("the clipping-ancestor rule and the scope both hold", async ({ page }) => {
  await page.goto("/__fixtures", { waitUntil: "domcontentloaded" });

  const strip = (overflow: string) => `width:100px;height:40px;overflow:${overflow};white-space:nowrap`;

  const plant = (kind: "clipped" | "scrollable" | "fixed-escape" | "stray" | "portal") =>
    page.evaluate(
      ({ k, stripClip, stripHidden }) => {
        for (const stale of document.querySelectorAll("[data-clip-plant]")) stale.remove();
        document.body.style.overflow = "";
        document.body.style.height = "";

        const host = document.createElement("div");
        host.setAttribute("data-clip-plant", "");
        const fill = (into: HTMLElement) => {
          for (let i = 0; i < 12; i++) {
            const b = document.createElement("button");
            b.textContent = `button ${i}`;
            b.style.cssText = "display:inline-block;width:80px";
            into.appendChild(b);
          }
        };

        if (k === "stray") {
          // Not in a fixture and not in a portal. The old selector scoped only
          // its first clause, so a button anywhere on the page was in the
          // population; this must now contribute nothing.
          host.style.cssText = stripClip;
          fill(host);
          document.body.appendChild(host);
          return;
        }

        if (k === "portal") {
          // A portal root is identified by React's own key, so the plant carries
          // one rather than setting the mark itself — `markPortalRoots` clears
          // stale marks before it re-applies them, and a hand-set attribute
          // would be wiped before it was read.
          (host as unknown as Record<string, unknown>).__reactFiber$plant = {};
          host.style.cssText = "position:fixed;top:0;left:0";
          const inner = document.createElement("div");
          inner.style.cssText = stripClip;
          fill(inner);
          host.appendChild(inner);
          document.body.appendChild(host);
          return;
        }

        host.setAttribute("data-fixture", "plant");
        host.style.cssText = "position:absolute;top:0;left:0;width:100px;height:40px";

        if (k === "fixed-escape") {
          // A `position: fixed` element under a static clipping wrapper. CSS
          // does not clip it; the walk used to say it did.
          const wrapper = document.createElement("div");
          wrapper.style.cssText = stripHidden;
          const panel = document.createElement("div");
          panel.style.cssText = "position:fixed;top:300px;left:0;width:100px;height:40px";
          fill(panel);
          wrapper.appendChild(panel);
          host.appendChild(wrapper);
          document.body.appendChild(host);
          return;
        }

        const inner = document.createElement("div");
        inner.style.cssText = k === "clipped" ? stripClip : stripHidden;
        fill(inner);
        host.appendChild(inner);
        document.body.appendChild(host);
      },
      { k: kind, stripClip: strip("clip"), stripHidden: strip("hidden") },
    );

  const reset = () =>
    page.evaluate(() => {
      for (const stale of document.querySelectorAll("[data-clip-plant]")) stale.remove();
      document.body.style.overflow = "";
      document.body.style.height = "";
    });

  const run = async (kind: Parameters<typeof plant>[0]) => {
    await plant(kind);
    const r = await focusFindings(page);
    await reset();
    return r;
  };

  const clipped = await run("clipped");
  const scrollable = await run("scrollable");
  const escaped = await run("fixed-escape");
  const stray = await run("stray");
  const portal = await run("portal");

  // `overflow: clip` cannot scroll, so the last control is genuinely obscured:
  // the walk must find the strip AND report it.
  expect(clipped.n, "the clipped strip is a clipping ancestor and must be walked into").toBeGreaterThan(0);
  expect(clipped.bad.length, "overflow:clip leaves the focused control obscured").toBeGreaterThan(0);

  // Same geometry, `hidden` instead: found, focused, and correctly not reported.
  expect(scrollable.n).toBeGreaterThan(0);
  expect(scrollable.bad, "overflow:hidden scrolls on focus and is not a 2.4.11 failure").toEqual([]);

  // Remove the `position: fixed` stop in `_clip.ts` and this reports 12.
  expect(escaped.bad, "a fixed element is not clipped by a static ancestor's overflow").toEqual([]);

  // Put the selector list back behind one prefix and this counts 12.
  expect(stray.n, "a control in neither a fixture nor a portal is out of scope").toBe(0);

  // Drop the portal root from the scope and this counts 0 — which is the state
  // the gate was in for every overlay the library has.
  expect(portal.n, "a portalled control is in scope").toBeGreaterThan(0);
  expect(portal.bad.length, "and is measured against its real clipping ancestor").toBeGreaterThan(0);
});
