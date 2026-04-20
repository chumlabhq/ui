import type { ReactNode, CSSProperties, ComponentType } from "react";

export interface DropdownOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
}

export interface DropdownClasses {
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
  checkIcon?: string;
  clearIcon?: string;
  noResults?: string;
  label?: string;
  error?: string;
  description?: string;
  success?: string;
  shimmer?: string;
  shimmerItem?: string;
}

export interface DropdownTriggerRenderProps {
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
  "data-placeholder": true | undefined;
  /** Whether the dropdown is currently open */
  isOpen: boolean;
  /** The currently selected option, or null */
  selectedOption: DropdownOption | null;
  /** The placeholder content */
  placeholder: ReactNode;
}

/**
 * Props for the Dropdown component.
 *
 * @example
 * ```tsx
 * <Dropdown options={[{ value: "a", label: "A" }]} value={val} onValueChange={setVal} />
 * ```
 */
export interface DropdownProps {
  /** Array of `{ value: string, label: string }` objects. Not `items`. */
  options?: DropdownOption[];
  /** Selected option value string, or null. Not `selected`. */
  value?: string | null;
  defaultValue?: string;
  /** Fires with `(value, option)` when selection changes. Not `onChange` or `onSelect`. */
  onValueChange?: (value: string | null, option: DropdownOption | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  clearable?: boolean;
  noResultsContent?: ReactNode;
  showChevron?: boolean;
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  onLoadOptions?: () => Promise<DropdownOption[]>;
  loadOnOpen?: boolean;
  onLoadError?: (error: unknown) => void;
  shimmerCount?: number;
  unstyled?: boolean;
  classes?: DropdownClasses;
  className?: string;
  style?: CSSProperties;
  keepMounted?: boolean;
  portalContainer?: HTMLElement | null;
  /** When true, locks body scroll while the dropdown is open. Default: false. */
  lockScroll?: boolean;
  dropdownPosition?: "top" | "bottom";
  forceDropdownPosition?: boolean;
  dropdownZIndex?: number;
  dropdownGap?: number;
  typeaheadTimeout?: number;
  "aria-label"?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  renderTrigger?: (props: DropdownTriggerRenderProps) => ReactNode;
  ChevronIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  CheckIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  ClearIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  loadingText?: ReactNode;
}
