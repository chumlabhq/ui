import type { CSSProperties, MutableRefObject, ReactNode, FocusEvent } from "react";
import type { DropdownOption } from "../../Dropdown/utils/types.js";

export type MultiSelectOption = DropdownOption;

export interface MultiSelectDropdownClasses {
  /** Root container element */
  root?: string;
  /** The trigger box holding the chips. */
  control?: string;
  /** Trigger button */
  trigger?: string;
  /** The chip strip inside the trigger. It wraps rather than clipping, so a chip's remove button keeps its full 24px hit area. */
  value?: string;
  /** Dropdown menu container */
  content?: string;
  /** The scrolling list inside the menu. */
  list?: string;
  /** One option row. */
  item?: string;
  /** The chevron on the trigger. */
  icon?: string;
  /** The checkbox drawn on each row. */
  itemControl?: string;
  /** The check inside that checkbox when the row is selected. */
  itemIndicator?: string;
  /** Selected chip styling */
  chip?: string;
  /** Chip remove button */
  chipRemoveTrigger?: string;
  /** The message shown when there are no options. */
  empty?: string;
  /** Label element */
  label?: string;
  /** The error or hint line under the control. */
  message?: string;
  /** Description/helper text */
  description?: string;
  /** The button clearing every selection at once. */
  clearTrigger?: string;
  /** The container holding the skeleton rows while options load. */
  loading?: string;
  /** One row of the skeleton. It shared `loading` with the container above it. */
  loadingItem?: string;
  /**
   * The square in each skeleton row, standing in for the row's `itemControl`.
   * It and `loadingBar` were call-site literals in MultiSelectDropdownShimmer,
   * which has no `classes` prop — routed through this bag rather than giving
   * the sub-component a second way in.
   */
  loadingItemControl?: string;
  /** The wider of the two shapes in a skeleton row, standing in for the label. */
  loadingBar?: string;
  /** The `+N` chip standing in for selections past `maxVisible`. */
  count?: string;
}

/**
 * Props for the MultiSelectDropdown component.
 *
 * @example
 * ```tsx
 * <MultiSelectDropdown options={opts} value={selectedValues} onValueChange={setValues} />
 * ```
 */
export interface MultiSelectDropdownBaseProps {
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
  emptyContent?: ReactNode;
  clearable?: boolean;
  showChevron?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  onLoadError?: (error: unknown) => void;
  shimmerCount?: number;
  maxVisible?: number;
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
  dropdownSide?: "top" | "bottom";
  /** When true, locks the dropdown to the specified dropdownSide without auto-flipping. */
  forceDropdownSide?: boolean;
  dropdownZIndex?: number;
  dropdownOffset?: number;
  /** Timeout in milliseconds for keyboard typeahead matching. */
  typeaheadTimeout?: number;
  "aria-label"?: string;
  /** Fires when the trigger loses focus, with the native focus event. */
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  /** Fires when the trigger takes focus, with the native focus event. */
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  /** Replaces the trigger's chevron. Rendered inside a box carrying `classes.icon`, which turns it over while the menu is open. */
  chevronIcon?: ReactNode;
  loadingContent?: ReactNode;
  /** Replaces the clear-all button's glyph. Rendered as given. */
  clearIcon?: ReactNode;
  renderTrigger?: (
    triggerProps: MultiSelectDropdownTriggerRenderProps,
    state: MultiSelectDropdownTriggerState,
  ) => ReactNode;
}

/**
 * The dropdown loads only when BOTH are set, so `loadOptions` on its own
 * fetched nothing and `loadOnOpen` on its own had nothing to fetch. Either half
 * alone typechecked and did exactly nothing.
 */
export type MultiSelectDropdownLoadSource =
  | { loadOptions?: never; loadOnOpen?: never }
  | {
      /** Loads the options when the menu first opens. Returns them; it is a loader, not an event. */
      loadOptions: () => Promise<MultiSelectOption[]>;
      loadOnOpen: true;
    };

export type MultiSelectDropdownProps = MultiSelectDropdownBaseProps & MultiSelectDropdownLoadSource;


/**
 * What the default trigger puts on its own element, and only that: spread it
 * onto yours. The state you draw from arrives separately, as the second
 * argument, so nothing in here becomes a stray DOM attribute.
 */
export interface MultiSelectDropdownTriggerRenderProps {
  ref: React.RefCallback<HTMLElement>;
  type: "button";
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
  /** Fires when the trigger takes focus, with the native focus event. */
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  /** Fires when the trigger loses focus, with the native focus event. */
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  "data-disabled": true | undefined;
  "data-error": true | undefined;
  "data-valid": true | undefined;
  "data-open": true | undefined;
}

/** What a custom trigger draws from: the second argument to `renderTrigger`. */
export interface MultiSelectDropdownTriggerState {
  /** Whether the dropdown is currently open */
  isOpen: boolean;
  /** The currently selected options, empty when none is */
  selectedOptions: MultiSelectOption[];
  /** The placeholder content */
  placeholder: ReactNode;
}

export interface UseMultiSelectDropdownProps {
  options?: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  disabled?: boolean;
  onValueChange?: (values: string[], options: MultiSelectOption[]) => void;
  /** Loads the options when the menu first opens. Returns them; it is a loader, not an event. */
  loadOptions?: () => Promise<MultiSelectOption[]>;
  loadOnOpen?: boolean;
  onLoadError?: (error: unknown) => void;
  typeaheadTimeout?: number;
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
