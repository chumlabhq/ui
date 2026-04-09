import type { CSSProperties, ReactNode, HTMLAttributes } from "react";

export type TimeFormat = "12h" | "24h";
export type TimePickerVariant = "dropdown" | "clock";
export type ClockSelectionMode = "hours" | "minutes";

export interface TimeValue {
  hours: number;
  minutes: number;
  period?: "AM" | "PM";
}

/** Props accepted by TimePicker icon components. */
export interface TimePickerIconProps {
  className?: string;
}

/** CSS class overrides for TimePicker sub-elements. */
export interface TimePickerClasses {
  /** Outermost container. */
  root?: string;
  /** Label element. */
  label?: string;
  /** Relative-positioned wrapper around trigger + dropdown. */
  wrapper?: string;
  /** Combobox trigger container. */
  trigger?: string;
  /** Text input element. */
  input?: string;
  /** End icon wrapper / chevron. */
  endIcon?: string;
  /** Clear icon button. */
  clearIcon?: string;
  /** Dropdown panel (listbox). */
  dropdown?: string;
  /** Scrollable option list wrapper. */
  optionList?: string;
  /** Individual option. */
  option?: string;
  /** Modifier added to the selected option. */
  optionSelected?: string;
  /** Modifier added to the keyboard-focused option. */
  optionFocused?: string;
  /** Check-mark icon inside a selected option. */
  selectedIcon?: string;
  /** "No matching times" message. */
  noResults?: string;
  /** Error message element. */
  error?: string;
  /** Description element. */
  description?: string;
  /** Success message element. */
  success?: string;

  // ── Clock variant slots ──────────────────────────────────────────────
  /** Clock variant outermost container. */
  clockContainer?: string;
  /** Hours / minutes display row. */
  clockDisplay?: string;
  /** Hours button in the display. */
  clockDisplayHours?: string;
  /** Minutes button in the display. */
  clockDisplayMinutes?: string;
  /** Active (selected) display button modifier. */
  clockDisplayActive?: string;
  /** Colon separator in the display. */
  clockDisplaySeparator?: string;
  /** Circular clock face. */
  clockFace?: string;
  /** SVG hand overlay. */
  clockHand?: string;
  /** SVG line of the hand. */
  clockHandLine?: string;
  /** Dot at the tip of the hand. */
  clockHandDot?: string;
  /** Number label on the clock face. */
  clockNumber?: string;
  /** Selected number modifier. */
  clockNumberSelected?: string;
  /** Inner-ring number modifier (24h). */
  clockNumberInner?: string;
  /** Disabled number modifier (out of min/max range). */
  clockNumberDisabled?: string;
  /** Center dot of the clock. */
  clockCenter?: string;
  /** Actions row (Cancel / OK). */
  clockActions?: string;
  /** Cancel button. */
  clockCancelButton?: string;
  /** OK button. */
  clockOkButton?: string;
  /** AM/PM toggle container. */
  clockPeriodToggle?: string;
  /** Individual AM or PM button. */
  clockPeriodButton?: string;
  /** Active period button modifier. */
  clockPeriodActive?: string;
}

/** Subset of TimePickerClasses relevant to ClockFace. */
export type ClockFaceClasses = Pick<
  TimePickerClasses,
  | "clockContainer"
  | "clockDisplay"
  | "clockDisplayHours"
  | "clockDisplayMinutes"
  | "clockDisplayActive"
  | "clockDisplaySeparator"
  | "clockFace"
  | "clockHand"
  | "clockHandLine"
  | "clockHandDot"
  | "clockNumber"
  | "clockNumberSelected"
  | "clockNumberInner"
  | "clockNumberDisabled"
  | "clockCenter"
  | "clockActions"
  | "clockCancelButton"
  | "clockOkButton"
  | "clockPeriodToggle"
  | "clockPeriodButton"
  | "clockPeriodActive"
>;

/** Props for the standalone ClockFace component. */
export interface ClockFaceProps {
  /** Current time value to display. */
  value: TimeValue | null;
  /** Time display format. */
  format: TimeFormat;
  /** Minute interval for clock snapping. */
  minuteStep: number;
  /** Called when the user selects a time on the clock face. */
  onValueChange: (timeValue: TimeValue) => void;
  /** Called when the user presses OK/confirm. */
  onConfirm: () => void;
  /** Called when the user presses Cancel. */
  onCancel: () => void;
  /** Disables all interaction. */
  disabled?: boolean;
  /** CSS class overrides for clock sub-elements. */
  classes: Required<ClockFaceClasses>;
  /** Inline styles for the clock container. */
  style?: CSSProperties;
  /** Disables transitions and animations. */
  reduceMotion?: boolean;
  /** Minimum selectable time (e.g. "09:00"). */
  minTime?: string;
  /** Maximum selectable time (e.g. "17:00"). */
  maxTime?: string;
  /** Text for the cancel button. Default: "Cancel". */
  cancelText?: string;
  /** Text for the OK button. Default: "OK". */
  okText?: string;
}

// Props from HTMLAttributes that conflict with our explicit definitions
type OmittedHTMLProps = "children" | "color" | "onBlur" | "defaultValue";

