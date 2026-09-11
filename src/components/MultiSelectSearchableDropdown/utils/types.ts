import type { CSSProperties, MutableRefObject, ReactNode } from "react";

/**
 * One selectable option. The same shape `MultiSelectDropdown` uses, minus the search.
 */
export interface MultiSelectOption {
  /** Identifies the option; this is what the value carries, not the label. */
  value: string;
  /** The option's text, and its accessible name. */
  label: string;
  /** Replaces the label in the menu row when it needs more than text. */
  content?: ReactNode;
  /** Replaces the label in the TRIGGER once chosen, for when the row's form is too long to show there. */
  selectedContent?: ReactNode;
  /** Renders the row but refuses selection. */
  disabled?: boolean;
}

export interface MultiSelectSearchableDropdownClasses {
  /** Root container element */
  root?: string;
  /** The trigger box holding the chips. */
  control?: string;
  /** Trigger button */
  trigger?: string;
  /** The chip strip inside the trigger. It wraps rather than clipping, so a chip's remove button keeps its full 24px hit area. */
  value?: string;
  /** Dropdown content (portaled, background, border, shadow) */
  content?: string;
  /** The scrolling list inside the popup. */
  list?: string;
  /** One option row. */
  item?: string;
  /** The chevron on the trigger. */
  icon?: string;
  /** The checkbox drawn on each row. */
  itemControl?: string;
  /** The check inside that checkbox when the row is selected. */
  itemIndicator?: string;
  /** Selected chip */
  chip?: string;
  /** Chip remove button */
  chipRemove?: string;
  /** The message shown when the search matches nothing. */
  empty?: string;
  /** The button clearing every selection at once. */
  clearTrigger?: string;
  /** Loading message */
  loading?: string;
  /** One row of the skeleton. It shared `loading` with the container above it. */
  loadingItem?: string;
  /** Label element */
  label?: string;
  /** The error or hint line under the control. */
  message?: string;
  /** The helper line under the label. */
  description?: string;
  /** The search field's row inside the popup, holding the input and its icon. */
  searchControl?: string;
  /** Search input wrapper */
  searchInput?: string;
  /** Search icon */
  searchIcon?: string;
  /** The `+N` chip standing in for selections past `maxDisplayedChips`. */
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
  /** Timeout in milliseconds for keyboard typeahead matching. */
  typeaheadTimeout?: number;
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
  "aria-labelledby"?: string;
  "aria-label"?: string;
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
  typeaheadTimeout?: number;
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
