import { expect, test } from "./_test";
import { gotoFixture, gotoFixtureIndex } from "./_nav";
import { markPortalRoots, PORTAL_MARK } from "./_portals.js";

/**
 * Everything that acts on a click says so with the cursor.
 *
 * The previous version of this sweep selected on role, and was deleted rather
 * than kept, because it could not be made to fail: by the time it ran, every
 * element it could see already carried `cursor-pointer`, so it asserted a
 * tautology. The gap it could not see is the interesting half — a Slider mark
 * dot is clickable and is not a button, has no role, and takes no handler of
 * its own; it sits on top of a control that does. A sweep keyed to roles misses
 * it by construction.
 *
 * So selection is by BEHAVIOUR, from two sources:
 *
 *  - React's own props, read off the DOM node's `__reactProps$…` key. That is
 *    where `onClick` actually lives — React attaches one listener at the root,
 *    so `el.onclick` is null on every component in the library and a sweep that
 *    checked it would find nothing. Same trick, and the same justification, as
 *    `markPortalRoots` reading `__reactFiber$…`.
 *  - Interactive roles and tags, for anything the platform makes clickable
 *    without the library binding a handler.
 *
 * `cursor` inherits, which is what makes the mark dot reachable: the assertion
 * lands on the control that owns the handler, and the dot on top of it inherits
 * whatever that control declares.
 */

/**
 * Cursors that are an answer, with the reason each is allowed.
 *
 * `default` and `auto` are the failure: they say "this is page furniture" on
 * something that is not. Everything else here is a deliberate statement.
 */
const MEANINGFUL = new Set([
  "pointer", // the ordinary answer
  "grab", // a drag handle at rest
  "grabbing", // the same handle mid-drag
  "text", // a text input: clicking places a caret
  "not-allowed", // disabled, and saying so
  "col-resize",
  "row-resize",
  "ew-resize",
  "ns-resize",
  "move",
  "crosshair",
  "wait",
  "progress",
]);

const INTERACTIVE =
  'button,a[href],input,select,textarea,summary,[contenteditable="true"],' +
  '[role="button"],[role="link"],[role="option"],[role="menuitem"],[role="menuitemcheckbox"],' +
  '[role="menuitemradio"],[role="checkbox"],[role="radio"],[role="switch"],[role="tab"],[role="slider"]';

/**
 * A handler is not always an invitation, and two kinds are not.
 *
 * A dismissal surface takes `onClick` so that clicking OUTSIDE the content
 * closes it — the overlay behind a drawer, the dialog panel that stops the
 * click from reaching that overlay. Neither is a control and neither should
 * claim to be one: a pointer cursor over the whole backdrop would say the
 * opposite of the truth, which is that clicking there dismisses.
 *
 * The library's own elements are the subject, so the scope is the `cl-s`
 * marker. A fixture writes its own trigger buttons — "Open Drawer", "Index 0" —
 * and those are the fixture's markup, unscoped and unstyled on purpose; holding
 * the library to them would make this sweep a report on the test harness.
 */
const NOT_AN_INVITATION = '[role="dialog"],[role="alertdialog"]';

/**
 * Removed from the page's meaning, so making no promise about the pointer: an
 * element that IS one of these, or sits inside one. Not one that merely
 * CONTAINS one.
 *
 * These shared NOT_AN_INVITATION's contains-match until 2026-10-08, and every
 * control holding an `aria-hidden` icon — a chevron, a clear X, a check — was
 * dropped as though it were a backdrop: 545 reachable controls across 16
 * components, TimePicker's clear button among them, measured by nothing.
 * `presentation` and `none` mark separators, connectors and shimmer rows in
 * this library, so containing one is the same mistake.
 */
const REMOVED_FROM_PAGE = '[aria-hidden="true"],[role="presentation"],[role="none"]';

type Finding = { fixture: string; detail: string };

/**
 * Text-entry controls, which WebKit draws with the text cursor while computing
 * `auto` for them.
 *
 * Measured on this Mac in a bare page, no stylesheet: chromium and firefox
 * compute `text` on `<textarea>` and on `<input>` of type text, search, email,
 * url, tel, password and number; webkit computes `auto` on every one of them
 * and still shows the I-beam, because `auto` is the UA's own choice and its
 * choice over editable text is the text cursor. A `<button>` computes
 * `default` in all three. So `auto` is accepted here, and only here: on these
 * controls, in WebKit. Anywhere else it is the failure it always was — the
 * HEAD sweep in webkit reported exactly these 100 controls and nothing else.
 */
