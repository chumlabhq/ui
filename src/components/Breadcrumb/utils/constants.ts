import type { BreadcrumbClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_BREADCRUMB_CLASSES: Required<BreadcrumbClasses> = {
  root: "",
  list: "flex flex-wrap items-center gap-1",
  item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border-none text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-1 focus-visible:ring-offset-cl-bg",
  link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent hover:text-cl-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-1 focus-visible:ring-offset-cl-bg",
  separator: "text-cl-text-tertiary dark:text-cl-text-secondary",
  itemIcon: "shrink-0",
  ellipsis: "",
  ellipsisTrigger: "flex items-center justify-center w-10 h-10 rounded-cl-md transition-colors cursor-pointer bg-cl-bg-hover hover:bg-cl-bg-item-hover text-cl-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-1 focus-visible:ring-offset-cl-bg",
  // `flex flex-col` so the menu items stack vertically even when each item
  // is wrapped in a Tooltip (Tooltip's default `triggerDisplay: "inline-flex"`
  // would otherwise lay them out in a row).
  content: "flex flex-col min-w-40 rounded-cl-md shadow-lg py-1 bg-cl-bg-panel border border-cl-border",
  // first:/last: variants so the hover bg respects the dropdown's
  // rounded corners on the top and bottom items.
  collapsedItem: "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none text-cl-text hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cl-accent first:rounded-t-cl-md last:rounded-b-cl-md",
};

export const UNSTYLED_BREADCRUMB_CLASSES: Required<BreadcrumbClasses> =
  structuralOnly(DEFAULT_BREADCRUMB_CLASSES);
