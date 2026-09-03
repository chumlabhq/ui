import type { CSSProperties, MutableRefObject, ReactNode } from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
}

export interface MultiSelectSearchableDropdownClasses {
  root?: string;
  control?: string;
  trigger?: string;
  value?: string;
  content?: string;
  list?: string;
  item?: string;
  icon?: string;
  itemControl?: string;
  itemIndicator?: string;
  chip?: string;
  chipRemove?: string;
  empty?: string;
  clearTrigger?: string;
  loading?: string;
  /** One row of the skeleton. It shared `loading` with the container above it. */
  loadingItem?: string;
  label?: string;
  message?: string;
  description?: string;
  searchControl?: string;
  searchInput?: string;
  searchIcon?: string;
  count?: string;
}

/**
 * Props for the MultiSelectSearchableDropdown component.
 *
 * @example
 * ```tsx
 * <MultiSelectSearchableDropdown options={opts} value={selectedValues} onValueChange={setValues} />
 * ```
 */
export interface MultiSelectSearchableDropdownBaseProps {
  /** Array of selected value strings. Not `selected`. */
  value?: string[];
  defaultValue?: string[];
  /** Fires with `(values: string[], options)` when selection changes. Not `onChange`. */
  onValueChange?: (values: string[], options: MultiSelectOption[]) => void;
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
  showSearch?: boolean;
  searchPlaceholder?: string;
  noResultsContent?: ReactNode;
  loadingText?: ReactNode;
  shimmerCount?: number;
  clearable?: boolean;
  showChevron?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  searchDebounceMs?: number;
  /** Called when async loading or search fails. */
  onLoadError?: (error: unknown) => void;
  maxDisplayedChips?: number;
  showSelectedChips?: boolean;
  checkboxIcon?: ReactNode;
  unstyled?: boolean;
  lockScroll?: boolean;
  classes?: MultiSelectSearchableDropdownClasses;
  className?: string;
  style?: CSSProperties;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  portalContainer?: HTMLElement | null;
  dropdownPosition?: "top" | "bottom";
  /** When true, locks the dropdown to the specified dropdownPosition without auto-flipping. */
  forceDropdownPosition?: boolean;
  dropdownZIndex?: number;
  dropdownGap?: number;
  keepMounted?: boolean;
  "aria-label"?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  ClearIcon?: React.ComponentType<{ className?: string }>;
  renderTrigger?: (props: MultiSelectSearchableDropdownTriggerRenderProps) => ReactNode;
  searchInputAriaLabel?: string;
}

/**
 * `useMultiSelectDropdown` computes `displayOptions` from `asyncOptions` and
 * `allInitialOptions` once `onSearch` is a function -- `options` never reaches
 * the menu on that branch. `allOptions`, which resolves the chips, does still
 * read it, so passing both rendered an empty menu under correctly-labelled
 * chips. The union makes that combination fail to typecheck; a runtime fallback
 * would instead have to guess which of the two sources the consumer meant.
 *
 * The initial-load family is on the async branch for the same reason: it feeds
 * `allInitialOptions`, which the sync branch never reads.
 */
export type MultiSelectSearchableDropdownOptionSource =
  | {
      /** Array of `{ value: string, label: string }` objects. Not `items`. */
      options?: MultiSelectOption[];
      onSearch?: never;
      initialOptions?: never;
      onLoadInitialOptions?: never;
      loadInitialOnOpen?: never;
    }
  | {
      options?: never;
      /** Async search callback. Fires with the search query string. Return filtered options. Not `onFilter`. */
      onSearch: (query: string) => Promise<MultiSelectOption[]>;
      /** Shown before the first query, and merged into the chip lookup. */
      initialOptions?: MultiSelectOption[];
    } & SearchableInitialLoad<MultiSelectOption>;

/**
 * The initial load fires only when both halves are present, so either alone
 * typechecked and fetched nothing.
 */
type SearchableInitialLoad<T> =
  | { onLoadInitialOptions?: never; loadInitialOnOpen?: never }
  | { onLoadInitialOptions: () => Promise<T[]>; loadInitialOnOpen: true };

export type MultiSelectSearchableDropdownProps =
  MultiSelectSearchableDropdownBaseProps & MultiSelectSearchableDropdownOptionSource;

export interface MultiSelectSearchableDropdownTriggerRenderProps {
  ref: React.RefCallback<HTMLElement>;
  id: string;
  role: "combobox";
  "aria-expanded": boolean;
  "aria-haspopup": "listbox";
  "aria-controls": string;
  "aria-activedescendant": string | undefined;
  "aria-invalid": boolean | undefined;
  "aria-describedby": string | undefined;
  "aria-required": boolean | undefined;
  "aria-labelledby": string | undefined;
  disabled: boolean;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  "data-disabled": true | undefined;
  "data-error": true | undefined;
  "data-open": true | undefined;
  isOpen: boolean;
  selectedOptions: MultiSelectOption[];
  placeholder: ReactNode;
}

export interface UseMultiSelectDropdownProps {
  options?: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  disabled?: boolean;
  showSearch?: boolean;
  onSearch?: (query: string) => Promise<MultiSelectOption[]>;
  searchDebounceMs?: number;
  onValueChange?: (values: string[], options: MultiSelectOption[]) => void;
  initialOptions?: MultiSelectOption[];
  onLoadInitialOptions?: () => Promise<MultiSelectOption[]>;
  loadInitialOnOpen?: boolean;
  onLoadError?: (error: unknown) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: ReactNode;
  "aria-label"?: string;
}

export interface UseMultiSelectDropdownReturn {
  isOpen: boolean;
  searchQuery: string;
  focusedIndex: number;
  isSearching: boolean;
  isLoadingInitial: boolean;
  displayOptions: MultiSelectOption[];
  selectedOptions: MultiSelectOption[];
  selectedValues: string[];
  shouldRestoreFocusRef: MutableRefObject<boolean>;
  setSearchQuery: (query: string) => void;
  setFocusedIndex: (index: number) => void;
  handleToggle: () => void;
  handleClose: () => void;
  handleOptionToggle: (option: MultiSelectOption) => void;
  handleRemoveOption: (optionValue: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}
