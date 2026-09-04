import type { Page } from "@playwright/test";

/**
 * Counts click events reaching the document.
 *
 * Lets an "activate on Enter" test assert activation rather than only that
 * `keyboard.press` did not throw — which it cannot, whatever the control does.
 */
export async function watchClicks(page: Page) {
  await page.evaluate(() => {
    (window as unknown as { __clicks: number }).__clicks = 0;
    document.addEventListener(
      "click",
      () => {
        (window as unknown as { __clicks: number }).__clicks += 1;
      },
      true,
    );
  });
  return () =>
    page.evaluate(() => (window as unknown as { __clicks: number }).__clicks);
}

/**
 * Skips the current test, with a reason, on an engine that has no `TouchEvent`.
 *
 * Desktop Firefox does not define the constructor unless touch events are
 * enabled, so `dispatchEvent("touchstart")` throws `TouchEvent is not defined`
 * there. That is a statement about the engine, not about the component, and it
 * accounted for 8 of the 96 failures the first time the firefox project was
 * ever executed.
 *
 * Skipped rather than deleted, and with a reason rather than silently:
 * `_reconcile-reporter` fails the run on any skip that does not carry one.
 */
export async function skipWithoutTouchEvents(
  test: { skip: (condition: boolean, description: string) => void },
  page: Page,
): Promise<void> {
  const supported = await page.evaluate(() => typeof TouchEvent !== "undefined");
  test.skip(
    !supported,
    "this engine does not define TouchEvent (desktop Firefox); the touch path " +
      "is covered by the Mobile Chrome and Mobile Safari projects",
  );
}

/**
 * Skips the current test, with a reason, on an engine that does not move focus
 * to controls by Tab or by click.
 *
 * WebKit follows the macOS convention: with "Press Tab to highlight each item
 * on a webpage" off — the default — Tab does not traverse buttons or
 * checkboxes, and clicking a button does not focus it. Measured on a fixture
 * page with three native checkboxes: eight consecutive Tab presses left
 * `document.activeElement` on `<body>` every time.
 *
 * That makes a Tab-traversal assertion a statement about the platform rather
 * than the component, and it is why webkit and Mobile Safari accounted for all
 * ten `toBeFocused` failures in the first complete run of this suite. The
 * components are focusable on that engine — a direct `.focus()` works, which is
 * how the Drawer's focus trap and its focus restoration are asserted there.
 *
 * A Safari user who navigates by keyboard turns Full Keyboard Access on, at
 * which point traversal behaves as it does elsewhere.
 */
export function skipWithoutTabTraversal(
  test: { skip: (condition: boolean, description: string) => void },
  browserName: string,
): void {
  test.skip(
    browserName === "webkit",
    "WebKit does not put buttons or checkboxes in the sequential tab order, " +
      "and does not focus them on click, unless macOS Full Keyboard Access is " +
      "on; focusability itself is asserted with a direct .focus() elsewhere",
  );
}
