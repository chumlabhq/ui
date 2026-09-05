import type { CSSProperties } from "react";

/**
 * How a floating surface hides while it is being measured.
 *
 * `useAnchoredPosition` cannot measure an element that is not in the DOM, so
 * every surface renders one frame before it knows where to sit. That frame has
 * to be invisible or it flashes at the top-left corner.
 *
 * It was `visibility: hidden`, and that quietly broke focus: an element inside a
 * `visibility: hidden` subtree is not focusable, so a `.focus()` call in the
 * open effect did nothing at all. Four components tried to move focus into
 * their surface on open — the two searchable dropdowns to their search box,
 * Pagination to its listbox, Breadcrumb to its first item — and none of them
 * ever succeeded. One of them had a `setTimeout(…, 10)` around it, which is
 * somebody having found the symptom and guessed at how long the frame lasts.
 *
 * `opacity: 0` paints nothing while leaving the subtree focusable. The element
 * is briefly in the accessibility tree, which is the trade: a surface that is
 * about to be shown is announced a frame early, rather than a focus call that
 * never lands.
 *
 * `pointer-events: none` keeps the invisible frame from swallowing the click
 * that opened it.
 */
export const MEASURING_STYLE: CSSProperties = {
  opacity: 0,
  pointerEvents: "none",
  top: 0,
  left: 0,
};

/**
 * The style a floating surface carries, given where it has been measured to and
 * whether that measurement has settled.
 *
 * Three states, not two, and the middle one is the reason this is shared:
 *
 * - not measured yet — at the corner, invisible, and not taking pointers
 * - measured but not settled — in the right place, invisible, taking pointers
 * - settled — visible
 *
 * Collapsing the middle state into the first is what made a surface unclickable:
 * `pointer-events: none` stayed on through the settling frame, so the first
 * click into a menu did nothing.
 */
export function surfaceStyle(
  placed: CSSProperties | null,
  isStable: boolean,
): CSSProperties {
  if (!placed) return MEASURING_STYLE;
  return isStable ? placed : { ...placed, opacity: 0 };
}
