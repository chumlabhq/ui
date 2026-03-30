import type React from "react";
import type { ReactNode } from "react";

export type SelectionMode = "single" | "multi";

export interface CascadingOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
  children?: CascadingOption[];
  selectionMode?: SelectionMode;
  hasChildren?: boolean;
}

export interface CascadingValue {
  [parentValue: string]: string | string[];
}

export interface CascadingDropdownClasses {
  root?: string;
  wrapper?: string;
  trigger?: string;
  menu?: string;
  menuItem?: string;
  menuItemSelected?: string;
  menuItemFocused?: string;
  menuItemDisabled?: string;
  submenu?: string;
  submenuContainer?: string;
  submenuItem?: string;
  submenuItemSelected?: string;
  submenuItemFocused?: string;
  label?: string;
  error?: string;
  description?: string;
  success?: string;
  chevron?: string;
  submenuChevron?: string;
  checkIcon?: string;
  checkbox?: string;
  checkboxChecked?: string;
  noResults?: string;
  loading?: string;
  clearIcon?: string;
  shimmer?: string;
  shimmerItem?: string;
  /** Alias for `menu` — matches Dropdown naming convention. */
  content?: string;
  /** Alias for `menuItem` — matches Dropdown naming convention. */
  option?: string;
  /** Alias for `menuItemSelected` — matches Dropdown naming convention. */
  optionSelected?: string;
  /** Alias for `menuItemFocused` — matches Dropdown naming convention. */
  optionFocused?: string;
  /** Alias for `menuItemDisabled` — matches Dropdown naming convention. */
  optionDisabled?: string;
}

export interface CascadingDropdownProps {
  options: CascadingOption[];
  value?: CascadingValue;
  defaultValue?: CascadingValue;
  onValueChange?: (value: CascadingValue, path: CascadingOption[]) => void;
  onLoadChildren?: (parent: CascadingOption) => Promise<CascadingOption[]>;
  /** Called when async child loading fails. */
  onLoadError?: (error: unknown) => void;
  /** Called when the dropdown open state changes. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  id?: string;
  name?: string;
  placeholder?: ReactNode;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  success?: boolean;
  successMessage?: ReactNode;
  required?: boolean;
  noResultsContent?: ReactNode;
  loadingText?: ReactNode;
  shimmerCount?: number;
  loading?: boolean;
  clearable?: boolean;
  showChevron?: boolean;
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  checkboxIcon?: ReactNode;
  fullWidth?: boolean;
  submenuPosition?: "right" | "left";
  dropdownPosition?: "top" | "bottom";
  closeOnSelect?: boolean;
  classes?: CascadingDropdownClasses;
  unstyled?: boolean;
  lockScroll?: boolean;
  portalContainer?: HTMLElement | null;
  dropdownZIndex?: number;
  dropdownGap?: number;
  /** Keep the dropdown DOM mounted when closed. */
  keepMounted?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ClearIcon?: React.ComponentType<{ className?: string }>;
  renderTrigger?: (props: CascadingDropdownTriggerRenderProps) => React.ReactNode;
  "aria-label"?: string;
}

export interface CascadingDropdownTriggerRenderProps {
  ref: React.RefCallback<HTMLElement>;
  id: string;
  "aria-expanded": boolean;
  "aria-haspopup": "true";
  "aria-invalid": boolean | undefined;
  "aria-describedby": string | undefined;
  "aria-required": boolean | undefined;
  "aria-label": string | undefined;
  disabled: boolean;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  "data-disabled": true | undefined;
  "data-error": true | undefined;
  "data-open": true | undefined;
  isOpen: boolean;
  displayValue: string;
  placeholder: ReactNode;
}

export interface UseCascadingDropdownProps {
  options: CascadingOption[];
  value?: CascadingValue;
  defaultValue?: CascadingValue;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onValueChange?: (value: CascadingValue, path: CascadingOption[]) => void;
  onLoadChildren?: (parent: CascadingOption) => Promise<CascadingOption[]>;
  onLoadError?: (error: unknown) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: ReactNode;
  "aria-label"?: string;
}

export interface UseCascadingDropdownReturn {
  isOpen: boolean;
  internalValue: CascadingValue;
  focusedIndex: number;
  activeSubmenu: string | null;
  submenuFocusedIndex: number;
  loadingChildren: Record<string, boolean>;
  loadedChildren: Record<string, CascadingOption[]>;
  setFocusedIndex: (index: number) => void;
  setSubmenuFocusedIndex: (index: number) => void;
  handleToggle: () => void;
  handleClose: () => void;
  handleMenuItemHover: (option: CascadingOption, index: number) => void;
  handleMenuItemClick: (option: CascadingOption) => void;
  handleSubmenuItemClick: (parent: CascadingOption, option: CascadingOption) => void;
  handleSubmenuItemHover: (index: number) => void;
  handleSubmenuMouseEnter: () => void;
  handleSubmenuMouseLeave: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  getDisplayValue: () => string;
  isSubmenuOpen: (value: string) => boolean;
}
