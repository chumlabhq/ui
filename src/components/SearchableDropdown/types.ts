import type { ReactNode } from "react";

export interface SearchableDropdownOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
}

export interface SearchableDropdownClasses {
  root?: string;
  wrapper?: string;
  trigger?: string;
  triggerFocused?: string;
  triggerText?: string;
  content?: string;
  optionList?: string;
  option?: string;
  optionSelected?: string;
  optionFocused?: string;
  optionDisabled?: string;
  chevron?: string;
  checkIcon?: string;
  noResults?: string;
  loading?: string;
  label?: string;
  error?: string;
  searchInput?: string;
  searchInputElement?: string;
  searchIcon?: string;
}

export interface SearchableDropdownProps {
  options?: SearchableDropdownOption[];
  value: string | null;
  onValueChange: (value: string, option: SearchableDropdownOption | null) => void;
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
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => Promise<SearchableDropdownOption[]>;
  searchDebounceMs?: number;
  initialOptions?: SearchableDropdownOption[];
  onLoadInitialOptions?: () => Promise<SearchableDropdownOption[]>;
  loadInitialOnOpen?: boolean;
  classes?: SearchableDropdownClasses;
  className?: string;
}
