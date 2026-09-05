import type { MouseEvent } from "react";

/**
 * Focuses a surface trigger on mouse-down, because Safari will not.
 *
 * WebKit does not leave focus on a `<button>` that has been clicked, unless the
 * user has turned on Full Keyboard Access. `document.activeElement` is `<body>`
 * by the time the click handler runs. Chromium and Gecko focus it. Two defects
 * follow, and both were invisible until the release matrix ran WebKit:
 *
 * 1. A combobox that keeps focus on its trigger and points at the highlighted
 *    option with `aria-activedescendant` is describing that option to whatever
 *    holds focus. In Safari that is `<body>`, so the announcement goes nowhere
 *    for every Safari user, on every mouse-opened menu.
 * 2. A surface that dismisses on blur reads `relatedTarget` to tell "focus left
 *    me" from "focus moved inside me". A click on an unfocusable trigger gives
 *    `relatedTarget: null`, which reads as the former — so the surface closes on
 *    the blur and the click that caused it reopens. Pagination stayed open
 *    forever in Safari and closed correctly in Chromium, which is why nothing
 *    caught it for the life of this branch.
 *
 * Focusing alone does not hold. Tracing the sequence in WebKit shows the focus
 * landing and then being taken away again by the default action:
 *
 *     pointerdown  active=BODY      (our .focus() runs here)
 *     focus        active=BUTTON
 *     mousedown    active=BUTTON
 *     blur         active=BODY      <- WebKit's default, undoing it
 *     mouseup      active=BODY
 *     click        active=BODY
 *
 * So the default is prevented rather than raced. Re-focusing at `click` also
 * ends with the trigger focused, and was rejected: it leaves a window in which
 * focus is on `<body>` and a real `blur` has fired, which is exactly the window
 * defect 2 lives in.
 *
 * Primary button only. Prevented defaults on a secondary or middle click would
 * take the context menu and the browser's own paste-and-go with them, and
 * neither has anything to do with this.
 */
export function focusTriggerOnMouseDown(event: MouseEvent<HTMLElement>): void {
  if (event.button !== 0) return;
  const trigger = event.currentTarget;
  event.preventDefault();
  // `preventScroll`, because focusing a trigger the user just pointed at must
  // not scroll the page out from under them.
  if (trigger !== trigger.ownerDocument.activeElement) {
    trigger.focus({ preventScroll: true });
  }
}
