import { isBrowser } from "../../../utils/isBrowser";

export { isBrowser };

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
  forcePosition = false,
): DropdownCoords {
  const rect = triggerEl.getBoundingClientRect();
  const dropdownHeight = dropdownEl.getBoundingClientRect().height;

  const viewportHeight = isBrowser ? (window.visualViewport?.height ?? window.innerHeight) : 768;
  const viewportWidth = isBrowser ? (window.visualViewport?.width ?? window.innerWidth) : 1024;

  let position = preferredPosition;

  if (!forcePosition) {
    if (position === "bottom" && rect.bottom + gap + dropdownHeight > viewportHeight) {
      if (rect.top - gap - dropdownHeight > 0) {
        position = "top";
      }
    } else if (position === "top" && rect.top - gap - dropdownHeight < 0) {
      if (rect.bottom + gap + dropdownHeight <= viewportHeight) {
        position = "bottom";
      }
    }
  }

  const top = position === "top"
    ? rect.top - dropdownHeight - gap
    : rect.bottom + gap;

  let left = rect.left;
  const dropdownWidth = rect.width;
  if (left + dropdownWidth > viewportWidth) {
    left = Math.max(0, viewportWidth - dropdownWidth);
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