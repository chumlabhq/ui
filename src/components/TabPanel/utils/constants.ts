import type { TabPanelClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_TABPANEL_CLASSES: Required<TabPanelClasses> = {
  root: "w-full",
  list:
    "flex items-center gap-6 sm:gap-8 overflow-x-auto border-b border-cl-border dark:border-cl-border",
  item: "relative shrink-0 px-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none",
  itemText: "",
  itemIcon: "",
  count: "px-2 py-0.5 text-xs font-semibold rounded-full",
  indicator:
    "absolute bottom-0 left-0 right-0 h-0.5 bg-cl-accent dark:bg-cl-accent/30",
  content: "p-4",
};

export const UNSTYLED_TABPANEL_CLASSES: Required<TabPanelClasses> =
  structuralOnly(DEFAULT_TABPANEL_CLASSES);
