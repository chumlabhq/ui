import { useEffect } from "react";

const BASE_TITLE = "Chumlab UI";

/**
 * Sets document.title on mount and restores the base title on unmount.
 * Keeps browser tab and search-engine snippet titles in sync with the current route.
 * Optionally sets a meta description for per-page SEO and AI discoverability.
 */
export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      const original = meta?.getAttribute("content") ?? "";
      if (meta) {
        meta.setAttribute("content", description);
      } else {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        meta.setAttribute("content", description);
        document.head.appendChild(meta);
      }
      return () => {
        if (meta) meta.setAttribute("content", original);
      };
    }

    return () => {
      document.title = BASE_TITLE;
    };
  }, [title, description]);
}
