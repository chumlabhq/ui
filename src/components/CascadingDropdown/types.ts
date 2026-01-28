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
  loadingText?: string;
  isLoading?: boolean;
  showChevron?: boolean;
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  checkboxIcon?: ReactNode;
  fullWidth?: boolean;
  submenuPosition?: "right" | "left";
  closeOnSelect?: boolean;
  className?: string;
  containerClassName?: string;
  triggerClassName?: string;
  menuClassName?: string;
  menuItemClassName?: string;
  menuItemSelectedClassName?: string;
  menuItemFocusedClassName?: string;
  menuItemDisabledClassName?: string;
  submenuClassName?: string;
  submenuContainerClassName?: string;
  submenuItemClassName?: string;
  submenuItemSelectedClassName?: string;
  submenuItemFocusedClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  chevronClassName?: string;
  submenuChevronClassName?: string;
  checkIconClassName?: string;
  checkboxClassName?: string;
  checkboxCheckedClassName?: string;
  noResultsClassName?: string;
  loadingClassName?: string;
}

export interface UseCascadingDropdownProps {
  options: CascadingOption[];
  value?: CascadingValue;
  defaultValue?: CascadingValue;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onChange?: (value: CascadingValue, path: CascadingOption[]) => void;
  onLoadChildren?: (parent: CascadingOption) => Promise<CascadingOption[]>;
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
