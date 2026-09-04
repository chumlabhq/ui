export { isBrowser } from "../../../utils/isBrowser";

export function scrollOptionIntoView(element: HTMLElement): void {
  try {
    element.scrollIntoView({ block: "nearest" });
  } catch {
    element.scrollIntoView(false);
  }
}