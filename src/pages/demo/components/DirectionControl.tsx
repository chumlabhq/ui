import { useEffect, useState } from "react";

export type DemoDirection = "ltr" | "rtl";

/** Where a viewer's choice is remembered: a convenience only, so a blocked store just forgets it. */
export const DEMO_DIRECTION_KEY = "chumlab-demo-dir";

function readStoredDirection(): DemoDirection {
  try {
    return window.localStorage.getItem(DEMO_DIRECTION_KEY) === "rtl" ? "rtl" : "ltr";
  } catch {
    return "ltr";
  }
}

/**
 * The demo pages' direction, written on the document root while a demo page is
 * shown.
 *
 * The root, not the content column: Drawer, Modal, Toast and every menu portal
 * to `<body>`, so a `dir` on the column left each of them laid out left to
 * right beside a right-to-left trigger (a start Drawer anchored to the left).
 * A consumer's right-to-left page sets it on `<html>` too. The attribute the
 * page had before is put back when the docs layout unmounts.
 */
export function useDemoDirection(): [DemoDirection, (next: DemoDirection) => void] {
  const [direction, setDirection] = useState<DemoDirection>(readStoredDirection);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute("dir");
    root.setAttribute("dir", direction);
    return () => {
      if (previous === null) root.removeAttribute("dir");
      else root.setAttribute("dir", previous);
    };
  }, [direction]);

  const choose = (next: DemoDirection) => {
    setDirection(next);
    try {
      window.localStorage.setItem(DEMO_DIRECTION_KEY, next);
    } catch {
      // Site data blocked: the choice lasts for this visit only.
    }
  };

  return [direction, choose];
}

/** One control for every demo page: a toggle button, named by its text, that flips the pages between left to right and right to left. */
export function DirectionToggle({
  direction,
  onChange,
}: {
  direction: DemoDirection;
  onChange: (next: DemoDirection) => void;
}) {
  const rtl = direction === "rtl";
  return (
    <button
      type="button"
      aria-pressed={rtl}
      onClick={() => onChange(rtl ? "ltr" : "rtl")}
      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md border border-border-faint bg-bg-elevated text-fg font-sans text-[13px] cursor-pointer hover:border-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      data-track-event="docs_direction_toggle"
    >
      <span>Right to left</span>
      <span aria-hidden className="font-mono text-[11px] text-fg-tertiary">
        {rtl ? "on" : "off"}
      </span>
    </button>
  );
}
