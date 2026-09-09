import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Chrome restores the previous scroll offset on a reload, and it applies that
// restoration after React has run its effects — so the `scrollTo` below was
// setting 0 and then being overwritten, and a reload landed you wherever you
// had been reading. It looked like the page was scrolling itself on mount; it
// was the browser putting you back. Taking manual control is what makes the
// reset below the thing that decides.
//
// Set at module scope rather than in the effect: by the time an effect runs the
// restoration is already scheduled.
if (typeof history !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
