import type { CascadingDropdownClasses } from "./types";

export const DEFAULT_CASCADINGDROPDOWN_CLASSES: Required<CascadingDropdownClasses> = {
  root: "",
  wrapper: "relative",
  trigger:
    "flex items-center justify-between gap-2 w-full px-3 py-2 text-left border rounded-cl-md transition-colors border-cl-border-input dark:border-cl-border bg-white dark:bg-cl-bg-elevated text-cl-text dark:text-white hover:border-cl-border-input dark:hover:border-cl-border focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
  // No overflow-y-auto on the menu itself — submenus pop out to the side
  // as `position: absolute` children of menu items, and `overflow: auto`
  // on the menu container would clip those submenu panels. Long menus
  // grow naturally; the SUBMENU (which has no further children) is the
  // one that gets bounded with max-h + scroll below.
  menu: "min-w-full sm:min-w-[200px] rounded-cl-md shadow-lg bg-white dark:bg-cl-bg-elevated border border-cl-border dark:border-cl-border",
  // first:rounded-t / last:rounded-b so the hover/selected/focused bg
  // tucks under the menu's rounded corners on the top and bottom items
  // — without these, hover paints into the corner gap and looks like a
  // square highlight escaping the rounded card.
  menuItem:
    "flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md",
  menuItemSelected: "bg-cl-accent/15 dark:bg-cl-accent/50 font-medium",
  menuItemFocused: "bg-cl-bg-hover dark:bg-cl-bg-elevated",
  menuItemDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
  submenu:
    "min-w-full sm:min-w-[180px] max-h-[320px] overflow-y-auto rounded-cl-md shadow-lg bg-white dark:bg-cl-bg-elevated border border-cl-border dark:border-cl-border",
  submenuContainer: "z-[9999]",
  submenuItem:
    "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated first:rounded-t-cl-md last:rounded-b-cl-md",
  submenuItemSelected: "bg-cl-accent/15 dark:bg-cl-accent/50 font-medium",
  submenuItemFocused: "bg-cl-bg-hover dark:bg-cl-bg-elevated",
  label:
    "block text-sm font-medium mb-1 text-cl-text dark:text-cl-text-secondary",
  error: "text-sm mt-1 text-red-500 dark:text-red-400",
  description: "text-xs mb-1 text-cl-text-tertiary dark:text-cl-text-tertiary",
  success: "text-sm mt-1 text-green-600 dark:text-green-400",
  chevron:
    "w-4 h-4 shrink-0 transition-transform duration-200 text-cl-text-tertiary dark:text-cl-text-tertiary",
  submenuChevron: "w-4 h-4 shrink-0 text-cl-text-tertiary dark:text-cl-text-tertiary",
  checkIcon: "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
  checkbox:
    "w-4 h-4 shrink-0 flex items-center justify-center rounded border border-cl-border-input dark:border-cl-border",
  checkboxChecked:
    "bg-cl-accent dark:bg-cl-accent border-cl-border-input-focus dark:border-cl-border-input-focus text-white",
  noResults:
    "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
  clearIcon:
    "absolute right-8 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated cursor-pointer text-cl-text-tertiary dark:text-cl-text-tertiary",
  loading:
    "px-3 py-4 text-sm text-center text-cl-text-tertiary dark:text-cl-text-tertiary",
  shimmer: "",
  shimmerItem:
    "mx-2 my-1.5 h-4 rounded bg-cl-bg-hover dark:bg-cl-bg-elevated animate-pulse",
  searchInput:
    "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border-cl-border",
  searchInputElement:
    "flex-1 bg-transparent text-sm text-cl-text dark:text-white placeholder:text-cl-text-tertiary dark:placeholder:text-cl-text-tertiary focus:outline-none",
  searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary dark:text-cl-text-tertiary",
  submenuSearchInput: "",
  submenuSearchInputElement: "",
  submenuSearchIcon: "",
  content:
    "rounded-cl-md shadow-lg bg-white dark:bg-cl-bg-elevated border border-cl-border dark:border-cl-border",
  option:
    "flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-cl-text dark:text-cl-text hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  optionSelected: "bg-cl-accent/15 dark:bg-cl-accent/50 font-medium",
  optionFocused: "bg-cl-bg-hover dark:bg-cl-bg-elevated",
  optionDisabled: "opacity-50 cursor-not-allowed pointer-events-none",
};

export const UNSTYLED_CASCADINGDROPDOWN_CLASSES: Required<CascadingDropdownClasses> = {
  root: "",
  wrapper: "",
  trigger: "",
  menu: "",
  menuItem: "",
  menuItemSelected: "",
  menuItemFocused: "",
  menuItemDisabled: "",
  submenu: "",
  submenuContainer: "",
  submenuItem: "",
  submenuItemSelected: "",
  submenuItemFocused: "",
  label: "",
  error: "",
  description: "",
  success: "",
  chevron: "",
  submenuChevron: "",
  checkIcon: "",
  checkbox: "",
  checkboxChecked: "",
  noResults: "",
  clearIcon: "",
  loading: "",
  shimmer: "",
  shimmerItem: "",
  searchInput: "",
  searchInputElement: "",
  searchIcon: "",
  submenuSearchInput: "",
  submenuSearchInputElement: "",
  submenuSearchIcon: "",
  content: "",
  option: "",
  optionSelected: "",
  optionFocused: "",
  optionDisabled: "",
};
