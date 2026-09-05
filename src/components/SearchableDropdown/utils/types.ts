import type { ReactNode, CSSProperties } from "react";
import type { DropdownOption } from "../../Dropdown/utils/types.js";

export type SearchableDropdownOption = DropdownOption;

export interface SearchableDropdownClasses {
  root?: string;
  control?: string;
  trigger?: string;
  value?: string;
  content?: string;
  list?: string;
  item?: string;
  icon?: string;
  itemIndicator?: string;
  clearTrigger?: string;
  empty?: string;
  label?: string;
  message?: string;
  description?: string;
  searchControl?: string;
  searchInput?: string;
  searchIcon?: string;
  loading?: string;
  loadingItem?: string;
}

/**
 * Props for the SearchableDropdown component.
 *
 * @example
 * ```tsx
 * <SearchableDropdown options={opts} value={val} onValueChange={setVal} />
 * ```
 */
export interface SearchableDropdownBaseProps {
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
  searchDebounceMs?: number;
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
  "aria-label"?: string;
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

/**
 * Where the options come from — sync or async, never both.
 *
 * `useDropdown` drops `options` entirely once `onSearch` is a function: the menu
 * renders `initialOptions` before a query and the async results after, so
 * passing both showed an empty menu. It looked half-working rather than broken
 * because `selectedOption` DOES consult `options`, so the trigger kept
 * displaying the right label over an empty list.
 *
 * A discriminated union makes the combination fail to typecheck instead. A
 * runtime fallback would have papered over it: the two props mean different
 * things, and silently preferring one is a guess about which the caller meant.
 */
export type SearchableDropdownOptionSource =
  | {
      /** Array of `{ value: string, label: string }` objects. Not `items`. */
      options?: SearchableDropdownOption[];
      onSearch?: never;
      initialOptions?: never;
      onLoadInitialOptions?: never;
      loadInitialOnOpen?: never;
    }
  | {
      options?: never;
      /** Async search callback. Fires with the query. Return filtered options. Not `onFilter`. */
      onSearch: (query: string) => Promise<SearchableDropdownOption[]>;
      /** Shown before the first query, and merged into the value lookup. */
      initialOptions?: SearchableDropdownOption[];
    } & SearchableInitialLoad<SearchableDropdownOption>;

/**
 * The initial load fires only when both halves are present, so either alone
 * typechecked and fetched nothing.
 */
type SearchableInitialLoad<T> =
  | { onLoadInitialOptions?: never; loadInitialOnOpen?: never }
  | { onLoadInitialOptions: () => Promise<T[]>; loadInitialOnOpen: true };

export type SearchableDropdownProps = SearchableDropdownBaseProps &
  SearchableDropdownOptionSource;
