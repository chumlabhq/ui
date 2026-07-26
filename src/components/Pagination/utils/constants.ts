import type { PaginationClasses } from "./types";

export const DEFAULT_ROW_OPTIONS = [5, 10, 25, 50, 100] as const;

export const DEFAULT_VISIBLE_PAGE_COUNT = 3;

export const DEFAULT_PAGINATION_CLASSES: Required<PaginationClasses> = {
  root: "flex flex-wrap items-center gap-2",
  nav: "flex items-center gap-2",
  pageButtons: "flex flex-wrap items-center gap-2",
  pageButton:
    "px-3 py-1 rounded-cl-md border transition-colors cursor-pointer border-cl-border dark:border-cl-border hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated text-cl-text dark:text-cl-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-cl-bg",
  activePageButton:
    "px-3 py-1 rounded-cl-md bg-cl-accent text-cl-on-accent border border-cl-border-input-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-cl-bg",
  navButton:
    "p-2 rounded-cl-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-cl-border dark:border-cl-border hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated text-cl-text-secondary dark:text-cl-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-cl-bg",
  ellipsis: "px-2 select-none text-cl-text-tertiary dark:text-cl-text-tertiary",
  selector: "flex items-center gap-2",
  selectorButton:
    "flex items-center gap-2 px-3 py-1.5 rounded-cl-md border transition-colors cursor-pointer border-cl-border dark:border-cl-border bg-white dark:bg-cl-bg-elevated hover:bg-cl-bg-hover dark:hover:bg-cl-text/10 text-cl-text dark:text-cl-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-cl-bg",
  selectorDropdown:
    "rounded-cl-md shadow-lg py-1 border min-w-[64px] bg-white dark:bg-cl-bg-elevated border-cl-border dark:border-cl-border",
  selectorDropdownWrapper: "",
  selectorOption:
    "px-4 py-1.5 w-full text-left cursor-pointer transition-colors hover:bg-cl-bg-hover dark:hover:bg-cl-text/10 data-[selected]:bg-cl-accent/15 dark:data-[selected]:bg-cl-accent/60 data-[selected]:text-cl-accent dark:data-[selected]:text-cl-accent data-[highlighted]:bg-cl-bg-hover dark:data-[highlighted]:bg-cl-text/10 text-cl-text dark:text-cl-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-cl-bg",
  label: "text-sm text-cl-text-secondary dark:text-cl-text-tertiary",
  dropdownIcon:
    "w-4 h-4 transition-transform text-cl-text-tertiary dark:text-cl-text-tertiary",
  prevIcon: "w-5 h-5 text-cl-text-secondary dark:text-cl-text-tertiary",
  nextIcon: "w-5 h-5 text-cl-text-secondary dark:text-cl-text-tertiary",
  pageInfo: "flex items-center",
};

export const UNSTYLED_PAGINATION_CLASSES: Required<PaginationClasses> = {
  root: "",
  nav: "",
  pageButtons: "",
  pageButton: "",
  activePageButton: "",
  navButton: "",
  ellipsis: "",
  selector: "",
  selectorButton: "",
  selectorDropdown: "",
  selectorDropdownWrapper: "",
  selectorOption: "",
  label: "",
  dropdownIcon: "",
  prevIcon: "",
  nextIcon: "",
  pageInfo: "",
};
