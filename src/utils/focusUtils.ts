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
 * Extracted from Modal so the two `aria-modal` surfaces share one
 * implementation. The event is typed structurally so the same function serves a
 * React synthetic handler and a native `document` listener.
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

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
