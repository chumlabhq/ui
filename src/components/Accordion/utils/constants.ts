import type { AccordionClassNames } from "./types";

export const DEFAULT_CLASS_NAMES: Required<AccordionClassNames> = {
  root: "w-full",
  item: "border-b border-gray-200 last:border-b-0",
  trigger:
    "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  content: "px-4 py-4 text-sm text-gray-600",
  icon: "h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200",
};

export const DEFAULT_ANIMATION_DURATION = 300;
export const DEFAULT_HEADING_LEVEL = 3 as const;
export const DEFAULT_ORIENTATION = "vertical" as const;
export const DEFAULT_DIRECTION = "ltr" as const;
export const DEFAULT_LOOP = true;
