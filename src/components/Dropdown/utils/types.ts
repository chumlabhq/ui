import type { ReactNode, CSSProperties, ComponentType } from "react";

/**
 * One selectable option.
 */
export interface DropdownOption {
  /** Identifies the option; this is what the value carries, not the label. */
  value: string;
  /** The option's text, and its accessible name. */
  label: string;
  /** Replaces the label in the menu row when it needs more than text. */
  content?: ReactNode;
  /** Replaces the label in the TRIGGER once chosen, for when the row's form is too long to show there. */
  selectedContent?: ReactNode;
  /** Renders the row but refuses selection. */
  disabled?: boolean;
}

export interface DropdownClasses {
  /** Root container element */
  root?: string;
  /** The trigger box showing the current selection. */
  control?: string;
  /** Trigger button (combobox) */
  trigger?: string;
  /** The selected option's text inside the trigger, or the placeholder. */
  value?: string;
  /** Dropdown popup container (portal) */
  content?: string;
  /** The scrolling list inside the popup. */
  list?: string;
  /** One option row. */
  item?: string;
  /** The chevron on the trigger. */
  icon?: string;
  /** The check shown on the selected row. */
  itemIndicator?: string;
  /** The button clearing the selection. */
  clearTrigger?: string;
  /** The message shown when there are no options. */
  empty?: string;
  /** Label element */
  label?: string;
  /** The error or hint line under the control. */
  message?: string;
  /** The helper line under the label. */
  description?: string;
  /** The container holding the skeleton rows while options load. */
  loading?: string;
  /** One of those skeleton rows. */
  loadingItem?: string;
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
  "aria-labelledby"?: string;
  "aria-label"?: string;
  disabled: boolean;
  onClick: () => void;
  /**
   * Attach this to your trigger element. Safari does not focus a `<button>`
   * when it is clicked, which leaves `aria-activedescendant` pointing at an
   * option from an element the assistive technology is not tracking.
   */
  onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
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
export interface DropdownBaseProps {
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

/**
 * `loadOptions` returns early unless BOTH are set, so `onLoadOptions` on its own
 * fetched nothing and `loadOnOpen` on its own had nothing to fetch. Either half
 * alone typechecked and did exactly nothing.
 */
export type DropdownLoadSource =
  | { onLoadOptions?: never; loadOnOpen?: never }
  | {
      onLoadOptions: () => Promise<DropdownOption[]>;
      loadOnOpen: true;
    };

export type DropdownProps = DropdownBaseProps & DropdownLoadSource;

