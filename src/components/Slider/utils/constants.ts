import type { SliderClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_SLIDER_CLASSES: Required<SliderClasses> = {
  root: "flex flex-col gap-2",
  label: "text-sm font-medium text-cl-text",
  description: "text-xs text-cl-text-tertiary",
  control: "relative select-none touch-none cursor-pointer",
  /**
   * The unfilled track needs to differ from the page, not from nothing.
   *
   * This was `bg-cl-bg-hover`, which in dark resolves to the same value as the
   * surface behind it — measured rgb(10, 13, 18) for both — so the track was
   * invisible and a slider had no visible width or thumb position at all. Every
   * demo that looked right was overriding it. `--cl-bg-track` is a surface step
   * that differs in both themes, which is what a groove has to do.
   */
  track: "rounded-full bg-cl-bg-track data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  range: "rounded-full bg-cl-accent",
  thumb:
    "absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg hover:shadow-lg cursor-grab data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  valueText:
    // `text-cl-text`, not `text-white`: the panel token is white in the light
    // theme, so a white label on it is a 1:1 tooltip.
    "absolute px-2 py-1 text-xs font-medium text-cl-text bg-cl-bg-panel rounded-cl-md shadow-sm whitespace-nowrap pointer-events-none",
  /**
   * The dot. It is clickable — the control jumps to a mark when you hit one —
   * so it says so.
   */
  marker: "rounded-full bg-cl-bg-panel border-2 border-cl-border-input cursor-pointer",
  /**
   * The label under the dot, which used to render with `marker`.
   *
   * One class was doing both jobs, so every mark label inherited
   * `rounded-full`, `bg-cl-bg-panel` and `border-2` and came out as a pill
   * chip around a number. Text under a tick is text; the chip was never a
   * decision, it was the dot's costume worn by the label.
   */
  markLabel: "text-xs text-cl-text-tertiary select-none",
  message: "text-sm data-[invalid]:text-cl-error mt-1 data-[valid]:text-cl-success",
};

export const UNSTYLED_SLIDER_CLASSES: Required<SliderClasses> =
  structuralOnly(DEFAULT_SLIDER_CLASSES);
