import type { IconAnimation } from "./types";

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
