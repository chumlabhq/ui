import { expect, test } from "@playwright/test";
import { gotoFixtureIndex } from "./_nav";

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
    const r = await page.evaluate(() => {
      const SEL = "a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])";
      const clipAncestor = (el: Element): HTMLElement | null => {
        let n = el.parentElement;
        while (n && !n.hasAttribute("data-fixture")) {
          const o = getComputedStyle(n);
          if (/hidden|auto|scroll|clip/.test(o.overflowX + o.overflowY)) return n;
          n = n.parentElement;
        }
        return null;
      };
      const targets = [...document.querySelectorAll<HTMLElement>(`[data-fixture] ${SEL}`)]
        .filter((el) => clipAncestor(el) !== null);
      const bad: string[] = [];
      for (const el of targets) {
        el.focus();
        // Read after focus, so any scrolling the browser did is included.
        const anc = clipAncestor(el)!;
        const a = el.getBoundingClientRect();
        const c = anc.getBoundingClientRect();
        const w = Math.min(a.right, c.right) - Math.max(a.left, c.left);
        const h = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
        if (w <= 0 || h <= 0) {
          bad.push(`<${el.tagName.toLowerCase()}> "${el.getAttribute("aria-label") ?? (el.textContent ?? "").trim().slice(0, 16)}"`);
        }
      }
      return { n: targets.length, bad };
    });
    if (r.n > 0) withClipper += 1;
    focused += r.n;
    for (const b of r.bad) obscured.push(`${path.replace("/__fixtures/", "")}: ${b}`);
  }

  console.log(`FOCUS_OBSCURED fixturesWithClipper=${withClipper} focused=${focused} obscured=${obscured.length}`);
  // A walk that found no clipping ancestors is not a pass.
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
