import type { ReactNode, CSSProperties } from "react";
import type { DropdownOption } from "../../Dropdown/utils/types";

export type SearchableDropdownOption = DropdownOption;

export interface SearchableDropdownClasses {
  root?: string;
  wrapper?: string;
  trigger?: string;
  triggerText?: string;
  content?: string;
  optionList?: string;
  option?: string;
  optionSelected?: string;
  optionFocused?: string;
  optionDisabled?: string;
  chevron?: string;
  checkIcon?: string;
  clearIcon?: string;
  noResults?: string;
  label?: string;
  error?: string;
  description?: string;
  success?: string;
  searchInput?: string;
  searchInputElement?: string;
  searchIcon?: string;
  shimmer?: string;
  shimmerItem?: string;
}

/**
 * Props for the SearchableDropdown component.
 *
 * @example
 * ```tsx
 * <SearchableDropdown options={opts} value={val} onValueChange={setVal} />
 * ```
 */
export interface SearchableDropdownProps {
  /** Array of `{ value: string, label: string }` objects. Not `items`. */
  options?: SearchableDropdownOption[];
  /** Selected option value string, or null. Not `selected`. */
  value?: string | null;
  defaultValue?: string;
  /** Fires with `(value, option)` when selection changes. Not `onChange` or `onSelect`. */
  onValueChange?: (value: string | null, option: SearchableDropdownOption | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  clearable?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  /** Custom aria-label for the search input. Defaults to "Search options". */
  searchInputAriaLabel?: string;
  noResultsContent?: ReactNode;
  showChevron?: boolean;
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  /** Async search callback. Fires with the search query string. Return filtered options. Not `onFilter`. */
  onSearch?: (query: string) => Promise<SearchableDropdownOption[]>;
  searchDebounceMs?: number;
  initialOptions?: SearchableDropdownOption[];
  onLoadInitialOptions?: () => Promise<SearchableDropdownOption[]>;
  loadInitialOnOpen?: boolean;
  onLoadError?: (error: unknown) => void;
  shimmerCount?: number;
  classes?: SearchableDropdownClasses;
  className?: string;
  style?: CSSProperties;
  keepMounted?: boolean;
  portalContainer?: HTMLElement | null;
  dropdownPosition?: "top" | "bottom";
  /** When true, locks the dropdown to the specified dropdownPosition without auto-flipping. */
  forceDropdownPosition?: boolean;
  dropdownZIndex?: number;
  dropdownGap?: number;
  typeaheadTimeout?: number;
  unstyled?: boolean;
  lockScroll?: boolean;
  "aria-label"?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  renderTrigger?: (props: SearchableDropdownTriggerRenderProps) => ReactNode;
  ChevronIcon?: React.ComponentType<{ className?: string; style?: CSSProperties }>;
  CheckIcon?: React.ComponentType<{ className?: string; style?: CSSProperties }>;
  ClearIcon?: React.ComponentType<{ className?: string }>;
  SearchIcon?: React.ComponentType<{ className?: string }>;
  loadingText?: ReactNode;
}

export interface SearchableDropdownTriggerRenderProps {
  ref: React.RefCallback<HTMLElement>;
  isOpen: boolean;
  selectedOption: SearchableDropdownOption | null;
  placeholder: ReactNode;
  type: "button";
  id: string;
  role: "combobox";
  "aria-expanded": boolean;
  "aria-haspopup": "listbox";
  "aria-controls": string;
  "aria-activedescendant"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
  "aria-labelledby"?: string;
  disabled?: boolean;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  "data-disabled"?: true;
  "data-error"?: true;
  "data-open"?: true;
  "data-placeholder"?: true;
}