const TEXT_ENTRY_TYPES = ["text", "search", "email", "url", "tel", "password", "number"];

type SweepArgs = {
  scopes: string[];
  interactive: string;
  allowed: string[];
  surfaces: string;
  removed: string;
  autoOnTextEntry: boolean;
  textEntryTypes: string[];
};

/** The in-page check, shared by the sweep and its plant. */
const sweepCursors = ({ scopes, interactive, allowed, surfaces, removed, autoOnTextEntry, textEntryTypes }: SweepArgs) => {
  const reactProps = (el: Element): Record<string, unknown> | null => {
    const key = Object.keys(el).find((k) => k.startsWith("__reactProps$"));
    return key ? ((el as unknown as Record<string, unknown>)[key] as Record<string, unknown>) : null;
  };
  const selector = scopes.map((s) => `${s} *`).join(",");
  const bad: string[] = [];
  let bound = 0;
  let seen = 0;

  for (const el of document.querySelectorAll<HTMLElement>(selector)) {
    const props = reactProps(el);
    const hasHandler = !!props && (typeof props.onClick === "function" || typeof props.onPointerDown === "function");
    if (hasHandler) bound += 1;
    const byRole = el.matches(interactive);
    if (!hasHandler && !byRole) continue;
    // The library's own markup only, and not a dismissal surface.
    if (!el.classList.contains("cl-s")) continue;
    // The dismissal chain is the surface AND the wrappers around it: a
    // modal's positioner takes `onClick` to stop the click reaching the
    // overlay, which is the same not-an-invitation as the panel itself.
    if (el.matches(surfaces) || el.querySelector(surfaces)) continue;
    if (el.closest(removed)) continue;
    // An element nobody can reach makes no promise about the pointer.
    // `disabled` is only a property on form controls, so the ARIA and
    // data forms are checked too — `ResizablePanel`'s separator is a div
    // and reported as a finding until this looked at `aria-disabled`.
    if ((el as HTMLInputElement).disabled) continue;
    if (el.getAttribute("aria-disabled") === "true" || el.hasAttribute("data-disabled")) continue;
    const style = getComputedStyle(el);
    if (style.pointerEvents === "none" || style.display === "none" || style.visibility === "hidden") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    seen += 1;
    const textEntry =
      el instanceof HTMLTextAreaElement || (el instanceof HTMLInputElement && textEntryTypes.includes(el.type));
    if (!allowed.includes(style.cursor) && !(autoOnTextEntry && textEntry && style.cursor === "auto")) {
      bad.push(
        `<${el.tagName.toLowerCase()}${el.getAttribute("role") ? ` role=${el.getAttribute("role")}` : ""}> ` +
          `cursor=${style.cursor} ${hasHandler ? "(handler)" : "(role)"} "${(el.textContent ?? "").trim().slice(0, 20)}"`,
      );
    }
  }
  return { bad, bound, seen };
};

