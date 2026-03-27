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
  checkbox?: string;
  checkboxChecked?: string;
  checkboxIcon?: string;
  chip?: string;
  chipRemove?: string;
  noResults?: string;
  loading?: string;
  shimmer?: string;
  shimmerItem?: string;
  label?: string;
  error?: string;
  searchInput?: string;
  searchInputElement?: string;
  searchIcon?: string;
  moreCount?: string;
}

export interface MultiSelectSearchableDropdownProps {
  options?: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[], options: MultiSelectOption[]) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  noResultsContent?: ReactNode;
  loadingText?: string;
  shimmerCount?: number;
  showChevron?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => Promise<MultiSelectOption[]>;
  searchDebounceMs?: number;
  initialOptions?: MultiSelectOption[];
  onLoadInitialOptions?: () => Promise<MultiSelectOption[]>;
  loadInitialOnOpen?: boolean;
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
  dropdownZIndex?: number;
  dropdownGap?: number;
  keepMounted?: boolean;
  "aria-label"?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  searchInputAriaLabel?: string;
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
