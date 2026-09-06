import type React from "react";
import type { ReactNode } from "react";

export type SelectionMode = "single" | "multi";

export interface CascadingOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
  children?: CascadingOption[];
  selectionMode?: SelectionMode;
  hasChildren?: boolean;
}

export interface CascadingValue {
  [parentValue: string]: string | string[];
}

export interface CascadingDropdownClasses {
  root?: string;
  control?: string;
  trigger?: string;
  /** The trigger\'s value/placeholder text. */
  value?: string;
  content?: string;
  item?: string;
  subContent?: string;
  subPositioner?: string;
  subItem?: string;
  label?: string;
  message?: string;
  description?: string;
  icon?: string;
  itemIcon?: string;
  itemIndicator?: string;
  itemControl?: string;
  empty?: string;
  loading?: string;
  clearTrigger?: string;
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
  onLoadChildren?: (parent: CascadingOption) => Promise<CascadingOption[]>;
  /** Called when async child loading fails. */
  onLoadError?: (error: unknown) => void;
  /** Called when the dropdown open state changes. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onBlur?: () => void;
  onFocus?: () => void;
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
  renderTrigger?: (props: CascadingDropdownTriggerRenderProps) => React.ReactNode;
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
 * `onMenuSearch` is read only when a query is typed, and the query input is
 * rendered only under `showMenuSearch` — which defaults to false. Supplying the
 * callback alone is therefore a loader with nothing to trigger it: no search
 * input ever mounts, `menuSearchQuery` never leaves `""`, and the callback is
 * dead. That is the same defect the dropdown loader pairs assert, so it is
 * asserted the same way.
 */
export type CascadingMenuSearch =
  | { onMenuSearch?: never }
  | {
      /** Async search for the main menu. Disables client-side filtering there. */
      onMenuSearch: (query: string) => Promise<CascadingOption[]>;
      showMenuSearch: true;
    };

/** The submenu's async search and its control. See `CascadingMenuSearch`. */
export type CascadingSubmenuSearch =
  | { onSubmenuSearch?: never }
  | {
      /** Async search for a submenu. Receives the parent option and the query. */
      onSubmenuSearch: (
        query: string,
        parent: CascadingOption,
      ) => Promise<CascadingOption[]>;
      showSubmenuSearch: true;
    };

export type CascadingDropdownProps = CascadingDropdownBaseProps &
  CascadingMenuSearch &
  CascadingSubmenuSearch;

export interface CascadingDropdownTriggerRenderProps {
  ref: React.RefCallback<HTMLElement>;
  id: string;
  "aria-expanded": boolean;
  "aria-haspopup": "true";
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
  onFocus?: () => void;
  onBlur?: () => void;
  "data-disabled": true | undefined;
  "data-error": true | undefined;
  "data-open": true | undefined;
  isOpen: boolean;
  displayValue: string;
  placeholder: ReactNode;
}

export interface UseCascadingDropdownProps {
  options: CascadingOption[];
  value?: CascadingValue;
  defaultValue?: CascadingValue;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onValueChange?: (value: CascadingValue, path: CascadingOption[]) => void;
  onLoadChildren?: (parent: CascadingOption) => Promise<CascadingOption[]>;
  onLoadError?: (error: unknown) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: ReactNode;
  "aria-label"?: string;
  showMenuSearch?: boolean;
  showSubmenuSearch?: boolean;
  onMenuSearch?: (query: string) => Promise<CascadingOption[]>;
  onSubmenuSearch?: (query: string, parent: CascadingOption) => Promise<CascadingOption[]>;
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
