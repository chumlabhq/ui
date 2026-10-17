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

/**
 * An open Drawer's or Modal's own initial focus has landed: the active element
 * is inside the panel and has not changed for one frame.
 *
 * Both move focus in on the frame after they mount, and that move scrolls the
 * panel. A sweep that arrives in between focuses the first control, then the
 * open-time focus lands — `data-autofocus` on a control below the fold scrolls
 * the panel to its bottom — and the read one frame later finds the first
 * control scrolled out. That is how `Drawer/tall-autofocus` reported its Close
 * button obscured under load and passed alone; arriving the moment the panel
 * mounts reproduced it in 2 of 5 runs, and in 5 of 5 with every frame held
 * 300ms. No user can focus a control before the dialog has finished opening,
 * so the measurement waits for it.
 *
 * Checked after the portals are marked, so a panel that mounts between the
 * fixture's first commit and the mark is waited for too. A page with no open
 * panel passes at once. Two things narrow "open", both measured over every
 * fixture (44 with an `aria-modal` element in a box):
 *   - A closed panel can still be in the DOM. `Drawer/closed-kept-mounted` is
 *     `inert` under an `aria-hidden` root; `Modal/closed-kept-mounted` is
 *     `visibility: hidden`. Focus enters neither.
 *   - Only the two panels whose open-time focus scrolls them. TimePicker's
 *     open clock was `aria-modal` too and left focus in its input (three
 *     fixtures), so waiting on every `aria-modal` waited on it until timeout.
 *     It is non-modal since L17; whether focus is inside every open
 *     `aria-modal` is the a11y-full sweep's own check, not this wait's.
 */
export async function initialFocusLanded(page: Page): Promise<void> {
  await page.evaluate(() => {
    delete (window as { __clInitialFocus?: Element | null }).__clInitialFocus;
  });
  await page.waitForFunction(
    () => {
      const w = window as { __clInitialFocus?: Element | null };
      const open = [
        ...document.querySelectorAll('[data-drawer-panel][aria-modal="true"], [data-modal-container] > [role="dialog"]'),
      ].filter(
        (d) =>
          d.checkVisibility({ visibilityProperty: true }) &&
          !d.closest('[inert], [aria-hidden="true"]'),
      );
      if (open.length === 0) return true;
      const active = document.activeElement;
      const inside = open.some((d) => d.contains(active));
      const steady = inside && w.__clInitialFocus === active;
      w.__clInitialFocus = inside ? active : null;
      return steady;
    },
    undefined,
    { polling: "raf", timeout: 10_000 },
  );
}

export async function focusFindings(page: Page): Promise<FocusFindings> {
  // The library portals every overlay to `document.body`, so a fixture-scoped
  // walk sees a drawer, a modal or a menu exactly never. Same reason, and the
  // same helper, as the axe sweep.
  const portals = await markPortalRoots(page);
  const roots = ["[data-fixture]", ...(portals > 0 ? [`[${PORTAL_MARK}]`] : [])];
  await initialFocusLanded(page);

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
      // month menu as obscured in WebKit when a keyboard user sees every month
      // (January sat at scrollTop 126, 85px above the menu, until the frame
      // after focus; measured 2026-10-17).
      //
      // One animation frame covered that and assumed nothing moves after it. A
      // container that animates its way to the control does, so the condition
      // is every scroll container of the control, and the document, holding the
      // same scrollTop and scrollLeft across two consecutive frames. Sampled
      // from the first frame on, not from `focus()`: WebKit has not scrolled
      // yet at the call, so a still pair there would be the pre-scroll position.
      // Capped at a second, and a container still moving then is an error
      // naming it, not a read of whichever frame the wait gave up on.
      const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const scrollers = (el: Element): Element[] => {
        const found: Element[] = [];
        for (let n = el.parentElement; n; n = n.parentElement) {
          const o = getComputedStyle(n);
          if (/hidden|auto|scroll/.test(o.overflowX + o.overflowY)) found.push(n);
        }
        if (document.scrollingElement) found.push(document.scrollingElement);
        return found;
      };
      const positions = (els: Element[]) => els.map((s) => `${s.scrollTop},${s.scrollLeft}`).join("|");
      const name = (el: Element) =>
        `<${el.tagName.toLowerCase()}> "${el.getAttribute("aria-label") ?? (el.textContent ?? "").trim().slice(0, 16)}"`;
      const settled = async (el: Element) => {
        const containers = scrollers(el);
        const start = performance.now();
        await frame();
        let previous = positions(containers);
        for (;;) {
          await frame();
          const current = positions(containers);
          if (current === previous) return;
          if (performance.now() - start > 1000) {
            throw new Error(
              `${name(el)} was still scrolling 1000ms after focus: ${previous} -> ${current} across ` +
                containers.map((s) => (s === document.scrollingElement ? "document" : s.tagName.toLowerCase())).join(", "),
            );
          }
          previous = current;
        }
      };
      for (const el of targets) {
        el.focus();
        await settled(el);
        // Read after the scroll has settled, so whatever the browser did is included.
        const anc = clipAncestor(el)!;
        const a = el.getBoundingClientRect();
        const c = anc.getBoundingClientRect();
        const w = Math.min(a.right, c.right) - Math.max(a.left, c.left);
        const h = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
        if (w <= 0 || h <= 0) bad.push(name(el));
      }
      return { n: targets.length, bad };
    },
    { selector: scoped(roots), boundaries: roots },
  );
}
