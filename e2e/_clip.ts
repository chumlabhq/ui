import type { Page } from "@playwright/test";
import { markPortalRoots, PORTAL_MARK } from "./_portals.js";

/**
 * The 2.4.11 measurement, in one place, so the gate and its plant run the same
 * code.
 *
 * It used to live inline in `focus-not-obscured.spec.ts`'s `page.evaluate`, and
 * the spec's self-check built its own DOM and compared rects by hand — so the
 * predicate deciding what counts as a clipping ancestor, and the selector
 * deciding what gets measured at all, were the two parts nothing exercised.
 * Both were wrong, and the gate reported it as an intermittent failure three
 * times. A plant that measures a copy of the logic proves nothing about the
 * logic; this export is what lets the plant call the real thing.
 */
export type FocusFindings = { n: number; bad: string[] };

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
];

/**
 * Every clause carries its own scope prefix.
 *
 * `[data-fixture] ${list}` reads as scoped and is not: CSS splits a selector
 * list on its top-level commas, so only `a[href]` was ever inside the fixture
 * and `button`, `input`, `select`, `textarea` and `[tabindex]` matched the whole
 * document — the index nav, the page chrome, and every portal on it. The gate's
 * population was never what its name said, and the finding that exposed it was
 * a Drawer close button sitting in a portal the scope was supposed to exclude.
 */
const scoped = (roots: string[]): string =>
  roots.flatMap((root) => FOCUSABLE.map((t) => `${root} ${t}`)).join(",");

export async function focusFindings(page: Page): Promise<FocusFindings> {
  // The library portals every overlay to `document.body`, so a fixture-scoped
  // walk sees a drawer, a modal or a menu exactly never. Same reason, and the
  // same helper, as the axe sweep.
  const portals = await markPortalRoots(page);
  const roots = ["[data-fixture]", ...(portals > 0 ? [`[${PORTAL_MARK}]`] : [])];

  return page.evaluate(
    async ({ selector, boundaries }) => {
      const isBoundary = (el: Element) => boundaries.some((b) => el.matches(b));
      const clipAncestor = (el: Element): HTMLElement | null => {
        let n = el.parentElement;
        while (n && !isBoundary(n)) {
          const o = getComputedStyle(n);
          if (/hidden|auto|scroll|clip/.test(o.overflowX + o.overflowY)) return n;
          // Nothing above a `fixed` element clips it. An open Drawer or Modal
          // locks the page by putting `overflow: hidden` ON `document.body`, and
          // on a fixture page body is ~48px tall — so a walk that climbs past
          // the fixed panel finds body and calls it the clipping ancestor of
          // something CSS does not clip at all. It only ever reported under
          // load, because that is when the panel is still mid-transition and
          // its rect has not settled inside the 48px box, which is how this was
          // filed as a flake twice instead of being read.
          //
          // Limit, and the reason this is a stop rather than a skip: an ancestor
          // with a `transform`, `filter` or `contain: paint` IS the containing
          // block for a fixed descendant and does clip it. No fixture in the
          // library has one above a portal root; if one appears, this returns
          // null where it should return that ancestor.
          if (o.position === "fixed") return null;
          n = n.parentElement;
        }
        return null;
      };

      const targets = [...document.querySelectorAll<HTMLElement>(selector)].filter(
        (el) => clipAncestor(el) !== null,
      );
      const bad: string[] = [];
      // The scroll a focus causes is not always done by the time `focus()`
      // returns. Chromium and Firefox scroll inside the call; WebKit scrolls at
      // its next rendering update, so a rect read straight after `focus()` is
      // the pre-scroll rect there — which is how this reported the DatePicker
      // month menu as obscured in WebKit when a keyboard user sees every month.
      // One animation frame is the named condition: the callback runs after the
      // rendering update that performs the scroll, in all three engines.
      const settled = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      for (const el of targets) {
        el.focus();
        await settled();
        // Read after the scroll has settled, so whatever the browser did is included.
        const anc = clipAncestor(el)!;
        const a = el.getBoundingClientRect();
        const c = anc.getBoundingClientRect();
        const w = Math.min(a.right, c.right) - Math.max(a.left, c.left);
        const h = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
        if (w <= 0 || h <= 0) {
          bad.push(
            `<${el.tagName.toLowerCase()}> "${el.getAttribute("aria-label") ?? (el.textContent ?? "").trim().slice(0, 16)}"`,
          );
        }
      }
      return { n: targets.length, bad };
    },
    { selector: scoped(roots), boundaries: roots },
  );
}
