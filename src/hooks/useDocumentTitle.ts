import { useEffect } from "react";

const BASE_TITLE = "Chumlab UI";

/**
 * Sets document.title on mount and restores the base title on unmount.
 * Keeps browser tab and search-engine snippet titles in sync with the current route.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
