import { expect, test } from "./_test";
import { gotoFixture, gotoFixtureIndex } from "./_nav";
import { focusFindings } from "./_clip";
import { clippedFixtures } from "./_clipped-fixtures";

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

  const expected = clippedFixtures();
  const swept: string[] = [];
  let focused = 0;
  const obscured: string[] = [];

  for (const path of paths) {
    const id = path.replace("/__fixtures/", "");
    await page.goto(path, { waitUntil: "domcontentloaded" });
    /**
     * The act, the harness's holds-still answer, and the fonts, before anything
     * is focused.
     *
     * This read each fixture as soon as `[data-fixture]` was attached, and a
     * fixture whose act opens the surface the clipper is in was swept or not by
     * timing: the six CascadingDropdown submenu fixtures, DatePicker's month
     * menu and Table's cell editor were read with their act still pending in
     * 1, 21 and 4 of three Chromium runs, 40 in Firefox and 41 in WebKit, so the
     * population read 95, 94, 95, 90 and 88 (measured 2026-10-17). A fixture
     * with no act reports a terminal act at mount, so the act alone is not
     * enough; `data-fixture-still` is the harness's answer that the document has
     * stopped changing. No catch: a fixture that never settles is named here
     * rather than swept in whatever state it had reached.
     */
    await page
      .waitForFunction(
        () => {
          const main = document.querySelector("main[data-fixture-act]");
          const act = main?.getAttribute("data-fixture-act");
          const still = main?.getAttribute("data-fixture-still");
          return act && act !== "pending" && still && still !== "pending" ? act : null;
        },
        undefined,
        { timeout: 30000 },
      )
      .catch((error: Error) => {
        throw new Error(`${id} never reported a settled act and a still document: ${error.message}`);
      });
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    const r = await focusFindings(page);
    if (r.n > 0) swept.push(id);
    focused += r.n;
    for (const b of r.bad) obscured.push(`${id}: ${b}`);
  }

  console.log(
    `FOCUS_OBSCURED fixtures ${swept.length} (expected ${expected.length}), focused ${focused}, obscured ${obscured.length}`,
  );
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
   * A walk that missed a fixture is not a pass.
   *
   * The floor was a count, 50, against what the sweep itself found, so a
   * fixture read before its surface opened lowered the measurement and nothing
   * noticed: it moved by up to seven between runs and every run passed. The
   * floor is now the other reading, `_clipped-fixtures.ts`, which takes the
   * fixtures from source and the clippers from the components, and each one it
   * names that the sweep did not reach is named here.
   */
  expect(expected.length, "the static read found no clipped fixtures: the reader broke, not the library").toBeGreaterThan(50);
  const missing = expected.filter((id) => !swept.includes(id));
  expect(
    missing,
    `FOCUS_OBSCURED fixtures ${swept.length} is below the ${expected.length} expected: ` +
      "these render a focusable inside a clipping ancestor and the sweep focused nothing in them",
  ).toEqual([]);
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

  const result = await page.evaluate(async () => {
    const measure = async (overflow: string) => {
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
      // After one frame: WebKit performs the focus scroll at its next rendering
      // update rather than inside `focus()`, and nothing here animates after
      // it. `_clip.ts` waits for every scroll container to hold still, which is
      // planted below.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const a = last.getBoundingClientRect();
      const c = strip.getBoundingClientRect();
      const visible =
        Math.min(a.right, c.right) - Math.max(a.left, c.left) > 0 &&
        Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > 0;
      const scrolled = strip.scrollLeft;
      host.remove();
      return { visible, scrolled };
    };
    return { clip: await measure("clip"), hidden: await measure("hidden") };
  });

  // `clip` cannot scroll, so focus lands somewhere entirely invisible.
  expect(result.clip.visible, "overflow:clip should leave the focused control obscured").toBe(false);
  expect(result.clip.scrolled).toBe(0);
  // `hidden` scrolls on focus, which is why the static version of this check
  // reported a failure that did not exist. Every engine scrolls it; WebKit does
  // so a frame after `focus()`, which a synchronous read took for "never".
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

/**
 * The plant for when the read happens: a container that is still scrolling
 * after focus.
 *
 * The read used to wait one animation frame, which is when WebKit's own focus
 * scroll has landed, and assumed nothing moves after it. A scroller that
 * animates its way to the focused control does: Pagination/narrow's list was
 * still moving after that frame in one Chromium run (measured 2026-10-17). This
 * strip does it on purpose. On focus it jumps to the far end, then scrolls back
 * over six frames until the control is in view, so a read one frame after
 * focus finds the control entirely outside the strip, and a read after the
 * strip has held still finds it in view. Revert `_clip.ts` to the one-frame
 * read and the first assertion reports it.
 *
 * The second strip never stops, and the read has to say so rather than measure
 * whichever frame it gave up on.
 */
