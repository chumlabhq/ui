import { test, expect } from "@playwright/test";
import { gotoFixture } from "./_nav";

/**
 * The three criteria that cannot be answered without layout.
 *
 * SC 2.4.7 Focus Visible, SC 2.4.11 Focus Not Obscured (Minimum) and SC 2.5.8
 * Target Size (Minimum) are all statements about rendered pixels. jsdom
 * computes no geometry and resolves no `:focus-visible`, so a contract there
 * could only assert that a class string mentions a ring — which is what the
 * README's "44px+ touch targets" claim did, and it was false.
 *
 * These run in the browser, against fixtures, and measure.
 */

/** Components whose fixtures put an interactive control on screen. */
const TARGETS: [string, string][] = [
  ["Button", "default"],
  ["Checkbox", "siblings"],
  ["Switch", "default"],
  ["Input", "labelled"],
  ["Pagination", "default"],
  ["Dropdown", "labelled"],
  ["Slider", "default"],
];

const INTERACTIVE =
  'button:not([disabled]), a[href], input:not([type="hidden"]):not([disabled]), ' +
  'select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';

test.describe("SC 2.5.8 Target Size (Minimum)", () => {
  /**
   * 24x24 CSS pixels, or the spacing exception. Not 44 — that is SC 2.5.5,
   * Level AAA, which this package does not claim; ADR 003 D2 is explicit that
   * nothing should be resized to chase it.
   */
  for (const [component, fixture] of TARGETS) {
    test(`${component}/${fixture} meets 24x24 or the spacing exception`, async ({ page }) => {
      await gotoFixture(page, component, fixture);

      const undersized = await page.evaluate((sel) => {
        const root = document.querySelector("[data-fixture]")!;
        const targets = [...root.querySelectorAll<HTMLElement>(sel)];
        const boxes = targets
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 0 && r.height > 0);

        const failures: string[] = [];
        for (const { el, r } of boxes) {
          if (r.width >= 24 && r.height >= 24) continue;

          // The spacing exception: a 24px circle centred on the target may not
          // intersect the circle of any other target.
          const cx = r.x + r.width / 2;
          const cy = r.y + r.height / 2;
          const crowded = boxes.some(({ el: other, r: o }) => {
            if (other === el) return false;
            const ox = o.x + o.width / 2;
            const oy = o.y + o.height / 2;
            return Math.hypot(cx - ox, cy - oy) < 24;
          });
          if (crowded) {
            failures.push(
              `${el.tagName}.${el.className.slice(0, 24)} is ${Math.round(r.width)}x${Math.round(r.height)} and within 24px of another target`,
            );
          }
        }
        return failures;
      }, INTERACTIVE);

      expect(undersized, "target below 24x24 with no spacing exception").toEqual([]);
    });
  }
});

test.describe("SC 2.4.7 Focus Visible", () => {
  for (const [component, fixture] of TARGETS) {
    test(`${component}/${fixture} shows an indicator on every focusable`, async ({ page }) => {
      await gotoFixture(page, component, fixture);

      const unindicated = await page.evaluate((sel) => {
        const root = document.querySelector("[data-fixture]")!;
        const failures: string[] = [];

        for (const el of root.querySelectorAll<HTMLElement>(sel)) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;

          // Read the element and its ancestors up to the fixture. The
          // indicator does not have to sit on the focused node: Input paints
          // `focus-within:ring-2` on the control that wraps the `<input>`,
          // which is visible to the user and is what the criterion asks about.
          const chain = (node: HTMLElement): HTMLElement[] => {
            const out: HTMLElement[] = [];
            let cur: HTMLElement | null = node;
            while (cur && cur !== root.parentElement) {
              out.push(cur);
              cur = cur.parentElement;
            }
            return out;
          };
          const snapshot = (node: HTMLElement) =>
            chain(node)
              .map((n) => {
                const c = getComputedStyle(n);
                return `${c.outlineWidth}|${c.outlineStyle}|${c.outlineColor}|${c.boxShadow}|${c.borderColor}|${c.backgroundColor}`;
              })
              .join("//");

          const idle = snapshot(el);
          el.focus();
          const focused = snapshot(el);

          // Something visible must change. Which property carries it is the
          // design's business; that it changes at all is the criterion's.
          if (idle === focused) {
            failures.push(`${el.tagName}.${el.className.slice(0, 30)}`);
          }
          el.blur();
        }
        return failures;
      }, INTERACTIVE);

      expect(unindicated, "focusable element with no focus indicator").toEqual([]);
    });
  }
});

test.describe("SC 2.4.11 Focus Not Obscured (Minimum)", () => {
  /**
   * The layering scale proved a dropdown inside a Drawer computes a higher
   * layer than the Drawer. This asserts the thing the criterion is actually
   * about: that the focused element is not covered by anything. Hit-testing its
   * centre is the direct question — whatever is painted there is what the user
   * can see and click.
   */
  const OVERLAYS: [string, string][] = [
    ["Modal", "open"],
    ["Drawer", "open"],
    ["DatePicker", "open"],
    ["Dropdown", "open"],
  ];

  for (const [component, fixture] of OVERLAYS) {
    test(`${component}/${fixture} keeps the focused element unobscured`, async ({ page }) => {
      await gotoFixture(page, component, fixture);
      await page.waitForTimeout(400);

      const obscured = await page.evaluate(() => {
        const focused = document.activeElement as HTMLElement | null;
        if (!focused || focused === document.body) return null;

        const r = focused.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return "the focused element has no box";

        // Entirely outside the viewport is also obscured for this criterion.
        if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) {
          return "the focused element is outside the viewport";
        }

        const cx = Math.min(Math.max(r.x + r.width / 2, 1), innerWidth - 1);
        const cy = Math.min(Math.max(r.y + r.height / 2, 1), innerHeight - 1);
        const hit = document.elementFromPoint(cx, cy);
        if (!hit) return "nothing is painted at the focused element's centre";
        if (hit !== focused && !focused.contains(hit) && !hit.contains(focused)) {
          return `covered by ${hit.tagName}.${hit.className?.toString().slice(0, 40)}`;
        }
        return null;
      });

      expect(obscured, "the focused element is obscured").toBeNull();
    });
  }
});
