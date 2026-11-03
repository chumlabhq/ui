import type { DemoDirection } from "./useDemoDirection.js";

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
