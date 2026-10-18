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

/**
 * The keys that move the caret to the start and to the end of a text field,
 * on the engine and platform actually running.
 *
 * Measured in a bare `<input>` on macOS: Home and End move the caret in
 * chromium; firefox and webkit leave it where it was, as the macOS text system
 * does, and all three honour Meta+ArrowLeft and Meta+ArrowRight. A spec that
 * presses Home and reads `selectionStart === 0` was asserting Chromium's
 * keyboard model, and failed in the other two engines on a component that was
 * behaving exactly as the platform does.
 *
 * Decided by trying the keys in a probe field rather than by browser name: on
 * Linux and Windows, Home and End are the answer in every engine, and a name
 * check would get that wrong. The answer is the engine's and the platform's,
 * not the page's, so it is probed once per engine in each worker and reused
 * by every test that worker runs; it was probed once per page, which is once
 * per test.
 */
const caretKeysByEngine = new Map<string, { start: string; end: string }>();

export async function caretKeys(page: Page): Promise<{ start: string; end: string }> {
  const engine = page.context().browser()?.browserType().name() ?? "unknown";
  const known = caretKeysByEngine.get(engine);
  if (known) return known;
  const tryKeys = async (keys: string[], edge: "start" | "end") => {
    for (const key of keys) {
      await page.evaluate(() => {
        const w = window as unknown as { __caretReturn?: Element | null };
        w.__caretReturn = document.activeElement;
        const probe = document.createElement("input");
        probe.setAttribute("data-caret-probe", "");
        probe.value = "abcdef";
        probe.style.cssText = "position:fixed;left:0;top:0;opacity:0;pointer-events:none";
        document.body.append(probe);
        probe.focus();
        probe.setSelectionRange(3, 3);
      });
      await page.keyboard.press(key);
      const landed = await page.evaluate((at) => {
        const probe = document.querySelector<HTMLInputElement>("[data-caret-probe]")!;
        const ok = probe.selectionStart === (at === "start" ? 0 : probe.value.length);
        probe.remove();
        const back = (window as unknown as { __caretReturn?: Element | null }).__caretReturn;
        if (back instanceof HTMLElement) back.focus({ preventScroll: true });
        return ok;
      }, edge);
      if (landed) return key;
    }
    throw new Error(`none of ${keys.join(", ")} moved the caret in a probe field`);
  };
  const keys = {
    start: await tryKeys(["Home", "Meta+ArrowLeft", "Control+a"], "start"),
    end: await tryKeys(["End", "Meta+ArrowRight", "Control+e"], "end"),
  };
  caretKeysByEngine.set(engine, keys);
  return keys;
}

/** Moves the caret in the focused text field to its start. */
export async function caretToStart(page: Page): Promise<void> {
  await page.keyboard.press((await caretKeys(page)).start);
}

/** Moves the caret in the focused text field to its end. */
export async function caretToEnd(page: Page): Promise<void> {
  await page.keyboard.press((await caretKeys(page)).end);
}