test("everything clickable declares a cursor", async ({ page, browserName }) => {
  test.setTimeout(1_800_000);
  await gotoFixtureIndex(page);
  const paths = await page.locator("[data-fixture-index] li a").evaluateAll((els) =>
    els.map((e) => new URL((e as HTMLAnchorElement).href).pathname),
  );

  const findings: Finding[] = [];
  let handlerBound = 0;
  let checked = 0;

  const actFailures: string[] = [];

  for (const path of paths) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    /**
     * Swept once the page has finished becoming the fixture, not when its
     * element attaches.
     *
     * This read the page the moment `[data-fixture]` attached, with that wait's
     * timeout swallowed, and the population read 1517, 1515, 1512 and 1502 for
     * one source tree — a number that moved with how fast Vite answered.
     * Waiting on the act fixed `Dropdown/async-load-resolved` (2 warm, 0 cold)
     * and not `TimePicker/open-clock` (6 warm, 1 cold), which has no act and so
     * reports a terminal act status at mount. `data-fixture-still` is the
     * harness's own holds-still answer, published after the act for every
     * fixture. 30s: the accessibility-full audit's 20s for the act, plus the
     * harness's 1.5s quiet cap and 3s holds-still deadline, with margin.
     */
    await expect(page.locator("[data-fixture]")).toBeAttached({ timeout: 15000 });
    const settled = await page
      .waitForFunction(
        () => {
          const main = document.querySelector("main[data-fixture-act]");
          const act = main?.getAttribute("data-fixture-act");
          const still = main?.getAttribute("data-fixture-still");
          return act && act !== "pending" && still && still !== "pending" ? `${act}|${still}` : null;
        },
        undefined,
        { timeout: 30000 },
      )
      .then((handle) => handle.jsonValue() as Promise<string>)
      .catch(() => "never settled|never settled");
    const [actStatus, stillStatus] = settled.split("|");
    const fixtureName = path.replace("/__fixtures/", "");
    if (actStatus.startsWith("error") || actStatus === "never settled") {
      actFailures.push(`${fixtureName}: act ${actStatus}`);
    }
    if (stillStatus !== "still") actFailures.push(`${fixtureName}: page ${stillStatus === "unsettled" ? "never held still" : stillStatus}`);
    const portals = await markPortalRoots(page);
    const roots = ["[data-fixture]", ...(portals > 0 ? [`[${PORTAL_MARK}]`] : [])];

    const r = await page.evaluate(sweepCursors, {
      scopes: roots,
      interactive: INTERACTIVE,
      allowed: [...MEANINGFUL],
      surfaces: NOT_AN_INVITATION,
      removed: REMOVED_FROM_PAGE,
      autoOnTextEntry: browserName === "webkit",
      textEntryTypes: TEXT_ENTRY_TYPES,
    });

    handlerBound += r.bound;
    checked += r.seen;
    for (const b of new Set(r.bad)) findings.push({ fixture: path.replace("/__fixtures/", ""), detail: b });
  }

  console.log(`POINTER_AFFORDANCE checked=${checked} withReactHandler=${handlerBound} findings=${findings.length}`);
  for (const f of findings) console.log(`POINTER_AFFORDANCE_FINDING ${f.fixture}: ${f.detail}`);

  // A fixture whose act never landed, or whose page never held still, was
  // swept in some other state than the one it is named for, so its count is
  // not evidence of anything.
  expect(actFailures, "these fixtures were swept before the page finished becoming the fixture").toEqual([]);

  // A sweep that found nothing to check is not a pass. Both halves are floored
  // separately: the role half would still be met if reading React's props broke
  // and silently returned nothing, which is the failure that would matter most.
  expect(checked, "the sweep reached no clickable element at all").toBeGreaterThan(200);
  expect(handlerBound, "no React onClick was found — the props key read is broken").toBeGreaterThan(50);
  expect(
    findings.map((f) => `${f.fixture}: ${f.detail}`),
    "these act on a click and show the default cursor, so nothing on screen says they can be used",
  ).toEqual([]);
});

/**
 * The WebKit allowance is for text entry, not for `auto`.
 *
 * A planted `cursor: auto` button has to fail in every engine, WebKit
 * included, and a planted text input has to pass in every engine — `text` in
 * chromium and firefox, `auto` in webkit.
 */
test("a cursor: auto button still fails, a text input passes", async ({ page, browserName }) => {
  await gotoFixture(page, "Button", "default");
  await page.evaluate(() => {
    const host = document.querySelector("[data-fixture]")!;
    const button = document.createElement("button");
    button.className = "cl-s";
    button.style.cursor = "auto";
    button.textContent = "Planted";
    const input = document.createElement("input");
    input.className = "cl-s";
    input.type = "text";
    host.append(button, input);
  });
  const r = await page.evaluate(sweepCursors, {
    scopes: ["[data-fixture]"],
    interactive: INTERACTIVE,
    allowed: [...MEANINGFUL],
    surfaces: NOT_AN_INVITATION,
    removed: REMOVED_FROM_PAGE,
    autoOnTextEntry: browserName === "webkit",
    textEntryTypes: TEXT_ENTRY_TYPES,
  });
  const cursors = await page.evaluate(() => {
    const host = document.querySelector("[data-fixture]")!;
    return [...host.querySelectorAll(":scope > button.cl-s:last-of-type, :scope > input.cl-s")].map((e) => `${e.tagName.toLowerCase()}=${getComputedStyle(e).cursor}`);
  });
  console.log(`POINTER_AFFORDANCE_PLANT ${browserName}: ${cursors.join(" ")}; findings ${JSON.stringify(r.bad)}`);
  expect(r.bad.some((b) => b.startsWith("<button> cursor=auto") && b.includes("Planted")), "the planted cursor: auto button was accepted").toBe(true);
  expect(r.bad.some((b) => b.startsWith("<input")), "the planted text input was reported").toBe(false);
});
