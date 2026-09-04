import type { AccordionClasses, AccordionSize, AccordionVariant, AnimationEasing, StorageConfig , AccordionShimmerClasses} from "./types";
import { isBrowser } from "../../../utils/isBrowser";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_ACCORDION_CLASSES: Required<AccordionClasses> = {
  root: "w-full",
  item: "border-b border-cl-border last:border-b-0",
  trigger:
    "flex w-full items-center justify-between text-left font-medium transition-colors text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-cl-bg disabled:cursor-not-allowed disabled:opacity-50",
  itemText: "flex-1 text-left",
  body: "text-cl-text-secondary",
  content: "overflow-hidden transition-[max-height,opacity,visibility]",
  icon: "shrink-0",
  itemIndicator:
    "text-cl-text-tertiary transition-transform duration-200",
  description: "block text-cl-text-tertiary font-normal mt-0.5",
  itemIcon: "mr-2 shrink-0",
  triggerActions: "ml-2 shrink-0",
  header: "",
};

export const UNSTYLED_ACCORDION_CLASSES: Required<AccordionClasses> =
  structuralOnly(DEFAULT_ACCORDION_CLASSES);


export const DEFAULT_ANIMATION_DURATION = 300;
export const DEFAULT_HEADING_LEVEL = 3 as const;
export const DEFAULT_ORIENTATION = "vertical" as const;
export const DEFAULT_DIRECTION = "ltr" as const;
export const DEFAULT_LOOP = true;
export const DEFAULT_SIZE: AccordionSize = "md";
export const DEFAULT_VARIANT: AccordionVariant = "default";
export const DEFAULT_ANIMATION_EASING: AnimationEasing = "ease-in-out";
export const DEFAULT_ANNOUNCE_EXPANDED = false;

export const SIZE_CLASSES: Record<AccordionSize, { trigger: string; content: string; icon: string; subtitle: string }> = {
  sm: {
    trigger: "px-3 py-2 text-xs",
    content: "px-3 py-2 text-xs",
    icon: "h-3 w-3",
    subtitle: "text-[10px]",
  },
  md: {
    trigger: "px-4 py-4 text-sm",
    content: "px-4 py-4 text-sm",
    icon: "h-4 w-4",
    subtitle: "text-xs",
  },
  lg: {
    trigger: "px-6 py-5 text-base",
    content: "px-6 py-5 text-base",
    icon: "h-5 w-5",
    subtitle: "text-sm",
  },
};

export const VARIANT_CLASSES: Record<AccordionVariant, { root: string; item: string; trigger: string }> = {
  default: {
    root: "",
    item: "border-b border-cl-border last:border-b-0",
    trigger: "hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  },
  bordered: {
    root: "border border-cl-border rounded-cl-md overflow-hidden",
    item: "border-b border-cl-border last:border-b-0",
    trigger: "hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  },
  separated: {
    root: "space-y-2",
    item: "border border-cl-border rounded-cl-md overflow-hidden",
    trigger: "hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  },
  flush: {
    root: "",
    item: "",
    trigger: "hover:bg-transparent hover:text-cl-accent",
  },
};

export const PRINT_STYLES = `
@media print {
  [data-accordion-expand-print="true"] [aria-hidden="true"] {
    max-height: none !important;
    height: auto !important;
    opacity: 1 !important;
    visibility: visible !important;
    overflow: visible !important;
  }
  [data-accordion-expand-print="true"] [data-state="closed"] {
    max-height: none !important;
    height: auto !important;
    opacity: 1 !important;
    visibility: visible !important;
    overflow: visible !important;
  }
}
`;

export function getDefaultStorageConfig(): Omit<StorageConfig, "key"> {
  return {
    storage: isBrowser ? window.localStorage : undefined,
    serialize: (values: string[]) => JSON.stringify(values),
    deserialize: (stored: string) => {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    },
  };
}

/** AccordionShimmer's own anatomy (ADR 002 R1). */
export const DEFAULT_ACCORDION_SHIMMER_CLASSES: Required<AccordionShimmerClasses> = {
  root: "w-full",
  item: "",
  trigger: "flex items-center justify-between",
  itemText: "flex-1 space-y-2",
  titleBar: "h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse",
  descriptionBar: "h-3 rounded bg-gray-100 dark:bg-gray-600 animate-pulse",
  icon: "rounded bg-gray-200 dark:bg-gray-700 shrink-0 ml-4 animate-pulse",
  body: "space-y-2",
};

export const UNSTYLED_ACCORDION_SHIMMER_CLASSES: Required<AccordionShimmerClasses> =
  structuralOnly(DEFAULT_ACCORDION_SHIMMER_CLASSES);
