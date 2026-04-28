import type { BreadcrumbClasses } from "./types";

export const DEFAULT_BREADCRUMB_CLASSES: Required<BreadcrumbClasses> = {
  root: "",
  list: "flex flex-wrap items-center gap-1",
  item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border-none text-cl-text-tertiary dark:text-cl-text-tertiary hover:text-cl-text dark:hover:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-1 dark:focus-visible:ring-offset-cl-bg",
  itemActive: "flex items-center gap-1 px-2 py-1 text-sm font-medium bg-transparent border-none cursor-default text-cl-text dark:text-white",
  itemDisabled: "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-cl-text-tertiary dark:hover:text-cl-text-tertiary",
  link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent dark:text-cl-accent hover:text-cl-accent dark:hover:text-cl-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-1 dark:focus-visible:ring-offset-cl-bg",
  separator: "text-cl-text-tertiary dark:text-cl-text-secondary",
  icon: "shrink-0",
  ellipsis: "",
  ellipsisButton: "flex items-center justify-center w-10 h-10 rounded-cl-md transition-colors cursor-pointer bg-cl-bg-hover dark:bg-cl-bg-elevated hover:bg-cl-bg-hover dark:hover:bg-cl-text/10 text-cl-text-secondary dark:text-cl-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-1 dark:focus-visible:ring-offset-cl-bg",
  // `flex flex-col` so the menu items stack vertically even when each item
  // is wrapped in a Tooltip (Tooltip's default `triggerDisplay: "inline-flex"`
  // would otherwise lay them out in a row).
  dropdown: "flex flex-col min-w-40 rounded-cl-md shadow-lg py-1 bg-white dark:bg-cl-bg-elevated border border-cl-border dark:border-cl-border",
  // first:/last: variants so the hover bg respects the dropdown's
  // rounded corners on the top and bottom items.
  dropdownItem: "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cl-accent first:rounded-t-cl-md last:rounded-b-cl-md",
  dropdownItemDisabled: "opacity-50 cursor-not-allowed",
};

export const UNSTYLED_BREADCRUMB_CLASSES: Required<BreadcrumbClasses> = {
  root: "",
  list: "",
  item: "",
  itemActive: "",
  itemDisabled: "",
  link: "",
  separator: "",
  icon: "",
  ellipsis: "",
  ellipsisButton: "",
  dropdown: "",
  dropdownItem: "",
  dropdownItemDisabled: "",
};
