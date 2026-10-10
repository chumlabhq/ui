import type React from "react";
import type { FocusEvent, ReactNode } from "react";

export type SelectionMode = "single" | "multi";

/**
 * One row of a cascading menu. An option with `children` opens the next level rather than selecting.
 */
export interface CascadingOption {
  /** Identifies the option within its level; this is what the value array carries. */
  value: string;
  /** The option's text, and its accessible name. */
  label: string;
  /** Replaces the label in the menu row when it needs more than text. */
  content?: ReactNode;
  /** Replaces the label in the TRIGGER once chosen, for when the row's form is too long to show there. */
  selectedContent?: ReactNode;
  /** Renders the row but refuses selection. */
  disabled?: boolean;
  /** The next level. An option with children opens a submenu instead of selecting. */
  children?: CascadingOption[];
  /** Whether this option's children take one selection or several — set per level, not per component. */
  selectionMode?: SelectionMode;
  /** Declares that children exist before they are loaded, so the row shows its submenu arrow while still fetching. */
  hasChildren?: boolean;
}

export interface CascadingValue {
  [parentValue: string]: string | string[];
}

export interface CascadingDropdownClasses {
  /** Root container div */
  root?: string;
  /** The trigger box showing the current selection. */
  control?: string;
  /** Trigger button */
  trigger?: string;
  /** The trigger\'s value/placeholder text. */
  value?: string;
  /** The first-level menu surface. */
  content?: string;
  /** One row in the first-level menu. */
  item?: string;
  /** A submenu surface. */
  subContent?: string;
  /** The wrapper that anchors a submenu beside its parent row, and flips it when there is no room. */
  subPositioner?: string;
  /** One row inside a submenu. */
  subItem?: string;
  /** Label element */
  label?: string;
  /** The error or hint line under the control. */
  message?: string;
  /** The helper line under the label. */
  description?: string;
  /** The chevron on the trigger. */
  icon?: string;
  /** An icon inside a menu row. */
  itemIcon?: string;
  /** The check shown on a selected row. */
  itemIndicator?: string;
  /** The checkbox drawn on a row when the level allows multiple selection. */
  itemControl?: string;
  /** The message shown when a level has no options. */
  empty?: string;
  /** Loading message */
  loading?: string;
  /** The button clearing the whole selection. */
  clearTrigger?: string;
  /** One placeholder row while a level's options load. */
  loadingItem?: string;
  /** Search input wrapper in the main menu (contains icon + input). */
  searchControl?: string;
  /** The search `<input>` element in the main menu. */
  searchInput?: string;
  /** Search icon in the main menu search input. */
  searchIcon?: string;
  /** Search input wrapper in submenus. Falls back to `searchInput` if not set. */
  subSearchControl?: string;
  /** The search `<input>` element in submenus. Falls back to `searchInputElement` if not set. */
  subSearchInput?: string;
  /** Search icon in submenu search inputs. Falls back to `searchIcon` if not set. */
  subSearchIcon?: string;
}

/**
 * Props for the CascadingDropdown component.
 *
 * @example
 * ```tsx
 * <CascadingDropdown options={tree} value={val} onValueChange={setVal} />
 * ```
 */
interface CascadingDropdownBaseProps {
  /** Tree of cascading options with optional `children` arrays. */
  options: CascadingOption[];
  /** `CascadingValue` object `{ parentValue: childValue }`. Not a flat string. Not `selected`. */
  value?: CascadingValue;
  defaultValue?: CascadingValue;
  /** Fires with `(value, path)` when selection changes. Not `onChange`. */
  onValueChange?: (value: CascadingValue, path: CascadingOption[]) => void;
  /** Loads a parent's children when it is first opened. Returns them; it is a loader, not an event. */
  loadChildren?: (parent: CascadingOption) => Promise<CascadingOption[]>;
  /** Called when async child loading fails. */
  onLoadError?: (error: unknown) => void;
  /** Called when the dropdown open state changes. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Fires when the trigger loses focus, with the native focus event. */
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  /** Fires when the trigger takes focus, with the native focus event. */
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  id?: string;
  name?: string;
  placeholder?: ReactNode;
  disabled?: boolean;
  /** Whether the dropdown is in an error state. Pair with `errorMessage`. */
  error?: boolean;
  /** Message shown below the dropdown when `error` is true. Not `helperText`. */
  errorMessage?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  success?: boolean;
  successMessage?: ReactNode;
  required?: boolean;
  noResultsContent?: ReactNode;
  loadingText?: ReactNode;
  shimmerCount?: number;
  loading?: boolean;
  clearable?: boolean;
  showChevron?: boolean;
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  checkboxIcon?: ReactNode;
  fullWidth?: boolean;
  submenuPosition?: "right" | "left";
  dropdownPosition?: "top" | "bottom";
  closeOnSelect?: boolean;
  classes?: CascadingDropdownClasses;
  unstyled?: boolean;
  lockScroll?: boolean;
  portalContainer?: HTMLElement | null;
  dropdownZIndex?: number;
  dropdownGap?: number;
  /** Keep the dropdown DOM mounted when closed. */
  keepMounted?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ClearIcon?: React.ComponentType<{ className?: string }>;
  renderTrigger?: (
    triggerProps: CascadingDropdownTriggerRenderProps,
    state: CascadingDropdownTriggerState,
  ) => React.ReactNode;
  /** Show a search input inside the main menu. */
  showMenuSearch?: boolean;
  /** Show a search input inside submenus. */
  showSubmenuSearch?: boolean;
  /** Placeholder text for the main menu search input. */
  menuSearchPlaceholder?: string;
  /** Placeholder text for the submenu search input. */
  submenuSearchPlaceholder?: string;
  /** Debounce delay in ms for async search callbacks. Defaults to 300. */
  searchDebounceMs?: number;
  /** Custom search icon component. */
  SearchIcon?: React.ComponentType<{ className?: string }>;
  /** Accessible label for the menu search input. */
  menuSearchAriaLabel?: string;
  /** Accessible label for the submenu search input. */
  submenuSearchAriaLabel?: string;
  "aria-label"?: string;
}

