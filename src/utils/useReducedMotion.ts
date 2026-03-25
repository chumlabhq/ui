import { useEffect, useState } from "react";

export function useReducedMotion(reduceMotion: boolean | "auto" = "auto"): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (reduceMotion !== "auto") return;
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);

    // Safari 14+ supports addEventListener, older Safari uses addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      // Fallback for Safari < 14
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [reduceMotion]);

  return reduceMotion === "auto" ? prefersReducedMotion : reduceMotion;
}
