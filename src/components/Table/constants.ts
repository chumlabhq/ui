import type { TableClasses } from "./utils/types";

export {
  DEFAULT_ROW_OPTIONS,
  DEFAULT_VISIBLE_PAGE_COUNT,
} from "../Pagination";

export const DEFAULT_TABLE_CLASSES: Required<TableClasses> = {
  container:
    "w-full border rounded-cl-md overflow-hidden bg-white dark:bg-cl-bg border-cl-border dark:border-white/[0.06]",
  table: "w-full border-collapse",
  header: "",
  headerRow: "",
  headerCell:
    "px-4 py-3 text-left text-sm font-medium whitespace-nowrap border-b text-cl-text-secondary dark:text-cl-text-tertiary bg-cl-bg-elevated dark:bg-[#111118] border-cl-border dark:border-white/[0.06]",
  // Inset box-shadow (not bg) for the hover tint so the opaque base
  // `bg-cl-bg-elevated` survives on hover. A direct `bg-` swap drops the
  // header to 4% opacity and lets rows scroll through visually under
  // sticky headers.
  headerCellHover:
    "[box-shadow:inset_0_0_0_9999px_var(--cl-bg-hover)]",
  headerCellContent: "",
  body: "",
  row: "border-b transition-colors data-[clickable]:cursor-pointer border-cl-border dark:border-white/[0.04] hover:bg-cl-bg-hover dark:hover:bg-white/[0.06]",
  cell: "px-4 py-3 text-sm whitespace-nowrap text-cl-text dark:text-cl-text",
  selectedRow:
    "border-b transition-colors data-[clickable]:cursor-pointer border-cl-border dark:border-white/[0.04] bg-cl-accent/15 dark:bg-cl-accent/10 hover:bg-cl-accent/15 dark:hover:bg-cl-accent/15",
  // Right separator uses an inset box-shadow (not border-r-2) so the
  // parent's `overflow: hidden` + `rounded-cl-md` reliably clips it at
  // the rounded corner. A real border on a sticky element can escape
  // that clip because sticky + z-index creates its own stacking
  // context. var(--cl-border-input-focus) is theme-aware (deeper blue
  // in light, softer blue in dark), so one declaration covers both.
  pinnedContainer:
    "shrink-0 sticky left-0 z-30 bg-white dark:bg-cl-bg [box-shadow:2px_0_0_0_var(--cl-border-input-focus)] transition-shadow duration-200",
  pinnedTable: "border-collapse",
  unpinnedContainer: "min-w-0 flex-1 overflow-x-auto",
  unpinnedTable: "w-full border-collapse",
  empty:
    "flex items-center justify-center py-12 text-cl-text-tertiary dark:text-cl-text-tertiary",
  pinIcon: "text-cl-text-tertiary",
  pinIconHover: "",
  pinnedPinIcon: "text-cl-accent",
  pinnedPinIconHover: "",
  pinButton:
    "ml-2 p-1.5 rounded transition-colors hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  pinnedPinButton:
    "ml-2 p-1.5 rounded transition-colors hover:bg-cl-accent/15",
  shimmer:
    "w-full border rounded-cl-md overflow-hidden border-cl-border dark:border-white/[0.06]",
  shimmerRow: "border-b border-cl-border dark:border-white/[0.04]",
  shimmerCell: "px-4 py-2 h-14",
  shimmerBar:
    "h-full w-full bg-linear-to-r rounded animate-pulse from-fg/[0.06] dark:from-fg/[0.10] via-fg/[0.06] dark:via-fg/[0.10] to-fg/[0.06] dark:to-fg/[0.10]",
  checkbox: "",
  checkboxCell: "",
  sortIcon: "",
  filterInput: "",
  filterIcon: "",
  filterDropdown: "",
  expandIcon: "",
  expandedRow: "",
  pinnedRightContainer: "",
  pinnedRightTable: "",
  editInput: "",
  dragHandle: "",
  footer: "",
  searchBar: "",
  mobileCard: "",
  groupHeader: "",
  resizeHandle: "",
  loadingMore: "",
  searchInput: "",
};

export const UNSTYLED_TABLE_CLASSES: Required<TableClasses> = {
  container: "",
  table: "",
  header: "",
  headerRow: "",
  headerCell: "",
  headerCellHover: "",
  headerCellContent: "",
  body: "",
  row: "",
  cell: "",
  selectedRow: "",
  pinnedContainer: "",
  pinnedTable: "",
  unpinnedContainer: "",
  unpinnedTable: "",
  empty: "",
  pinIcon: "",
  pinIconHover: "",
  pinnedPinIcon: "",
  pinnedPinIconHover: "",
  pinButton: "",
  pinnedPinButton: "",
  shimmer: "",
  shimmerRow: "",
  shimmerCell: "",
  shimmerBar: "",
  checkbox: "",
  checkboxCell: "",
  sortIcon: "",
  filterInput: "",
  filterIcon: "",
  filterDropdown: "",
  expandIcon: "",
  expandedRow: "",
  pinnedRightContainer: "",
  pinnedRightTable: "",
  editInput: "",
  dragHandle: "",
  footer: "",
  searchBar: "",
  mobileCard: "",
  groupHeader: "",
  resizeHandle: "",
  loadingMore: "",
  searchInput: "",
};