/**
 * The menu's async search, paired with the control that can fire it.
 *
 * `searchMenu` is read only when a query is typed, and the query input is
 * rendered only under `showMenuSearch` — which defaults to false. Supplying the
 * callback alone is therefore a loader with nothing to trigger it: no search
 * input ever mounts, `menuSearchQuery` never leaves `""`, and the callback is
 * dead. That is the same defect the dropdown loader pairs assert, so it is
 * asserted the same way.
 */
export type CascadingMenuSearch =
  | { searchMenu?: never }
  | {
      /** Async search for the main menu. Disables client-side filtering there. */
      searchMenu: (query: string) => Promise<CascadingOption[]>;
      showMenuSearch: true;
    };

/** The submenu's async search and its control. See `CascadingMenuSearch`. */
export type CascadingSubmenuSearch =
  | { searchSubmenu?: never }
  | {
      /** Async search for a submenu. Receives the parent option and the query. */
      searchSubmenu: (
        query: string,
        parent: CascadingOption,
      ) => Promise<CascadingOption[]>;
      showSubmenuSearch: true;
    };

export type CascadingDropdownProps = CascadingDropdownBaseProps &
  CascadingMenuSearch &
  CascadingSubmenuSearch;

/**
 * What the default trigger puts on its own element, and only that: spread it
 * onto yours. The state you draw from arrives separately, as the second
 * argument, so nothing in here becomes a stray DOM attribute.
 */
export interface CascadingDropdownTriggerRenderProps {
  ref: React.RefCallback<HTMLElement>;
  type: "button";
  id: string;
  "aria-expanded": boolean;
  "aria-haspopup": "true";
  /** The menu's id while it is open; absent while closed, when there is no menu. */
  "aria-controls": string | undefined;
  "aria-invalid": boolean | undefined;
  "aria-describedby": string | undefined;
  "aria-label": string | undefined;
  disabled: boolean;
  onClick: () => void;
  /**
   * Attach this to your trigger element. Safari does not focus a `<button>`
   * when it is clicked, which leaves `aria-activedescendant` pointing at an
   * option from an element the assistive technology is not tracking.
   */
  onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  /** Fires when the trigger takes focus, with the native focus event. */
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  /** Fires when the trigger loses focus, with the native focus event. */
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  "data-disabled": true | undefined;
  "data-error": true | undefined;
  "data-valid": true | undefined;
  "data-open": true | undefined;
}

/** What a custom trigger draws from: the second argument to `renderTrigger`. */
export interface CascadingDropdownTriggerState {
  /** Whether the menu is currently open */
  isOpen: boolean;
  /** The selection as the default trigger shows it, or "" with nothing selected */
  displayValue: string;
  /** The placeholder content */
  placeholder: ReactNode;
}

export interface UseCascadingDropdownProps {
  options: CascadingOption[];
  value?: CascadingValue;
  defaultValue?: CascadingValue;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onValueChange?: (value: CascadingValue, path: CascadingOption[]) => void;
  /** Loads a parent's children when it is first opened. Returns them; it is a loader, not an event. */
  loadChildren?: (parent: CascadingOption) => Promise<CascadingOption[]>;
  onLoadError?: (error: unknown) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: ReactNode;
  "aria-label"?: string;
  showMenuSearch?: boolean;
  showSubmenuSearch?: boolean;
  /** Loads the top-level menu's results for a typed query. */
  searchMenu?: (query: string) => Promise<CascadingOption[]>;
  /** Loads a submenu's results for a typed query. */
  searchSubmenu?: (query: string, parent: CascadingOption) => Promise<CascadingOption[]>;
  searchDebounceMs?: number;
}

export interface UseCascadingDropdownReturn {
  isOpen: boolean;
  internalValue: CascadingValue;
  focusedIndex: number;
  activeSubmenu: string | null;
  submenuFocusedIndex: number;
  loadingChildren: Record<string, boolean>;
  loadedChildren: Record<string, CascadingOption[]>;
  setFocusedIndex: (index: number) => void;
  setSubmenuFocusedIndex: (index: number) => void;
  handleToggle: () => void;
  handleClose: () => void;
  handleMenuItemHover: (option: CascadingOption, index: number) => void;
  handleMenuItemClick: (option: CascadingOption) => void;
  handleSubmenuItemClick: (parent: CascadingOption, option: CascadingOption) => void;
  handleSubmenuItemHover: (index: number) => void;
  handleSubmenuMouseEnter: () => void;
  handleSubmenuMouseLeave: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  getDisplayValue: () => string;
  isSubmenuOpen: (value: string) => boolean;
  /** Filtered main menu options (after search). Use this instead of raw options for rendering. */
  filteredOptions: CascadingOption[];
  menuSearchQuery: string;
  onMenuSearchChange: (query: string) => void;
  submenuSearchQuery: string;
  onSubmenuSearchChange: (query: string) => void;
  isMenuSearching: boolean;
  isSubmenuSearching: boolean;
  /** Filtered submenu options for the active submenu parent. */
  getFilteredSubmenuOptions: (parent: CascadingOption) => CascadingOption[];
}
