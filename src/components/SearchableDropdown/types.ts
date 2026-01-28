import type { ReactNode } from "react";

export interface SearchableDropdownOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
}

export interface SearchableDropdownProps {
  options?: SearchableDropdownOption[];
  value: string | null;
  onChange: (value: string, option: SearchableDropdownOption | null) => void;
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
  isLoading?: boolean;
  onSearch?: (query: string) => Promise<SearchableDropdownOption[]>;
  searchDebounceMs?: number;
  initialOptions?: SearchableDropdownOption[];
  onLoadInitialOptions?: () => Promise<SearchableDropdownOption[]>;
  loadInitialOnOpen?: boolean;
  className?: string;
  triggerClassName?: string;
  triggerFocusClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  optionSelectedClassName?: string;
  optionFocusedClassName?: string;
  optionListClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  searchInputClassName?: string;
  searchInputElementClassName?: string;
  containerClassName?: string;
  chevronClassName?: string;
  selectedIndicatorClassName?: string;
  searchIconClassName?: string;
  noResultsClassName?: string;
  loadingClassName?: string;
}
