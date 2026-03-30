import type { InputHTMLAttributes, ReactNode, FocusEvent } from "react";

/** Preset or numeric pixel size for the checkbox. */
export type CheckboxSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

/** Visual shape of the checkbox indicator. */
export type CheckboxShape = "square" | "rounded" | "circle";

/** CSS class overrides for checkbox sub-elements. */
export interface CheckboxClasses {
  /** Root container wrapping checkbox and label. */
  root?: string;
  /** Container for the label and description text. */
  labelContainer?: string;
  /** Label text element. */
  label?: string;
  /** Description text below the label. */
  description?: string;
  /** The checkbox indicator box. */
  checkbox?: string;
  /** Applied when the checkbox is checked. */
  checked?: string;
  /** Applied when the checkbox is unchecked. */
  unchecked?: string;
  /** Applied when the checkbox is in the indeterminate state. */
  indeterminate?: string;
  /** The check/indeterminate icon inside the indicator. */
  icon?: string;
  /** Error message element. */
  error?: string;
  /** Success message element. */
  success?: string;
}

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size" | "defaultChecked"> {
  /** Text label rendered beside the checkbox. */
  label?: ReactNode;
  /** Helper text rendered below the label. */
  description?: ReactNode;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Displays the indeterminate (minus) indicator instead of a checkmark. */
  indeterminate?: boolean;
  /** Fires when the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
  /** Unified event name alias for onCheckedChange. */
  onValueChange?: (checked: boolean) => void;
  /** Fires when the checkbox receives focus. */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Fires when the checkbox loses focus. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Displays the checkbox in an error state. */
  error?: boolean;
  /** Error message displayed below the checkbox. */
  errorMessage?: ReactNode;
  /** Displays the checkbox in a success state. */
  success?: boolean;
  /** Success message displayed below the checkbox. */
  successMessage?: ReactNode;
  /** Displays the checkbox in a loading state. */
  loading?: boolean;
  /** Size of the checkbox indicator. Default: `"md"`. */
  size?: CheckboxSize;
  /** Shape of the checkbox indicator. Default: `"rounded"`. */
  shape?: CheckboxShape;
  /** Custom icon for the checked state. */
  checkedIcon?: ReactNode;
  /** Custom icon for the unchecked state. */
  uncheckedIcon?: ReactNode;
  /** Custom icon for the indeterminate state. */
  indeterminateIcon?: ReactNode;
  /** CSS class overrides for checkbox sub-elements. */
  classes?: CheckboxClasses;
  /** Removes all default styling, rendering a plain checkbox. */
  unstyled?: boolean;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
}
