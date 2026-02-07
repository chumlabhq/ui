import type { CSSProperties } from "react";
import type { TooltipShadowPreset, TooltipWordWrap } from "./types";

export const shadowPresets: Record<TooltipShadowPreset, string> = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.12)",
  md: "0 3px 8px rgba(0, 0, 0, 0.16)",
  lg: "0 6px 16px rgba(0, 0, 0, 0.2)",
  xl: "0 12px 28px rgba(0, 0, 0, 0.24)",
  "2xl": "0 20px 40px rgba(0, 0, 0, 0.3)",
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

export const DEFAULT_CONTENT_CLASS =
  "rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100";

export const DEFAULT_BASE_ARROW_CLASS = "fill-white dark:fill-gray-900";

export const INTERACTIVE_TAGS = new Set([
  "button",
  "a",
  "input",
  "textarea",
  "select",
]);

export const INTERACTIVE_QUERY =
  "a[href],button,input,textarea,select,[tabindex]:not([tabindex='-1'])";
