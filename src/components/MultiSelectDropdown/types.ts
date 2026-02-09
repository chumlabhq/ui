import type { ReactNode } from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
}

export interface MultiSelectDropdownClasses {
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
  label?: string;
  error?: string;
  shimmer?: string;
  shimmerItem?: string;
  moreCount?: string;
}

export interface MultiSelectDropdownProps {
  options?: MultiSelectOption[];
  value: string[];
  onValueChange: (values: string[], options: MultiSelectOption[]) => void;
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
  classes?: MultiSelectDropdownClasses;
  className?: string;
}

export interface UseMultiSelectDropdownProps {
  options?: MultiSelectOption[];
  value: string[];
  disabled?: boolean;
  onValueChange: (values: string[], options: MultiSelectOption[]) => void;
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
