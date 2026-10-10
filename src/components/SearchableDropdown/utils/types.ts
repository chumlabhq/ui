import type { ReactNode, CSSProperties, FocusEvent } from "react";
import type { DropdownOption } from "../../Dropdown/utils/types.js";

export type SearchableDropdownOption = DropdownOption;

export interface SearchableDropdownClasses {
  /** Root container element */
  root?: string;
  /** The trigger box showing the current selection. */
  control?: string;
  /** Trigger button (combobox) */
  trigger?: string;
  /** The selected option's text inside the trigger, or the placeholder. */
  value?: string;
  /** Dropdown popup container (portal) */
  content?: string;
  /** The scrolling list inside the popup. */
  list?: string;
  /** One option row. */
  item?: string;
  /** The chevron on the trigger. */
  icon?: string;
  /** The check shown on the selected row. */
  itemIndicator?: string;
  /** The button clearing the selection. */
  clearTrigger?: string;
  /** The message shown when the search matches nothing. */
  empty?: string;
  /** Label element */
  label?: string;
  /** The error or hint line under the control. */
  message?: string;
  /** The helper line under the label. */
  description?: string;
  /** The search field's row inside the popup, holding the input and its icon. */
  searchControl?: string;
  /** Search input area wrapper */
  searchInput?: string;
  /** Search icon element */
  searchIcon?: string;
  /** The container holding the skeleton rows while options load. */
  loading?: string;
  /** One of those skeleton rows. */
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
  /** Fires when the trigger loses focus, with the native focus event. */
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  /** Fires when the trigger takes focus, with the native focus event. */
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  renderTrigger?: (
    triggerProps: SearchableDropdownTriggerRenderProps,
    state: SearchableDropdownTriggerState,
  ) => ReactNode;
  ChevronIcon?: React.ComponentType<{ className?: string; style?: CSSProperties }>;
  CheckIcon?: React.ComponentType<{ className?: string; style?: CSSProperties }>;
  ClearIcon?: React.ComponentType<{ className?: string }>;
  SearchIcon?: React.ComponentType<{ className?: string }>;
  loadingText?: ReactNode;
}

/**
 * What the default trigger puts on its own element, and only that: spread it
 * onto yours. The state you draw from arrives separately, as the second
 * argument, so nothing in here becomes a stray DOM attribute.
 */
export interface SearchableDropdownTriggerRenderProps {
  ref: React.RefCallback<HTMLElement>;
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
  /** Fires when the trigger takes focus, with the native focus event. */
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  /** Fires when the trigger loses focus, with the native focus event. */
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  "data-disabled"?: true;
  "data-error"?: true;
  "data-valid"?: true;
  "data-open"?: true;
  "data-placeholder"?: true;
}

/** What a custom trigger draws from: the second argument to `renderTrigger`. */
export interface SearchableDropdownTriggerState {
  /** Whether the dropdown is currently open */
  isOpen: boolean;
  /** The currently selected option, or null */
  selectedOption: SearchableDropdownOption | null;
  /** The placeholder content */
  placeholder: ReactNode;
}

/**
 * Where the options come from — sync or async, never both.
 *
 * `useDropdown` drops `options` entirely once `searchOptions` is a function: the menu
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
      searchOptions?: never;
      initialOptions?: never;
      loadInitialOptions?: never;
      loadInitialOnOpen?: never;
    }
  | {
      options?: never;
      /** Async search callback. Fires with the query. Return filtered options. Not `onFilter`. */
      searchOptions: (query: string) => Promise<SearchableDropdownOption[]>;
      /** Shown before the first query, and merged into the value lookup. */
      initialOptions?: SearchableDropdownOption[];
    } & SearchableInitialLoad<SearchableDropdownOption>;

/**
 * The initial load fires only when both halves are present, so either alone
 * typechecked and fetched nothing.
 */
type SearchableInitialLoad<T> =
  | { loadInitialOptions?: never; loadInitialOnOpen?: never }
  | { loadInitialOptions: () => Promise<T[]>; loadInitialOnOpen: true };

export type SearchableDropdownProps = SearchableDropdownBaseProps &
  SearchableDropdownOptionSource;
