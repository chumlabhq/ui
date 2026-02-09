import type { ReactNode, CSSProperties } from "react";

export interface SearchableDropdownOption {
  value: string;
  label: string;
  content?: ReactNode;
  selectedContent?: ReactNode;
  disabled?: boolean;
}

export interface SearchableDropdownClasses {
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
  searchInput?: string;
  searchInputElement?: string;
  searchIcon?: string;
  shimmer?: string;
  shimmerItem?: string;
}

export interface SearchableDropdownProps {
  options?: SearchableDropdownOption[];
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string | null, option: SearchableDropdownOption | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  name?: string;
  placeholder?: ReactNode;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  label?: ReactNode;
  required?: boolean;
  clearable?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  noResultsContent?: ReactNode;
  showChevron?: boolean;
  showSelectedIcon?: boolean;
  selectedIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => Promise<SearchableDropdownOption[]>;
  searchDebounceMs?: number;
  initialOptions?: SearchableDropdownOption[];
  onLoadInitialOptions?: () => Promise<SearchableDropdownOption[]>;
  loadInitialOnOpen?: boolean;
  onLoadError?: (error: unknown) => void;
  shimmerCount?: number;
  classes?: SearchableDropdownClasses;
  className?: string;
  style?: CSSProperties;
  keepMounted?: boolean;
  portalContainer?: HTMLElement | null;
  dropdownPosition?: "top" | "bottom";
  dropdownZIndex?: number;
  dropdownGap?: number;
  typeaheadTimeout?: number;
  "aria-label"?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  renderTrigger?: (props: SearchableDropdownTriggerRenderProps) => ReactNode;
  ChevronIcon?: React.ComponentType<{ className?: string; style?: CSSProperties }>;
  CheckIcon?: React.ComponentType<{ className?: string; style?: CSSProperties }>;
  ClearIcon?: React.ComponentType<{ className?: string }>;
  SearchIcon?: React.ComponentType<{ className?: string }>;
}

export interface SearchableDropdownTriggerRenderProps {
  ref: React.RefCallback<HTMLButtonElement>;
  isOpen: boolean;
  selectedOption: SearchableDropdownOption | null;
  placeholder: ReactNode;
  type: "button";
  id: string;
  role: "combobox";
  "aria-expanded": boolean;
  "aria-haspopup": "listbox";
  "aria-controls": string;
  "aria-activedescendant"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
  "aria-labelledby"?: string;
  disabled?: boolean;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  "data-disabled"?: true;
  "data-error"?: true;
  "data-open"?: true;
  "data-placeholder"?: true;
}
