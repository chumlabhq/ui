import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Preset size variant for the toggle. */
export type ToggleSize = "sm" | "md" | "lg";

/** CSS class overrides for toggle sub-elements. */
export interface ToggleClasses {
  /** Root button element. */
  root?: string;
  /** Inner content wrapper. */
  content?: string;
  /** Icon wrapper. */
  icon?: string;
}

export interface ToggleProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange" | "defaultValue"
  > {
  /** Whether the toggle is pressed. */
  pressed?: boolean;
  /** Initial pressed state for uncontrolled usage. */
  defaultPressed?: boolean;
  /** Fires when the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
  /** Disables interaction. */
  disabled?: boolean;
  /** Shows a loading state. */
  loading?: boolean;
  /** Size variant. Default: "md". */
  size?: ToggleSize;
  /** Icon or content to render inside the toggle. */
  children?: ReactNode;
  /** CSS class overrides for toggle sub-elements. */
  classes?: ToggleClasses;
  /** Removes all default styling. */
  unstyled?: boolean;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
}
