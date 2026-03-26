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
  container?: string;
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
  chevron?: string;
  submenuChevron?: string;
  checkIcon?: string;
  checkbox?: string;
  checkboxChecked?: string;
  noResults?: string;
  loading?: string;
}

export interface CascadingDropdownProps {
  options: CascadingOption[];
  value?: CascadingValue;
  defaultValue?: CascadingValue;
  onChange?: (value: CascadingValue, path: CascadingOption[]) => void;
  onLoadChildren?: (parent: CascadingOption) => Promise<CascadingOption[]>;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  noResultsText?: string;
  loadingText?: ReactNode;
  loading?: boolean;
  showChevron?: boolean;
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  checkboxIcon?: ReactNode;
  fullWidth?: boolean;
  submenuPosition?: "right" | "left";
  closeOnSelect?: boolean;
  classes?: CascadingDropdownClasses;
  unstyled?: boolean;
  lockScroll?: boolean;
  portalContainer?: HTMLElement | null;
  dropdownZIndex?: number;
  "aria-label"?: string;
}

export interface UseCascadingDropdownProps {
  options: CascadingOption[];
  value?: CascadingValue;
  defaultValue?: CascadingValue;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onChange?: (value: CascadingValue, path: CascadingOption[]) => void;
  onLoadChildren?: (parent: CascadingOption) => Promise<CascadingOption[]>;
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
