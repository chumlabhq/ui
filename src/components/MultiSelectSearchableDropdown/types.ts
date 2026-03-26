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
  container?: string;
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
  label?: string;
  error?: string;
  searchInput?: string;
  searchInputElement?: string;
  searchIcon?: string;
  moreCount?: string;
}

export interface MultiSelectSearchableDropdownProps {
  options?: MultiSelectOption[];
  value: string[];
  onChange: (values: string[], options: MultiSelectOption[]) => void;
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
  noResultsText?: string;
  loadingText?: string;
  showChevron?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => Promise<MultiSelectOption[]>;
  searchDebounceMs?: number;
  initialOptions?: MultiSelectOption[];
  onLoadInitialOptions?: () => Promise<MultiSelectOption[]>;
  loadInitialOnOpen?: boolean;
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
}

export interface UseMultiSelectDropdownProps {
  options?: MultiSelectOption[];
  value: string[];
  disabled?: boolean;
  showSearch?: boolean;
  onSearch?: (query: string) => Promise<MultiSelectOption[]>;
  searchDebounceMs?: number;
  onChange: (values: string[], options: MultiSelectOption[]) => void;
  initialOptions?: MultiSelectOption[];
  onLoadInitialOptions?: () => Promise<MultiSelectOption[]>;
  loadInitialOnOpen?: boolean;
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
  shouldRestoreFocusRef: MutableRefObject<boolean>;
  setSearchQuery: (query: string) => void;
  setFocusedIndex: (index: number) => void;
  handleToggle: () => void;
  handleClose: () => void;
  handleOptionToggle: (option: MultiSelectOption) => void;
  handleRemoveOption: (optionValue: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}
