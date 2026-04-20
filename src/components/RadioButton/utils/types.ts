import type { HTMLAttributes, ReactNode, FocusEvent } from "react";

/** Preset or numeric pixel size for the radio button. */
export type RadioButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

/** CSS class overrides for radio button sub-elements. */
export interface RadioButtonClasses {
  /** Root label container wrapping radio and text. */
  root?: string;
  /** Label text element. */
  label?: string;
  /** Description text below the label. */
  description?: string;
  /** The radio indicator circle. */
  radio?: string;
  /** Applied when the radio is checked. */
  checked?: string;
  /** Applied when the radio is unchecked. */
  unchecked?: string;
  /** The inner dot/icon inside the indicator. */
  icon?: string;
  /** Error message element. */
  error?: string;
  /** Success message element. */
  success?: string;
}

/** CSS class overrides for radio group sub-elements. */
export interface RadioGroupClasses {
  /** Root container. */
  root?: string;
  /** Group label text. */
  label?: string;
  /** Group description text. */
  description?: string;
  /** Error message element. */
  error?: string;
  /** Success message element. */
  success?: string;
}

/**
 * Props for an individual RadioButton within a RadioGroup.
 *
 * @example
 * ```tsx
 * <RadioGroup value={sel} onValueChange={setSel}>
 *   <RadioButton value="a" label="A" />
 * </RadioGroup>
 * ```
 */
export interface RadioButtonProps extends Omit<HTMLAttributes<HTMLLabelElement>, "onChange"> {
  /** Unique value for this radio option. */
  value: string;
  /** Text label rendered beside the radio. */
  label?: ReactNode;
  /** Helper text rendered below the label. */
  description?: ReactNode;
  /** Disables this radio option. */
  disabled?: boolean;
  /** Size of the radio indicator. */
  size?: RadioButtonSize;
  /** Custom icon for the checked state. */
  checkedIcon?: ReactNode;
  /** Custom icon for the unchecked state. */
  uncheckedIcon?: ReactNode;
  /** CSS class overrides for radio sub-elements. */
  classes?: RadioButtonClasses;
}

/**
 * Props for the RadioGroup container.
 *
 * @example
 * ```tsx
 * <RadioGroup value={sel} onValueChange={setSel}>
 *   <RadioButton value="a" label="A" />
 * </RadioGroup>
 * ```
 */
export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Currently selected value. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Fires when the selected value changes. Not `onChange`. */
  onValueChange?: (value: string) => void;
  /** Fires when a radio receives focus. */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Fires when a radio loses focus. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Text label for the group. */
  label?: ReactNode;
  /** Helper text for the group. */
  description?: ReactNode;
  /** Field name for form submission. */
  name?: string;
  /** Required field indicator. */
  required?: boolean;
  /** Disables all radio buttons in the group. */
  disabled?: boolean;
  /** Displays the group in an error state. */
  error?: boolean;
  /** Error message displayed below the group. */
  errorMessage?: ReactNode;
  /** Displays the group in a success state. */
  success?: boolean;
  /** Success message displayed below the group. */
  successMessage?: ReactNode;
  /** Loading state. */
  loading?: boolean;
  /** Size of all radio indicators. */
  size?: RadioButtonSize;
  /** Layout orientation. Default: "vertical". */
  orientation?: "horizontal" | "vertical";
  /** CSS class overrides for group sub-elements. */
  classes?: RadioGroupClasses;
  /** Removes all default styling. */
  unstyled?: boolean;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  /** Radio button children. */
  children: ReactNode;
}
