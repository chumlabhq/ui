export const CSS_VARS = {
  trackerChecked: "--switch-tracker-checked-bg",
  trackerUnchecked: "--switch-tracker-unchecked-bg",
  thumbBg: "--switch-thumb-bg",
  focusRing: "--switch-focus-ring",
  thumbSize: "--switch-thumb-size",
  trackerWidth: "--switch-tracker-width",
  trackerHeight: "--switch-tracker-height",
} as const;

export { CSS_VARS as SWITCH_CSS_VARS };

export const defaultStyles = {
  container: "gap-3",
  label: "text-sm font-medium text-gray-700",
  disabledLabel: "text-gray-400",
  description: "text-xs text-gray-500",
  tracker:
    "h-[var(--switch-tracker-height,1.25rem)] w-[var(--switch-tracker-width,2.25rem)] rounded-full transition-colors duration-200 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--switch-focus-ring,#3b82f6)]",
  disabledTracker: "opacity-50",
  thumb:
    "h-[var(--switch-thumb-size,1rem)] w-[var(--switch-thumb-size,1rem)] rounded-full bg-[var(--switch-thumb-bg,white)] shadow-md transition-transform duration-200 motion-reduce:transition-none",
  checkedTracker: "bg-[var(--switch-tracker-checked-bg,#2563eb)]",
  uncheckedTracker: "bg-[var(--switch-tracker-unchecked-bg,#d1d5db)]",
  checkedThumb: "translate-x-4.5",
  uncheckedThumb: "translate-x-0.5",
};
