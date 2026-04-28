import type { CSSProperties } from "react";
import type { TooltipShadowPreset, TooltipWordWrap, TooltipClasses } from "./types";

// Alpha values bumped from the original 0.12–0.30 range to 0.18–0.45 so
// the same shadow reads correctly on both light AND dark surfaces. The
// previous values were tuned for white backgrounds and went nearly
// invisible on the dark-mode bg — addresses THEME-SHADOW-001.
export const shadowPresets: Record<TooltipShadowPreset, string> = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.18)",
  md: "0 3px 8px rgba(0, 0, 0, 0.24)",
  lg: "0 6px 16px rgba(0, 0, 0, 0.30)",
  xl: "0 12px 28px rgba(0, 0, 0, 0.36)",
  "2xl": "0 20px 40px rgba(0, 0, 0, 0.45)",
};

export const isPresetShadow = (shadow: string): shadow is TooltipShadowPreset => {
  return shadow in shadowPresets;
};

export const wordWrapStyles: Record<TooltipWordWrap, CSSProperties> = {
  normal: { overflowWrap: "normal", whiteSpace: "normal" },
  "break-word": {
    overflowWrap: "break-word",
    wordBreak: "normal",
    whiteSpace: "normal",
  },
  nowrap: { overflowWrap: "normal", whiteSpace: "nowrap" },
};

/**
 * Tooltip default surface — small, subtle, elevated. Sits on
 * bg-cl-bg-elevated (slightly lighter than the page in dark mode, slightly
 * off-white in light mode) so it reads as a floating layer without
 * competing with the content underneath. Border is the standard hairline
 * `border-cl-border`, text is one size below body. Arrow shares the
 * surface fill AND the same hairline stroke as the card so the pointer
 * reads as a continuous extension of the tooltip in either theme.
 */
export const DEFAULT_TOOLTIP_CLASSES: Required<TooltipClasses> = {
  trigger: "",
  content:
    "rounded-cl-md bg-cl-bg-elevated border border-cl-border px-2.5 py-1.5 text-[12px] leading-[1.4] text-cl-text shadow-cl-md",
  arrow: "",
  baseArrow: "fill-cl-bg-elevated stroke-cl-border [stroke-width:1]",
};

export const UNSTYLED_TOOLTIP_CLASSES: Required<TooltipClasses> = {
  trigger: "",
  content: "",
  arrow: "",
  baseArrow: "",
};

export const INTERACTIVE_TAGS = new Set([
  "button",
  "a",
  "input",
  "textarea",
  "select",
]);

export const INTERACTIVE_QUERY =
  "a[href],button,input,textarea,select,[tabindex]:not([tabindex='-1'])";
