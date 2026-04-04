import { useEffect } from "react";
import { PRINT_STYLES } from "../utils/constants";
import { isBrowser } from "../../../utils/isBrowser";

let printStyleRefCount = 0;
let printStyleElement: HTMLStyleElement | null = null;

export function usePrintStyles(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !isBrowser) return;

    printStyleRefCount++;
    if (printStyleRefCount === 1) {
      printStyleElement = document.createElement("style");
      printStyleElement.setAttribute("data-accordion-print-styles", "");
      printStyleElement.textContent = PRINT_STYLES;
      document.head.appendChild(printStyleElement);
    }

    return () => {
      printStyleRefCount--;
      if (printStyleRefCount === 0 && printStyleElement) {
        document.head.removeChild(printStyleElement);
        printStyleElement = null;
      }
    };
  }, [enabled]);
}
