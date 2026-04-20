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
  wrapper?: string;
  trigger?: string;
  menu?: string;
  menuItem?: string;
  menuItemSelected?: string;
  menuItemFocused?: string;
  menuItemDisabled?: string;
  submenu?: string;
  submenuContainer?: string;
  submenuItem?: string;
  submenuItemSelected?: string;
  submenuItemFocused?: string;
  label?: string;
  error?: string;
  description?: string;
  success?: string;
  chevron?: string;
  submenuChevron?: string;
  checkIcon?: string;
  checkbox?: string;
  checkboxChecked?: string;
  noResults?: string;
  loading?: string;
  clearIcon?: string;
  shimmer?: string;
  shimmerItem?: string;
  /** Search input wrapper in the main menu (contains icon + input). */
  searchInput?: string;
  /** The search `<input>` element in the main menu. */
  searchInputElement?: string;
  /** Search icon in the main menu search input. */
  searchIcon?: string;
  /** Search input wrapper in submenus. Falls back to `searchInput` if not set. */
  submenuSearchInput?: string;
  /** The search `<input>` element in submenus. Falls back to `searchInputElement` if not set. */
  submenuSearchInputElement?: string;
  /** Search icon in submenu search inputs. Falls back to `searchIcon` if not set. */
  submenuSearchIcon?: string;
  /** Alias for `menu` — matches Dropdown naming convention. */
  content?: string;
  /** Alias for `menuItem` — matches Dropdown naming convention. */
  option?: string;
  /** Alias for `menuItemSelected` — matches Dropdown naming convention. */
  optionSelected?: string;
  /** Alias for `menuItemFocused` — matches Dropdown naming convention. */
  optionFocused?: string;
  /** Alias for `menuItemDisabled` — matches Dropdown naming convention. */
  optionDisabled?: string;
}

/**
 * Props for the CascadingDropdown component.
 *
 * @example
 * ```tsx
 * <CascadingDropdown options={tree} value={val} onValueChange={setVal} />
 * ```
 */
export interface CascadingDropdownProps {
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
  /** Async search callback for main menu. Return filtered options. When provided, client-side filtering is disabled for the menu. */
  onMenuSearch?: (query: string) => Promise<CascadingOption[]>;
  /** Async search callback for submenu. Receives parent option + query. Return filtered children. When provided, client-side filtering is disabled for the submenu. */
  onSubmenuSearch?: (query: string, parent: CascadingOption) => Promise<CascadingOption[]>;
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

export interface CascadingDropdownTriggerRenderProps {
  ref: React.RefCallback<HTMLElement>;
  id: string;
  "aria-expanded": boolean;
  "aria-haspopup": "true";
  "aria-invalid": boolean | undefined;
  "aria-describedby": string | undefined;
  "aria-required": boolean | undefined;
  "aria-label": string | undefined;
  disabled: boolean;
  onClick: () => void;
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
