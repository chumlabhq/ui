import type { ReactNode } from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
}

export interface MultiSelectDropdownProps {
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
  noResultsText?: string;
  showChevron?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  onLoadOptions?: () => Promise<MultiSelectOption[]>;
  loadOnOpen?: boolean;
  shimmerCount?: number;
  maxDisplayedChips?: number;
  showSelectedChips?: boolean;
  checkboxIcon?: ReactNode;
  className?: string;
  containerClassName?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  selectedOptionClassName?: string;
  focusedOptionClassName?: string;
  optionListClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  chipClassName?: string;
  chipRemoveClassName?: string;
  chevronClassName?: string;
  checkboxClassName?: string;
  checkboxCheckedClassName?: string;
  checkboxIconClassName?: string;
  noResultsClassName?: string;
  shimmerClassName?: string;
  shimmerItemClassName?: string;
  moreCountClassName?: string;
}

export interface UseMultiSelectDropdownProps {
  options?: MultiSelectOption[];
  value: string[];
  disabled?: boolean;
  onChange: (values: string[], options: MultiSelectOption[]) => void;
  onLoadOptions?: () => Promise<MultiSelectOption[]>;
  loadOnOpen?: boolean;
}

export interface UseMultiSelectDropdownReturn {
  isOpen: boolean;
  focusedIndex: number;
  isLoadingOptions: boolean;
  displayOptions: MultiSelectOption[];
  selectedOptions: MultiSelectOption[];
  setFocusedIndex: (index: number) => void;
  handleToggle: () => void;
  handleClose: () => void;
  handleOptionToggle: (option: MultiSelectOption) => void;
  handleRemoveOption: (optionValue: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}
