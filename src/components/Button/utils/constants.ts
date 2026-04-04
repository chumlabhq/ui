import type { IconAnimation, ButtonClasses } from "./types";

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

export const DEFAULT_BUTTON_CLASSES: Required<ButtonClasses> = {
  root: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
  content: "inline-flex items-center justify-center gap-2",
  startIcon: "inline-flex shrink-0",
  endIcon: "inline-flex shrink-0",
  loader: "",
};

export const UNSTYLED_BUTTON_CLASSES: Required<ButtonClasses> = {
  root: "",
  content: "",
  startIcon: "",
  endIcon: "",
  loader: "",
};
