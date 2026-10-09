import type { TableClasses } from "./utils/types.js";
import { structuralOnly } from "../../utils/classLayers.js";

export {
  DEFAULT_ROW_OPTIONS,
  DEFAULT_VISIBLE_PAGE_COUNT,
} from "../Pagination/index.js";

/**
 * The 24x24 floor SC 2.5.8 asks for, shared by the row controls that had none:
 * select, expand, group toggle and drag handle. Here rather than at the call
 * sites, which is where the four of them were written first.
 */
export const TABLE_HIT_AREA = "inline-flex items-center justify-center min-w-6 min-h-6";
export const TABLE_DRAG_HANDLE = `${TABLE_HIT_AREA} cursor-grab select-none`;
export const TABLE_SELECT_CONTROL = `${TABLE_HIT_AREA} cursor-pointer`;
export const TABLE_CHECKBOX_SIZE = "w-6 h-6";
/**
 * A custom `CheckboxIcon`: the default's native input, visually hidden in a
 * label beside the icon, and the focus ring drawn on the icon from the input.
 */
export const TABLE_CUSTOM_CHECKBOX = `relative ${TABLE_SELECT_CONTROL}`;
export const TABLE_CUSTOM_CHECKBOX_DISABLED = "cursor-not-allowed opacity-50";
export const TABLE_CUSTOM_CHECKBOX_INPUT = "peer sr-only";
export const TABLE_CUSTOM_CHECKBOX_ICON =
  "inline-flex rounded-sm peer-focus-visible:ring-2 peer-focus-visible:ring-cl-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cl-bg";

export const DEFAULT_TABLE_CLASSES: Required<TableClasses> = {
  root:
    "w-full border rounded-cl-md overflow-hidden bg-cl-bg border-cl-border",
  list: "w-full border-collapse",
  header: "",
  headerRow: "",
  headerCell:
    "px-4 py-3 text-left text-sm font-medium whitespace-nowrap border-b text-cl-text-chrome-quiet bg-cl-bg-elevated border-cl-border",
  headerCellText: "flex items-center",
  body: "",
  item: "border-b transition-colors data-[clickable]:cursor-pointer border-cl-border hover:bg-cl-bg-item-hover",
  cell: "px-4 py-3 text-sm whitespace-nowrap text-cl-text",
  // Right separator uses an inset box-shadow (not border-r-2) so the
  // parent's `overflow: hidden` + `rounded-cl-md` reliably clips it at
  // the rounded corner. A real border on a sticky element can escape
  // that clip because sticky + z-index creates its own stacking
  // context. var(--cl-border-input-focus) is theme-aware (deeper blue
  // in light, softer blue in dark), so one declaration covers both.
  pinnedRegion:
    "shrink-0 sticky left-0 z-30 bg-cl-bg [box-shadow:2px_0_0_0_var(--cl-border-input-focus)] transition-shadow duration-200",
  pinnedList: "border-collapse",
  scrollRegion: "min-w-0 flex-1 overflow-x-auto",
  empty:
    "flex items-center justify-center py-12 text-cl-text-tertiary",
  pinIcon: "text-cl-text-tertiary w-4 h-4",
  pinButton:
    "shrink-0 ml-2 p-1.5 rounded transition-colors hover:bg-cl-bg-hover cursor-pointer",
  loading:
    "w-full border rounded-cl-md overflow-hidden border-cl-border",
  loadingRow: "border-b border-cl-border",
  loadingItem: "px-4 py-2 h-14",
  loadingBar:
    // The same shimmer the other three components use. Not `--fg`: that is the
    // marketing namespace, and `dist/styles.css` ships no rule for it, so a
    // class reaching for it paints nothing in a consumer's application.
    "h-full w-full rounded animate-pulse bg-cl-bg-skeleton",
  control: "",
  sortIcon: "shrink-0 cursor-pointer select-none rounded p-0.5 transition-colors text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-item-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent",
  filterButton:
    "shrink-0 ml-1 cursor-pointer transition-opacity opacity-50 hover:opacity-100 data-[active]:opacity-100",
  filterContent: "",
  filterHeader:
    "px-3 py-2 border-b border-cl-border flex items-center justify-between",
  // Tokenised, not a fixed grey: `text-gray-500` measures 4.02:1 on the panel
  // and `text-gray-700` 1.88:1 in dark, because a palette step cannot follow the
  // surface. `contrast.contract` gates the token pairs in both themes.
  filterLabel: "text-xs font-medium text-cl-text-tertiary",
  filterClearTrigger:
    "text-xs text-cl-accent hover:text-cl-accent-hover cursor-pointer",
  filterItem:
    "w-full flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer transition-colors text-cl-text hover:bg-cl-bg-hover data-[selected]:bg-cl-accent-bg data-[selected]:text-cl-accent-hover data-[selected]:hover:bg-cl-accent-bg",
  filterItemControl:
    "w-4 h-4 rounded border flex items-center justify-center shrink-0 border-cl-border-input data-[selected]:bg-cl-accent data-[selected]:border-cl-accent",
  expandButton: "",
  pinnedRightRegion: "",
  pinnedRightList: "",
  input:
    "border-cl-border-input hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus",
  dragHandle: "",
  footer: "",
  searchControl: "",
  searchIcon:
    "w-4 h-4 absolute top-1/2 -translate-y-1/2 text-cl-text-tertiary pointer-events-none group-data-[side=start]/search:left-3 group-data-[side=end]/search:right-3",
  clearTrigger:
    "absolute top-1/2 -translate-y-1/2 right-2.5 inline-flex items-center justify-center min-w-6 min-h-6 rounded text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-item-hover cursor-pointer group-data-[side=end]/search:right-9",
  searchInput: "",
  mobileCard: "",
  groupLabel: "",
  resizeHandle: "",
  resizeIndicator:
    "w-0.5 h-3/5 rounded-full transition-colors bg-transparent group-hover/resize:bg-cl-text-tertiary data-[resizing]:bg-cl-accent",
  loadingFooter: "text-cl-text-tertiary",
};

export const UNSTYLED_TABLE_CLASSES: Required<TableClasses> =
  structuralOnly(DEFAULT_TABLE_CLASSES);
