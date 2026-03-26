export { isBrowser } from "../../../utils/isBrowser";

export interface DropdownCoords {
  top: number;
  left: number;
  width: number;
  position: "top" | "bottom";
}

export function computeDropdownCoords(
  triggerEl: HTMLElement,
  dropdownEl: HTMLElement,
  preferredPosition: "top" | "bottom",
  gap: number,
): DropdownCoords {
  const rect = triggerEl.getBoundingClientRect();
  const dropdownHeight = dropdownEl.getBoundingClientRect().height;

  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;

  let position = preferredPosition;

  if (position === "bottom" && rect.bottom + gap + dropdownHeight > viewportHeight) {
    if (rect.top - gap - dropdownHeight > 0) {
      position = "top";
    }
  } else if (position === "top" && rect.top - gap - dropdownHeight < 0) {
    if (rect.bottom + gap + dropdownHeight <= viewportHeight) {
      position = "bottom";
    }
  }

  const top = position === "top"
    ? rect.top - dropdownHeight - gap
    : rect.bottom + gap;

  let left = rect.left;
  const dropdownRect = dropdownEl.getBoundingClientRect();
  const actualWidth = Math.max(rect.width, dropdownRect.width);
  if (left + actualWidth > viewportWidth) {
    left = Math.max(0, viewportWidth - actualWidth);
  }

  return { top, left, width: rect.width, position };
}

export function scrollOptionIntoView(element: HTMLElement): void {
  try {
    element.scrollIntoView({ block: "nearest" });
  } catch {
    element.scrollIntoView(false);
  }
}