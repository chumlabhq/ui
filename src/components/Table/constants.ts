import type { TableClasses } from "./utils/types";
import { structuralOnly } from "../../utils/classLayers";

export {
  DEFAULT_ROW_OPTIONS,
  DEFAULT_VISIBLE_PAGE_COUNT,
} from "../Pagination";

export const DEFAULT_TABLE_CLASSES: Required<TableClasses> = {
  root:
    "w-full border rounded-cl-md overflow-hidden bg-white dark:bg-cl-bg border-cl-border dark:border-white/[0.06]",
  list: "w-full border-collapse",
  header: "",
  headerCell:
    "px-4 py-3 text-left text-sm font-medium whitespace-nowrap border-b text-cl-text-secondary dark:text-cl-text-tertiary bg-cl-bg-elevated dark:bg-[#111118] border-cl-border dark:border-white/[0.06]",
  headerCellText: "",
  body: "",
  item: "border-b transition-colors data-[clickable]:cursor-pointer border-cl-border dark:border-white/[0.04] hover:bg-cl-bg-hover dark:hover:bg-white/[0.06]",
  cell: "px-4 py-3 text-sm whitespace-nowrap text-cl-text dark:text-cl-text",
  // Right separator uses an inset box-shadow (not border-r-2) so the
  // parent's `overflow: hidden` + `rounded-cl-md` reliably clips it at
  // the rounded corner. A real border on a sticky element can escape
  // that clip because sticky + z-index creates its own stacking
  // context. var(--cl-border-input-focus) is theme-aware (deeper blue
  // in light, softer blue in dark), so one declaration covers both.
  pinnedRegion:
    "shrink-0 sticky left-0 z-30 bg-white dark:bg-cl-bg [box-shadow:2px_0_0_0_var(--cl-border-input-focus)] transition-shadow duration-200",
  pinnedList: "border-collapse",
  scrollRegion: "min-w-0 flex-1 overflow-x-auto",
  empty:
    "flex items-center justify-center py-12 text-cl-text-tertiary dark:text-cl-text-tertiary",
  pinIcon: "text-cl-text-tertiary",
  pinButton:
    "shrink-0 ml-2 p-1.5 rounded transition-colors hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
  loading:
    "w-full border rounded-cl-md overflow-hidden border-cl-border dark:border-white/[0.06]",
  loadingRow: "border-b border-cl-border dark:border-white/[0.04]",
  loadingItem: "px-4 py-2 h-14",
  loadingBar:
    "h-full w-full bg-linear-to-r rounded animate-pulse from-fg/[0.06] dark:from-fg/[0.10] via-fg/[0.06] dark:via-fg/[0.10] to-fg/[0.06] dark:to-fg/[0.10]",
  control: "",
  sortIcon: "",
  filterButton: "",
  filterContent: "",
  expandButton: "",
  pinnedRightRegion: "",
  pinnedRightList: "",
  input: "",
  dragHandle: "",
  footer: "",
  searchInput: "",
  mobileCard: "",
  groupLabel: "",
  resizeHandle: "",
  loadingFooter: "",
};

export const UNSTYLED_TABLE_CLASSES: Required<TableClasses> =
  structuralOnly(DEFAULT_TABLE_CLASSES);