export interface TimePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, OmittedHTMLProps> {
  /** Current time value (e.g. "14:30" or "2:30 PM"). */
  value?: string | null;
  /** Default time value for uncontrolled usage. */
  defaultValue?: string | null;
  /** Called when the selected time changes. */
  onValueChange?: (time: string | null, timeValue: TimeValue | null) => void;
  /** Called when the input loses focus (no event argument, suitable for form libraries). */
  onBlur?: () => void;
  /** Time display format. Default: `"24h"`. */
  format?: TimeFormat;
  /**
   * Minute interval for dropdown options and clock snapping.
   * Values below 1, non-integers, or NaN are clamped to a safe range (1-60).
   */
  minuteStep?: number;
  /** Minimum selectable time (e.g. "09:00"). */
  minTime?: string;
  /** Maximum selectable time (e.g. "17:00"). */
  maxTime?: string;
  /**
   * When set, a native hidden input is rendered with this `name` and the current
   * formatted `value` so standard form posts include the time.
   */
  name?: string;
  /** Placeholder text for the input. */
  placeholder?: string;
  /** Disables the component. */
  disabled?: boolean;
  /** Marks the component as having an error. */
  error?: boolean;
  /** Error message displayed below the input. */
  errorMessage?: ReactNode;
  /** Helper text displayed below the label. */
  description?: ReactNode;
  /** Success state. */
  success?: boolean;
  /** Success message text. */
  successMessage?: ReactNode;
  /** Loading state. */
  loading?: boolean;
  /** Label displayed above the input. */
  label?: ReactNode;
  /** Shows a required indicator on the label. */
  required?: boolean;
  /** Show the chevron/end icon in the trigger. Default: `true`. */
  showEndIcon?: boolean;
  /** Custom end icon element replacing the default chevron. */
  endIcon?: ReactNode;
  /** Show a check icon on the selected option. Default: `true`. */
  showSelectedIcon?: boolean;
  /** Custom selected icon element replacing the default checkmark. */
  selectedIcon?: ReactNode;
  /** Custom renderer for dropdown option content. */
  renderOptionContent?: (time: string, isSelected: boolean) => ReactNode;
  /** Expand the picker to fill its parent container. */
  fullWidth?: boolean;
  /** Visual variant: dropdown list or analog clock face. Default: `"dropdown"`. */
  variant?: TimePickerVariant;

  // ── Clearable ──────────────────────────────────────────────────────────
  /** Show a clear button when a value is selected. Default: `false`. */
  clearable?: boolean;
  /** Called when the clear button is clicked. */
  onClear?: () => void;

  // ── Controlled open state ────────────────────────────────────────────
  /** Controlled open state. */
  open?: boolean;
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;

  // ── Dropdown behavior ──────────────────────────────────────────────
  /** Lock body scroll when dropdown is open. Default: `false`. */
  lockScroll?: boolean;
  /** Position of the dropdown relative to the trigger. Default: `"bottom"`. */
  dropdownPosition?: "top" | "bottom";
  /** When true, locks the dropdown to the specified dropdownPosition without auto-flipping. */
  forceDropdownPosition?: boolean;
  /** Z-index for the dropdown. Default: `50`. */
  dropdownZIndex?: number;
  /** Gap between trigger and dropdown in pixels. Default: `4`. */
  dropdownGap?: number;
  /** Keep dropdown DOM mounted when closed (dropdown variant only). Default: `false`. */
  keepMounted?: boolean;
  /** Custom container element for the dropdown portal. Defaults to `document.body`. */
  portalContainer?: HTMLElement | null;

  // ── Styling ──────────────────────────────────────────────────────────
  /** CSS class overrides for all sub-elements. */
  classes?: TimePickerClasses;
  /**
   * Omits built-in layout helpers (e.g. relative wrapper, flex on option text,
   * chevron transition) so layout comes entirely from `classes`.
   */
  unstyled?: boolean;
  /**
   * When true or when `"auto"` matches `prefers-reduced-motion`, disables the
   * chevron rotation transition and reduces motion on the clock face.
   */
  reduceMotion?: boolean | "auto";

  // ── Clock variant ──────────────────────────────────────────────────────
  /** Called when the clock cancel button is pressed. */
  onCancel?: () => void;
  /** Called when the clock confirm button is pressed. */
  onConfirm?: () => void;
  /** Text for the clock cancel button. Default: `"Cancel"`. */
  cancelText?: string;
  /** Text for the clock OK button. Default: `"OK"`. */
  okText?: string;
}

export interface UseTimePickerProps {
  value: string | null;
  format: TimeFormat;
  minuteStep: number;
  minTime?: string;
  maxTime?: string;
  disabled: boolean;
  onValueChange: (time: string | null, timeValue: TimeValue | null) => void;
}

export interface UseTimePickerReturn {
  inputValue: string;
  focusedIndex: number;
  displayOptions: string[];
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  handleToggle: () => void;
  handleClose: () => void;
  handleOpen: () => void;
  handleInputChange: (value: string) => void;
  handleOptionSelect: (time: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  handleBlur: () => void;
}
