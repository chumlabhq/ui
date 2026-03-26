import type { AccordionClasses, AccordionSize, AccordionVariant, AnimationEasing, StorageConfig } from "./types";

export const DEFAULT_ACCORDION_CLASSES: Required<AccordionClasses> = {
  root: "w-full",
  item: "border-b border-gray-200 last:border-b-0",
  trigger:
    "flex w-full items-center justify-between text-left font-medium transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  triggerInner: "flex-1 text-left",
  content: "text-gray-600",
  contentWrapper: "overflow-hidden transition-[max-height,opacity,visibility]",
  icon: "shrink-0 text-gray-500 transition-transform duration-200",
  iconWrapper: "shrink-0",
  subtitle: "text-gray-500 font-normal mt-0.5",
  triggerLeft: "mr-2 shrink-0",
  triggerRight: "ml-2 shrink-0",
  contentInner: "",
  heading: "",
};

export const UNSTYLED_ACCORDION_CLASSES: Required<AccordionClasses> = {
  root: "",
  item: "",
  trigger: "",
  triggerInner: "",
  content: "",
  contentWrapper: "",
  icon: "",
  iconWrapper: "",
  subtitle: "",
  triggerLeft: "",
  triggerRight: "",
  contentInner: "",
  heading: "",
};


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
    item: "border-b border-gray-200 last:border-b-0",
    trigger: "hover:bg-gray-50",
  },
  bordered: {
    root: "border border-gray-200 rounded-lg overflow-hidden",
    item: "border-b border-gray-200 last:border-b-0",
    trigger: "hover:bg-gray-50",
  },
  separated: {
    root: "space-y-2",
    item: "border border-gray-200 rounded-lg overflow-hidden",
    trigger: "hover:bg-gray-50",
  },
  flush: {
    root: "",
    item: "",
    trigger: "hover:bg-transparent hover:text-blue-600",
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
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
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

