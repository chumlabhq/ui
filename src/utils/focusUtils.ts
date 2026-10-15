import { focusAndReveal } from "./focusAndReveal.js";

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([tabindex="-1"])',
].join(",");

function isVisible(el: HTMLElement): boolean {
  if (el.closest("[hidden], [inert], [aria-hidden='true']")) return false;
  try {
    const computed = getComputedStyle(el);
    return computed.display !== "none" && computed.visibility !== "hidden";
  } catch {
    return el.style.display !== "none" && el.style.visibility !== "hidden";
  }
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => {
    if ((el as HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).disabled) return false;
    return isVisible(el);
  });
}

/**
 * Keeps Tab inside `container`, wrapping at both ends.
 *
 * Shared by the three `aria-modal` surfaces — Modal, Drawer and DatePicker — so
 * there is one implementation rather than three.
 *
 * It moves focus itself on every Tab rather than only intervening when focus is
 * already on the first or last element. That looks like more work than needed,
 * and on Chromium it is; on WebKit it is the difference between a trap and no
 * trap at all. Safari omits buttons from the sequential tab order unless Full
 * Keyboard Access is on, so a drawer containing only buttons never reports
 * `activeElement === last`, the boundary test never fires, and Tab walks out of
 * the dialog into the page behind it. That is a real failure for a Safari user,
 * not a headless quirk: `drawer.spec.ts` caught it in webkit and Mobile Safari
 * the first time those projects were ever executed.
 *
 * Driving the order from `getFocusableElements` instead of from the platform
 * makes the trap behave the same in every browser.
 *
 * The event is typed structurally so the same function serves a React synthetic
 * handler and a native `document` listener.
 *
 * With no focusable descendant the Tab is swallowed rather than allowed to
 * escape: a dialog that claims `aria-modal` must not hand focus back to content
 * it has told assistive tech is inert.
 */
export function cycleTabWithin(
  container: HTMLElement,
  event: { shiftKey: boolean; preventDefault: () => void },
): void {
  const focusable = getFocusableElements(container);
  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  const active = document.activeElement;
  const current =
    active instanceof HTMLElement ? focusable.indexOf(active) : -1;

  event.preventDefault();

  // Focus already outside the container — WebKit's Tab order can put it on
  // <body> — so re-enter at the end the user was heading towards.
  if (current === -1) {
    focusAndReveal(event.shiftKey ? focusable[focusable.length - 1] : focusable[0]);
    return;
  }

  const next = event.shiftKey
    ? (current - 1 + focusable.length) % focusable.length
    : (current + 1) % focusable.length;
  focusAndReveal(focusable[next]);
}
