import type { CSSProperties, MutableRefObject, ReactNode } from "react";

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
  /** Selected values. Values not present in options are not shown or submitted; prune when options change. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[], options: MultiSelectOption[]) => void;
  id?: string;
  name?: string;
  /** Placeholder when nothing selected. Simple text or inline content recommended. */
  placeholder?: ReactNode;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  noResultsContent?: ReactNode;
  showChevron?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  onLoadOptions?: () => Promise<MultiSelectOption[]>;
  loadOnOpen?: boolean;
  onLoadError?: (error: unknown) => void;
  shimmerCount?: number;
  maxDisplayedChips?: number;
  showSelectedChips?: boolean;
  checkboxIcon?: ReactNode;
  unstyled?: boolean;
  lockScroll?: boolean;
  classes?: MultiSelectDropdownClasses;
  className?: string;
  style?: CSSProperties;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  keepMounted?: boolean;
  portalContainer?: HTMLElement | null;
  dropdownPosition?: "top" | "bottom";
  dropdownZIndex?: number;
  dropdownGap?: number;
  "aria-label"?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  ChevronIcon?: React.ComponentType<{ className?: string; style?: CSSProperties }>;
  loadingText?: ReactNode;
}

export interface UseMultiSelectDropdownProps {
  options?: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  disabled?: boolean;
  onValueChange?: (values: string[], options: MultiSelectOption[]) => void;
  onLoadOptions?: () => Promise<MultiSelectOption[]>;
  loadOnOpen?: boolean;
  onLoadError?: (error: unknown) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: React.ReactNode;
  "aria-label"?: string;
}

export interface UseMultiSelectDropdownReturn {
  isOpen: boolean;
  currentValue: string[];
  focusedIndex: number;
  isLoadingOptions: boolean;
  displayOptions: MultiSelectOption[];
  selectedOptions: MultiSelectOption[];
  shouldRestoreFocusRef: MutableRefObject<boolean>;
  setFocusedIndex: (index: number) => void;
  handleToggle: () => void;
  handleClose: () => void;
  handleOptionToggle: (option: MultiSelectOption) => void;
  handleRemoveOption: (optionValue: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}
