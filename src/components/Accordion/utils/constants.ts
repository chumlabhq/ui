import type { AccordionClassNames, AccordionSize, AccordionVariant, AnimationEasing, StorageConfig } from "./types";

export const DEFAULT_CLASS_NAMES: Required<AccordionClassNames> = {
  root: "w-full",
  item: "border-b border-gray-200 last:border-b-0",
  trigger:
    "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  content: "px-4 py-4 text-sm text-gray-600",
  icon: "h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200",
  subtitle: "text-xs text-gray-500 font-normal mt-0.5",
  triggerLeft: "mr-2 shrink-0",
  triggerRight: "ml-2 shrink-0",
  contentInner: "",
};

export const UNSTYLED_CLASS_NAMES: Required<AccordionClassNames> = {
  root: "",
  item: "",
  trigger: "",
  content: "",
  icon: "",
  subtitle: "",
  triggerLeft: "",
  triggerRight: "",
  contentInner: "",
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
  [data-accordion-expand-print="true"] [data-state="closed"] {
    grid-template-rows: 1fr !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
}
`;

export const DEFAULT_STORAGE_CONFIG: Omit<StorageConfig, "key"> = {
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
