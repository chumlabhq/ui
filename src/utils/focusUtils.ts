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
  ).filter(isVisible);
}
