import type { ReactNode } from "react";

export interface DropdownOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options?: DropdownOption[];
  value: string | null;
  onChange: (value: string, option: DropdownOption | null) => void;
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
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  onLoadOptions?: () => Promise<DropdownOption[]>;
  loadOnOpen?: boolean;
  shimmerCount?: number;
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
  chevronClassName?: string;
  checkIconClassName?: string;
  noResultsClassName?: string;
  shimmerClassName?: string;
  shimmerItemClassName?: string;
}
