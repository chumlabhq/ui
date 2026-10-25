import type { Locator, Page } from "@playwright/test";

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
      "is driven by `locator.tap()` on Mobile Chrome and Mobile Safari, where " +
      "the engine itself builds and dispatches the TouchEvent and the click " +
      "that follows — not a synthetic touchstart/touchend plus a Playwright " +
      ".click()",
  );
}

/**
 * Taps `locator` the way the engine's user would, with the strongest signal
 * each project is wired for.
 *
 * On a project with `hasTouch` (Mobile Chrome and Mobile Safari), `locator.tap()`
 * — Playwright drives the engine's own touchscreen, which builds a real
 * `TouchEvent` and the click that follows from it. That is the whole point of
 * a touch assertion: the engine fires both events, in order, over the control
 * at its measured centre, as a user's finger would.
 *
 * On a desktop project without `hasTouch` (Chromium, WebKit — Firefox is
 * skipped above by `skipWithoutTouchEvents`), `tap()` throws rather than
 * degrading, so the touch is dispatched synthetically (`touchstart` and
 * `touchend`) and followed by a `.click()`. That is a smoke test: a touch
 * dispatch does not break the control and a click still activates it. The
 * real-touch claim lives with the Mobile projects above.
 */
export async function activateByTouch(page: Page, locator: Locator): Promise<void> {
  const hasTouch = await page.evaluate(
    () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
  );
  if (hasTouch) {
    await locator.tap();
    return;
  }
  await locator.dispatchEvent("touchstart");
  await locator.dispatchEvent("touchend");
  await locator.click();
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

/**
 * Whether the page's primary pointer can hover, by the engine's own media
 * query rather than by project name.
 *
 * `(hover: hover)` is true on chromium, firefox and webkit and false on Mobile
 * Chrome and Mobile Safari, where Tailwind's `hover:` classes never apply
 * either. A test that drives `locator.hover()` on those two moves a mouse no
 * touch user has, so it passes whether or not a finger would get the same
 * result.
 */
async function canHover(page: Page): Promise<boolean> {
  return page.evaluate(() => window.matchMedia("(hover: hover)").matches);
}

/**
 * Points at `locator` the way this project's user would: a hover where the
 * pointer can hover, a tap where it cannot.
 *
 * The tap goes through the engine's touchscreen, so whatever opens or holds a
 * surface has to answer the touch itself or the compatibility mouse events the
 * engine fires after it. A surface that listens for a mouse alone stays shut,
 * and the test that drove it fails, as it should. On a project with no hover
 * and no touch, `tap()` throws rather than quietly falling back to a mouse.
 */
export async function reveal(page: Page, locator: Locator): Promise<void> {
  if (await canHover(page)) {
    await locator.hover();
    return;
  }
  await locator.tap();
}

/**
 * Activates `locator` with the same pointer `reveal` uses: a click where the
 * pointer can hover, a tap where it cannot.
 *
 * A test that clicks with the mouse and then taps has given a touch project a
 * mouse no touch user has. Measured on Mobile Chrome: a 2 s toast opened by
 * `click()` and then tapped was gone 2.88 s later, because 13 ms after the tap
 * the engine moved its hover back to where the mouse had clicked, which fired
 * `mouseout` on the toast and resumed it.
 */
export async function press(page: Page, locator: Locator): Promise<void> {
  if (await canHover(page)) {
    await locator.click();
    return;
  }
  await locator.tap();
}

/**
 * Takes the pointer `reveal` left on something back off it: the mouse to the
 * top-left corner where the pointer can hover, a tap on inert page background
 * where it cannot.
 *
 * The tap lands on the first point of a coarse grid over the viewport whose
 * topmost element is not, and is not inside, anything that acts on a tap or is
 * itself a surface `reveal` opened, so it lands on the page rather than on a
 * control that would answer it.
 */
export async function conceal(page: Page): Promise<void> {
  if (await canHover(page)) {
    await page.mouse.move(0, 0);
    return;
  }
  const point = await page.evaluate(() => {
    const busy =
      "a,button,input,select,textarea,label,summary,[role],[tabindex],[contenteditable],[data-toast-id]";
    const { innerWidth: w, innerHeight: h } = window;
    for (let y = h * 0.1; y < h; y += h / 10) {
      for (let x = w * 0.1; x < w; x += w / 10) {
        const el = document.elementFromPoint(x, y);
        if (el && el !== document.documentElement && !el.closest(busy)) {
          return { x: Math.round(x), y: Math.round(y) };
        }
      }
    }
    return null;
  });
  if (!point) throw new Error("conceal found no inert point on the page to tap");
  await page.touchscreen.tap(point.x, point.y);
}

/** The input `scrollUntil` used, and how many gestures it took. */
export interface Scrolled {
  input: "wheel" | "swipe" | "keys";
  gestures: number;
}

/**
 * Scrolls the nearest scrolling ancestor of `target` toward its end with the
 * input each project's user has, one gesture at a time, until `reached()` holds
 * or `tries` gestures have been made, then makes `beyond` more: past the
 * scroller's end, which is where a scroll that chains moves the page behind.
 *
 * Desktop (no `hasTouch`): the mouse wheel, over the scroller's visible middle.
 *
 * Mobile Chrome: a real touch swipe, sent through CDP
 * `Input.dispatchTouchEvent`, so the engine itself hit-tests the finger and
 * scrolls whatever it lands on, as drawer.spec's sheet test does. The finger
 * goes up from 90% to 10% of the scroller's visible box: inside the viewport,
 * inside every frame around it, and on the scroller. A swipe placed by a fixed
 * share of the viewport missed Drawer/tall-top at both sizes: the sheet is
 * 0..300 px, so at 50% or 75% of the viewport the finger lands on
 * `[data-drawer-overlay]`, which scrolls nothing (panel scrollTop 0, page
 * scrollY 0), while the same swipe on tall-bottom lands in the panel and
 * scrolls it 732. One 250 px swipe from the middle scrolls either sheet about
 * 340 of its 732, so it repeats.
 *
 * Mobile Safari: Playwright 1.58 has no touch input there but `tap`.
 * `mouse.wheel` throws "Mouse wheel is not supported in mobile WebKit"
 * (overlay-reach.spec pins it), `Touchscreen` has nothing but `tap`, and CDP
 * is Chromium's. So the closest input the engine itself scrolls with is the
 * keyboard: focus goes to the first focusable element in the scroller (the
 * dialog, which takes focus at -1, or its first control), without scrolling to
 * it, and PageDown is pressed, each press waited out until the scroller is
 * still. Focus from script does not enter a frame whose document does not
 * have focus: in demo-phone's Drawer/long-sheet the keys then went to the docs
 * page, which scrolled 475 to 531 px a press while the sheet stayed at 0. So it is
 * checked, and the caller gives the document focus first, as a reader's tap
 * does. WebKit animates
 * a keyboard scroll and the next press cuts it short: ten presses in quick
 * succession reached the last control in 1 of the 10 overlay-reach cases,
 * pressed this way 10 of 10, in 2 or 3 presses. `scrollIntoViewIfNeeded`,
 * `focus()` and `element.scrollBy` reach all ten too, but none is an input:
 * they set the scroll position from script, which is what this is meant to
 * prove the user can do.
 */
export async function scrollUntil(
  page: Page,
  target: Locator,
  reached: () => Promise<boolean>,
  { tries = 20, beyond = 0 }: { tries?: number; beyond?: number } = {},
): Promise<Scrolled> {
  const engine = page.context().browser()?.browserType().name();
  const hasTouch = await page.evaluate(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);
  const input: Scrolled["input"] = !hasTouch ? "wheel" : engine === "chromium" ? "swipe" : "keys";
  const scroller = await target.evaluateHandle((el) => {
    for (let n = el.parentElement; n; n = n.parentElement) {
      if (/auto|scroll/.test(getComputedStyle(n).overflowY) && n.scrollHeight > n.clientHeight + 1) return n;
    }
    throw new Error("nothing around the target scrolls");
  });
  let box = (await scroller.boundingBox())!;
  const clip = (b: { x: number; y: number; width: number; height: number }) => {
    const left = Math.max(box.x, b.x);
    const top = Math.max(box.y, b.y);
    box = { x: left, y: top, width: Math.min(box.x + box.width, b.x + b.width) - left, height: Math.min(box.y + box.height, b.y + b.height) - top };
  };
  const viewport = page.viewportSize()!;
  clip({ x: 0, y: 0, ...viewport });
  for (let frame = (await scroller.ownerFrame())!; frame.parentFrame(); frame = frame.parentFrame()!) {
    clip((await (await frame.frameElement()).boundingBox())!);
  }
  const x = box.x + box.width / 2;
  const from = box.y + box.height * 0.9;
  const to = box.y + box.height * 0.1;
  const cdp = input === "swipe" ? await page.context().newCDPSession(page) : undefined;
  if (input === "wheel") await page.mouse.move(x, box.y + box.height / 2);
  if (input === "keys") {
    const focused = await scroller.evaluate((n) => {
      const first = n.querySelector<HTMLElement>("[tabindex], button, a[href], input, select, textarea") ?? n;
      first.focus({ preventScroll: true });
      return document.hasFocus() && document.activeElement === first;
    });
    if (!focused) throw new Error("scrollUntil: focus did not land in the scroller, so PageDown would scroll something else; put focus in its document first");
  }
  const still = () =>
    scroller.evaluate(
      (n) =>
        new Promise<void>((resolve) => {
          let last = n.scrollTop;
          let same = 0;
          let frames = 0;
          const tick = () => {
            same = n.scrollTop === last ? same + 1 : 0;
            last = n.scrollTop;
            frames += 1;
            if (same >= 6 || frames >= 120) resolve();
            else requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
    );
  let gestures = 0;
  let past = 0;
  while (gestures < tries) {
    if ((await reached()) && ++past > beyond) break;
    gestures += 1;
    if (input === "wheel") await page.mouse.wheel(0, 400);
    if (input === "keys") await page.keyboard.press("PageDown");
    if (cdp) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: from }] });
      for (let i = 1; i <= 12; i++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: from + ((to - from) * i) / 12 }] });
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    }
    await still();
  }
  await cdp?.detach();
  await scroller.dispose();
  return { input, gestures };
}
