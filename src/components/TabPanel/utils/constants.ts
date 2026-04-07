import type { TabPanelClasses } from "./types";

export const DEFAULT_TABPANEL_CLASSES: Required<TabPanelClasses> = {
  root: "w-full",
  tabList:
    "flex items-center gap-6 border-b border-gray-200 dark:border-gray-700",
  tab: "relative px-1 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer bg-transparent border-none",
  tabActive: "text-blue-600 dark:text-blue-400",
  tabInactive:
    "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
  tabDisabled:
    "opacity-40 cursor-not-allowed hover:text-gray-500 dark:hover:text-gray-400",
  tabFocus:
    "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900",
  label: "",
  labelActive: "",
  labelInactive: "",
  icon: "",
  iconActive: "text-blue-600 dark:text-blue-400",
  iconInactive: "text-gray-400 dark:text-gray-500",
  count: "px-2 py-0.5 text-xs font-semibold rounded-full",
  countActive:
    "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
  countInactive:
    "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
  indicator:
    "absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400",
  panel: "p-4",
};

export const UNSTYLED_TABPANEL_CLASSES: Required<TabPanelClasses> = {
  root: "",
  tabList: "",
  tab: "",
  tabActive: "",
  tabInactive: "",
  tabDisabled: "",
  tabFocus: "",
  label: "",
  labelActive: "",
  labelInactive: "",
  icon: "",
  iconActive: "",
  iconInactive: "",
  count: "",
  countActive: "",
  countInactive: "",
  indicator: "",
  panel: "",
};
