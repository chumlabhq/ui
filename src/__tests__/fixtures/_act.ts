import type { Fixture } from "./types.js";

/**
 * The gestures a fixture may perform, and the only route it has to the DOM.
 *
 * Fixture acts used to call `fireEvent` from @testing-library directly. That
 * library is a jsdom-tier dependency, and the fixture PAGE — the one every
 * browser suite drives — never invoked `act` at all, so 50 fixtures named for a
 * state they reach by interaction rendered in their base state in the browser.
 * `Table/filter-open` showed a table with no filter menu to visual, a11y-full
 * and the e2e specs alike, and nothing failed, because a closed menu is a
 * perfectly valid render.
 *
 * The remedy is this interface. An act receives its tools rather than importing
 * them, so there is no `fireEvent` in scope to reach for, and both tiers supply
 * an implementation that works in their environment. `no-testing-library.contract`
 * keeps the import out; the fixture page runs the act and reports a no-op.
 */
export interface ActTools {
  /** A bubbling click. Not the full pointer sequence — see `pointerDown`. */
  click(target: Element | null | undefined): void;
  dblClick(target: Element | null | undefined): void;
  /**
   * Both halves of a real hover: the bubbling `mouseover` React synthesises
   * `onMouseEnter` from, and the non-bubbling `mouseenter` itself.
   */
  mouseEnter(target: Element | null | undefined): void;
  pointerDown(
    target: Element | null | undefined,
    init?: { pointerId?: number; clientX?: number; clientY?: number; buttons?: number },
  ): void;
  /** Moves focus for real, rather than dispatching a focus event at an element
   *  that stays unfocused. */
  focus(target: Element | null | undefined): void;
  keyDown(target: Element | null | undefined, key: string): void;
  /** Sets the value through the native setter, so React's value tracker sees
   *  the change, then fires `input` and `change` the way typing does. */
  change(target: Element | null | undefined, value: string): void;
  /** Flushes effects and timers. Portalled surfaces mount in a layout effect
   *  that measures the trigger, so they are absent from the first render pass. */
  settle(ms?: number): Promise<void>;
}

/**
 * A missed selector is a failure, not a skip.
 *
 * Every act was written `const btn = c.querySelector(...); if (btn) fireEvent...`,
 * which turns a renamed selector into a fixture that silently renders its base
 * state — the same defect as never running the act, one fixture at a time.
 */
const required = (target: Element | null | undefined): Element => {
  if (!target) throw new Error("fixture act: target element not found");
  return target;
};

const dispatch = (target: Element, event: Event) => {
  target.dispatchEvent(event);
};

/**
 * No `view`. jsdom rejects the window it hands out itself — vitest wraps the
 * global in a proxy for teardown, so `document.defaultView` passes an identity
 * check and fails jsdom's brand check: "member view is not of type Window".
 * Nothing in the library reads `event.view`, and leaving it unset behaves the
 * same in both tiers.
 */
/** `detail` is the click count, which some handlers read to tell one from two. */
const mouse = (type: string, bubbles: boolean, detail = 0) =>
  new MouseEvent(type, { bubbles, cancelable: true, detail });

/**
 * React reads an input's value off the tracker it installed on the instance, so
 * assigning `.value` directly is invisible to it. The prototype setter is the
 * documented way past that.
 */
const setNativeValue = (element: Element, value: string) => {
  const prototype = Object.getPrototypeOf(element) as object;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  if (descriptor?.set) descriptor.set.call(element, value);
  else (element as HTMLInputElement).value = value;
};

/**
 * The gestures themselves, shared by both tiers.
 *
 * Only `settle` and the act-wrapping differ between jsdom and the browser; the
 * events do not, which is the point — a fixture that opens a menu in the
 * contract tier opens the same menu on the fixture page.
 */
export const gestures = {
  click: (target: Element | null | undefined) => {
    const element = required(target);
    dispatch(element, mouse("click", true, 1));
  },
  dblClick: (target: Element | null | undefined) => {
    const element = required(target);
    dispatch(element, mouse("dblclick", true, 2));
  },
  mouseEnter: (target: Element | null | undefined) => {
    const element = required(target);
    dispatch(element, mouse("mouseover", true));
    dispatch(element, mouse("mouseenter", false));
  },
  pointerDown: (
    target: Element | null | undefined,
    init: { pointerId?: number; clientX?: number; clientY?: number; buttons?: number } = {},
  ) => {
    const element = required(target) as HTMLElement;
    // jsdom implements no pointer capture and the drag handlers call it on the
    // target, so the handler throws before it can set state. Stubbed only when
    // absent, which leaves the real browser's implementation alone.
    if (!element.setPointerCapture) element.setPointerCapture = () => {};
    if (!element.releasePointerCapture) element.releasePointerCapture = () => {};
    dispatch(
      element,
      new PointerEvent("pointerdown", { bubbles: true, cancelable: true, ...init }),
    );
  },
  focus: (target: Element | null | undefined) => (required(target) as HTMLElement).focus(),
  keyDown: (target: Element | null | undefined, key: string) =>
    dispatch(required(target), new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })),
  change: (target: Element | null | undefined, value: string) => {
    const element = required(target);
    setNativeValue(element, value);
    dispatch(element, new Event("input", { bubbles: true }));
    dispatch(element, new Event("change", { bubbles: true }));
  },
};

/**
 * The browser implementation, used by the fixture page.
 *
 * No `act` to wrap in — React commits on its own schedule here — so `settle`
 * waits out a frame as well as the timer, which is what a portal's measuring
 * layout effect needs.
 */
export const browserActTools: ActTools = {
  ...gestures,
  settle: async (ms = 0) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    await new Promise((resolve) => setTimeout(resolve, 0));
  },
};

/** Whether a fixture's rendered state depends on its act having run. */
export const needsAct = (fixture: Pick<Fixture, "act">) => typeof fixture.act === "function";
