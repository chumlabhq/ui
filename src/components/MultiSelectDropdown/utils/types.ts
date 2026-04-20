import type { CSSProperties, MutableRefObject, ReactNode } from "react";
import type { DropdownOption } from "../../Dropdown/utils/types";

export type MultiSelectOption = DropdownOption;

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
  description?: string;
  success?: string;
  clearIcon?: string;
  shimmer?: string;
  shimmerItem?: string;
  moreCount?: string;
}

/**
 * Props for the MultiSelectDropdown component.
 *
 * @example
 * ```tsx
 * <MultiSelectDropdown options={opts} value={selectedValues} onValueChange={setValues} />
 * ```
 */
export interface MultiSelectDropdownProps {
  /** Array of `{ value: string, label: string }` objects. Not `items`. */
  options?: MultiSelectOption[];
  /** Array of selected value strings. Values not present in options are not shown or submitted; prune when options change. Not `selected`. */
  value?: string[];
  defaultValue?: string[];
  /** Fires with `(values: string[], options)` when selection changes. Not `onChange`. */
  onValueChange?: (values: string[], options: MultiSelectOption[]) => void;
  id?: string;
  name?: string;
  /** Placeholder when nothing selected. Simple text or inline content recommended. */
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
  noResultsContent?: ReactNode;
  clearable?: boolean;
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
  /** When true, locks the dropdown to the specified dropdownPosition without auto-flipping. */
  forceDropdownPosition?: boolean;
  dropdownZIndex?: number;
  dropdownGap?: number;
  "aria-label"?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  ChevronIcon?: React.ComponentType<{ className?: string; style?: CSSProperties }>;
  loadingText?: ReactNode;
  ClearIcon?: React.ComponentType<{ className?: string }>;
  renderTrigger?: (props: MultiSelectDropdownTriggerRenderProps) => ReactNode;
}

export interface MultiSelectDropdownTriggerRenderProps {
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
