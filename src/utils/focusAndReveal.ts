/**
 * Moves focus to `el` and brings it into view inside whatever scrolls around it.
 *
 * For a roving focus — a grid cell, a menu item — that the component moves
 * itself. `focus({ preventScroll: true })` alone keeps the page from jumping
 * and leaves the target wherever it was, which in a scroll region narrower
 * than its content is outside it. `block` and `inline` at "nearest" scroll
 * only when the target is not already in view, and only as far as it takes.
 */
export function focusAndReveal(el: HTMLElement): void {
  el.focus({ preventScroll: true });
  el.scrollIntoView({ block: "nearest", inline: "nearest" });
}
