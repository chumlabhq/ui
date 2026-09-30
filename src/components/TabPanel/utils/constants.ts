import type { TabPanelClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_TABPANEL_CLASSES: Required<TabPanelClasses> = {
  root: "w-full",
  list:
    "flex items-center gap-6 sm:gap-8 overflow-x-auto border-b border-cl-border",
  // `inline-flex items-center gap-2`, without which `iconPosition` has never
  // worked in either direction. The icon and the label are sibling spans in a
  // button with no layout, so they stacked: measured at the same x, 21px apart
  // vertically. `left` and `right` changed the DOM order and nothing else.
  // The active/inactive/disabled colours, folded onto `item` as `data-state`
  // variants. 6dd1925 deleted `tabActive`, `tabInactive` and `tabDisabled` and
  // applied none of them, so an active tab and an inactive one painted the same
  // colour — the only thing distinguishing them was the indicator bar.
  item:
    "relative shrink-0 inline-flex items-center gap-2 px-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-0 data-[state=active]:text-cl-accent data-[state=inactive]:text-cl-text-secondary data-[state=inactive]:hover:text-cl-text data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed",
  itemText: "",
  itemIcon: "",
  count: "px-2 py-0.5 text-xs font-semibold rounded-full bg-cl-accent-bg text-cl-accent-hover",
  indicator:
    "absolute bottom-0 left-0 right-0 h-0.5 bg-cl-accent",
  content: "p-4",
};

export const UNSTYLED_TABPANEL_CLASSES: Required<TabPanelClasses> =
  structuralOnly(DEFAULT_TABPANEL_CLASSES);
