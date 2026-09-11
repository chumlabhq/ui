import type { IconAnimation, ButtonClasses, ButtonSize } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const BASE_TRANSITION = "transition-transform duration-200";

export const HOVER_ANIMATION_MAP: Record<IconAnimation, string> = {
  none: "",
  slideRight: `${BASE_TRANSITION} group-hover:translate-x-1`,
  slideLeft: `${BASE_TRANSITION} group-hover:-translate-x-1`,
  slideUp: `${BASE_TRANSITION} group-hover:-translate-y-1`,
  slideDown: `${BASE_TRANSITION} group-hover:translate-y-1`,
  bounce: `${BASE_TRANSITION} group-hover:animate-bounce`,
  pulse: `${BASE_TRANSITION} group-hover:animate-pulse`,
  spin: `${BASE_TRANSITION} group-hover:animate-spin`,
};

export const CONTINUOUS_ANIMATION_MAP: Record<IconAnimation, string> = {
  none: "",
  slideRight: `${BASE_TRANSITION} animate-slide-right`,
  slideLeft: `${BASE_TRANSITION} animate-slide-left`,
  slideUp: `${BASE_TRANSITION} animate-slide-up`,
  slideDown: `${BASE_TRANSITION} animate-slide-down`,
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
};

export const DEFAULT_BUTTON_SIZE: ButtonSize = "md";

/**
 * What `size` paints. It used to paint nothing: the prop emitted `data-size`,
 * the schema called that a decision, and sm, md and lg rendered at one height.
 *
 * `md` is the button as it was — `px-4 py-2.5 text-sm gap-2` — so nothing moves
 * for anyone who never passed the prop. The horizontal padding, type and icon
 * steps are Accordion's scale unchanged (12/16/24, 12/14/16, 12/16/20); the
 * vertical padding is Button's own, since an accordion trigger is a row and a
 * button is not. That puts the three at 28, 40 and 52px tall — 52 is what an
 * Accordion md trigger already measures, and 28 leaves 4px over the 24px
 * target floor, which `e2e/target-size.spec.ts` holds for all three.
 *
 * HEIGHT IS PADDING PLUS LINE-HEIGHT, never `h-*` or `min-h-*`. A `min-h-10`
 * here would sit in a different tailwind-merge group from a consumer's `h-12`,
 * so both would survive the merge and the library's would win — which is the
 * `border-none` defect one layer up. Every token below is in the same group as
 * the utility a consumer would reach for, so theirs replaces it.
 */
export const BUTTON_SIZE_CLASSES: Record<ButtonSize, { root: string; itemText: string; icon: string }> = {
  sm: { root: "px-3 py-1.5 text-xs", itemText: "gap-1.5", icon: "h-3 w-3" },
  md: { root: "px-4 py-2.5 text-sm", itemText: "gap-2", icon: "h-4 w-4" },
  lg: { root: "px-6 py-3.5 text-base", itemText: "gap-2.5", icon: "h-5 w-5" },
};

/** The loader follows the icon column. An explicit `loaderSize` still wins. */
export const BUTTON_LOADER_SIZE: Record<ButtonSize, number> = { sm: 12, md: 16, lg: 20 };

export const DEFAULT_BUTTON_CLASSES: Required<ButtonClasses> = {
  root: "cursor-pointer font-medium rounded-cl-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  itemText: "inline-flex items-center justify-center",
  icon: "inline-flex shrink-0",
  loading: "",
};

export const UNSTYLED_BUTTON_CLASSES: Required<ButtonClasses> =
  structuralOnly(DEFAULT_BUTTON_CLASSES);