test("the read waits for every scroll container to hold still", async ({ page }) => {
  await page.goto("/__fixtures", { waitUntil: "domcontentloaded" });

  const plant = (forever: boolean) =>
    page.evaluate((runaway) => {
      for (const stale of document.querySelectorAll("[data-clip-plant]")) stale.remove();
      const host = document.createElement("div");
      host.setAttribute("data-clip-plant", "");
      host.setAttribute("data-fixture", "plant");
      host.style.cssText = "position:absolute;top:0;left:0;width:100px;height:40px";
      const strip = document.createElement("div");
      strip.style.cssText = "position:relative;width:100px;height:40px;overflow:hidden;white-space:nowrap";
      const spacer = document.createElement("span");
      spacer.style.cssText = "display:inline-block;width:1000px";
      const button = document.createElement("button");
      button.textContent = "late";
      button.style.cssText = "display:inline-block;width:80px";
      strip.append(spacer, button);
      host.appendChild(strip);
      document.body.appendChild(host);

      const w = window as { __latePlant?: number[] };
      w.__latePlant = [];
      button.addEventListener("focus", () => {
        const end = strip.scrollWidth - strip.clientWidth;
        let frame = 0;
        const step = () => {
          frame += 1;
          strip.scrollLeft = runaway ? (frame % 2) * end : Math.round((end * (frame - 1)) / 6);
          w.__latePlant!.push(strip.scrollLeft);
          if (runaway || frame <= 6) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, forever);

  await plant(false);
  const late = await focusFindings(page);
  const moved = await page.evaluate(() => (window as { __latePlant?: number[] }).__latePlant ?? []);
  // The plant has to be late to prove anything: it starts out of view and is
  // still moving three frames after focus.
  expect(moved[0], "the strip starts the scroll from the far end").toBe(0);
  expect(new Set(moved.slice(0, 4)).size, "the strip is still scrolling three frames after focus").toBe(4);
  expect(late.n).toBe(1);
  expect(late.bad, "read once the strip has stopped, the control is in view").toEqual([]);

  await plant(true);
  await expect(focusFindings(page), "a scroller that never stops fails the read").rejects.toThrow(
    /still scrolling 1000ms after focus/,
  );
});

/**
 * A roving focus that moves without scrolling leaves its target out of sight.
 *
 * The walk above focuses every control once, by script, which is not what a
 * keyboard user does: they arrow from item to item, and the component moves
 * focus. Table's grid did that with `focus({ preventScroll: true })` and
 * nothing after it, so in every engine the focused cell could sit outside its
 * scroll region — 6 of 8 steps across the 320px grid. Each case arrows through
 * a container that is asserted to overflow, so a pass cannot come from a list
 * too short to hide anything.
 */
const ROVING = [
  { component: "Table", fixture: "keyboard-grid", width: 320, start: "[data-fixture] tbody td", key: "ArrowRight", steps: 8 },
] as const;

const focusState = () =>
  new Promise<{ label: string; overflowing: boolean; inside: boolean }>((resolve) =>
    requestAnimationFrame(() => {
      const el = document.activeElement as HTMLElement;
      let c = el.parentElement;
      while (c && c !== document.body) {
        const o = getComputedStyle(c);
        if (/auto|scroll|hidden/.test(o.overflowX + o.overflowY)) break;
        c = c.parentElement;
      }
      const a = el.getBoundingClientRect();
      const b = (c ?? document.body).getBoundingClientRect();
      resolve({
        label: (el.textContent ?? "").trim().slice(0, 16),
        overflowing: !!c && c !== document.body && (c.scrollWidth > c.clientWidth + 1 || c.scrollHeight > c.clientHeight + 1),
        inside: Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0,
      });
    }),
  );

for (const r of ROVING) {
  test(`${r.component}/${r.fixture}: arrowing keeps the focused item in view`, async ({ page }) => {
    await page.setViewportSize({ width: r.width, height: 720 });
    await gotoFixture(page, r.component, r.fixture);
    await page.locator(r.start).first().focus();
    const seen = new Set<string>();
    const hidden: string[] = [];
    let overflowing = false;
    for (let i = 0; i < r.steps; i++) {
      await page.keyboard.press(r.key);
      const s = await page.evaluate(focusState);
      seen.add(s.label);
      overflowing ||= s.overflowing;
      if (!s.inside) hidden.push(`step ${i + 1} "${s.label}"`);
    }
    console.log(`ROVING_REVEAL ${r.component}/${r.fixture} steps=${r.steps} items=${seen.size} hidden=${hidden.length}`);
    expect(overflowing, "the container never overflowed, so nothing could be hidden").toBe(true);
    expect(seen.size, "focus did not move between items").toBeGreaterThan(2);
    expect(hidden, "focused by the keyboard and left outside its scroll container").toEqual([]);
  });

  test(`${r.component}/${r.fixture}: a visible target does not scroll the page`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await gotoFixture(page, r.component, r.fixture);
    // A page that can scroll, scrolled, with the target still on screen: a
    // reveal that moved the window here would be the jump preventScroll was
    // presumably there to avoid.
    await page.evaluate(() => {
      const spacer = document.createElement("div");
      spacer.style.height = "3000px";
      document.body.appendChild(spacer);
      window.scrollTo(0, 40);
    });
    await page.locator(r.start).first().focus({ timeout: 5000 });
    const before = await page.evaluate(() => window.scrollY);
    expect(before, "the page must be scrolled for this to mean anything").toBeGreaterThan(0);
    await page.keyboard.press(r.key);
    const s = await page.evaluate(focusState);
    const after = await page.evaluate(() => window.scrollY);
    console.log(`ROVING_SCROLLY ${r.component}/${r.fixture} ${before} -> ${after} (target "${s.label}" in view ${s.inside})`);
    expect(s.inside).toBe(true);
    expect(after, "window.scrollY moved for a target already in view").toBe(before);
  });
}

/**
 * A focus trap moves every Tab itself, so the browser's own Tab scroll never
 * happens.
 *
 * `cycleTabWithin` calls `preventDefault` on each Tab inside a Modal, a modal
 * Drawer and the DatePicker calendar, then focuses the next control with
 * `preventScroll: true`. In a dialog taller than the viewport that left the
 * focused control outside the box that scrolls it, in every engine. The Modal
 * case is a real tall dialog, scrolled by the Modal's own positioner. The
 * Drawer case keeps a consumer-style scrolling box inside the panel, which is
 * the trap reveal's other shape: a scroller the library did not render.
 */
const TRAPS = [
  { component: "Modal", fixture: "tall", scrollBox: false },
  { component: "Drawer", fixture: "open", scrollBox: true },
] as const;

for (const t of TRAPS) {
  test(`${t.component}/${t.fixture}: Tab through a tall dialog keeps focus on screen`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await gotoFixture(page, t.component, t.fixture);
    const dialog = page.locator('[role="dialog"]').first();
    await expect(dialog).toBeVisible();
    await dialog.evaluate((d, scrollBox) => {
      const box = document.createElement("div");
      if (scrollBox) box.style.cssText = "max-height:240px;overflow:auto";
      for (let i = 0; i < 30; i++) {
        const b = document.createElement("button");
        b.textContent = `filler ${i}`;
        b.style.cssText = "display:block;height:40px";
        box.appendChild(b);
      }
      d.appendChild(box);
    }, t.scrollBox);
    const offScreen: string[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const s = await page.evaluate(
        () =>
          new Promise<{ label: string; visible: boolean }>((resolve) =>
            requestAnimationFrame(() => {
              const el = document.activeElement as HTMLElement;
              const a = el.getBoundingClientRect();
              let visible = a.bottom > 0 && a.top < innerHeight;
              // Up to the dialog's fixed layer and no further: an open dialog
              // locks the page with `overflow: hidden` on a body that is ~48px
              // tall on a fixture page, which clips nothing (see `_clip.ts`).
              for (let c = el.parentElement; c && c !== document.body && visible; c = c.parentElement) {
                const o = getComputedStyle(c);
                if (/auto|scroll|hidden/.test(o.overflowY)) {
                  const r = c.getBoundingClientRect();
                  visible = a.bottom > r.top && a.top < r.bottom;
                }
                if (o.position === "fixed") break;
              }
              resolve({ label: (el.textContent ?? "").trim().slice(0, 12), visible });
            }),
          ),
      );
      seen.add(s.label);
      if (!s.visible) offScreen.push(`Tab ${i + 1} "${s.label}"`);
    }
    console.log(`TRAP_REVEAL ${t.component}/${t.fixture} tabs=25 controls=${seen.size} offscreen=${offScreen.length}`);
    expect(seen.size, "Tab did not move through the dialog").toBeGreaterThan(20);
    expect(offScreen, "Tab moved focus to a control the user cannot see").toEqual([]);
  });
}
