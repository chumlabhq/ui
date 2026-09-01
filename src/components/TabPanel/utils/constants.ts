import type { TabPanelClasses } from "./types";
import { structuralOnly } from "../../../utils/classLayers";

export const DEFAULT_TABPANEL_CLASSES: Required<TabPanelClasses> = {
  root: "w-full",
  tabList:
    "flex items-center gap-6 sm:gap-8 overflow-x-auto border-b border-cl-border dark:border-cl-border",
  tab: "relative shrink-0 px-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none",
  tabActive: "text-cl-accent dark:text-cl-accent",
  // --cl-text-tertiary is 45% over the page ground, ~3.4:1 — under the 4.5:1
  // WCAG AA needs for body text, and axe flags it. --cl-text-secondary is 65%,
  // ~6:1. Both halves move together so the pair stays consistent.
  tabInactive:
    "text-cl-text-secondary dark:text-cl-text-secondary hover:text-cl-text dark:hover:text-cl-text",
  tabDisabled:
    "opacity-40 cursor-not-allowed hover:text-cl-text-secondary dark:hover:text-cl-text-secondary",
  tabFocus:
    "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg",
  label: "",
  labelActive: "",
  labelInactive: "",
  icon: "",
  iconActive: "text-cl-accent dark:text-cl-accent",
  iconInactive: "text-cl-text-tertiary dark:text-cl-text-tertiary",
  count: "px-2 py-0.5 text-xs font-semibold rounded-full",
  countActive:
    "bg-cl-accent/15 dark:bg-cl-accent/20 text-cl-accent dark:text-cl-accent",
  countInactive:
    "bg-cl-bg-hover dark:bg-cl-bg-elevated text-cl-text-tertiary dark:text-cl-text-tertiary",
  indicator:
    "absolute bottom-0 left-0 right-0 h-0.5 bg-cl-accent dark:bg-cl-accent/30",
  panel: "p-4",
};

export const UNSTYLED_TABPANEL_CLASSES: Required<TabPanelClasses> =
  structuralOnly(DEFAULT_TABPANEL_CLASSES);
