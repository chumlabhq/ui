import { isBrowser } from "../../../utils/isBrowser";

export { isBrowser };

export function scrollOptionIntoView(element: HTMLElement): void {
  try {
    element.scrollIntoView({ block: "nearest" });
  } catch {
    element.scrollIntoView(false);
  }
}