import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputLabelProps {
  label: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  /** Green success state for validated fields. */
  success?: boolean;
  successMessage?: ReactNode;
  /**
   * Visual size variant. Emits `data-size` on the root container for CSS targeting.
   * Does NOT apply built-in styles — target with `[data-size="lg"]` in your CSS.
   */
  size?: InputSize;
  /**
   * Inline text or element rendered before the input (e.g. "$", "https://").
   * For interactive icons, use `startIcon` + `onStartIconClick` instead.
   */
  prefix?: ReactNode;
  /**
   * Inline text or element rendered after the input (e.g. "USD", ".com").
   * For interactive icons, use `endIcon` + `onEndIconClick` instead.
   */
  suffix?: ReactNode;
  /** Icon rendered before the input. Becomes a button when `onStartIconClick` is provided. */
  startIcon?: ReactNode;
  /** Icon rendered after the input. Becomes a button when `onEndIconClick` is provided. */
  endIcon?: ReactNode;
  /** Makes `startIcon` a clickable button. Requires `startIconLabel` for accessibility. */
  onStartIconClick?: () => void;
  /** Makes `endIcon` a clickable button. Requires `endIconLabel` for accessibility. */
  onEndIconClick?: () => void;
  /** Accessible label for `startIcon` when it is clickable. Required with `onStartIconClick`. */
  startIconLabel?: string;
  /** Accessible label for `endIcon` when it is clickable. Required with `onEndIconClick`. */
  endIconLabel?: string;
  /** Convenience callback fired with the input's string value on change. */
  onValueChange?: (value: string) => void;
  /** Show a built-in clear button when the input has a value. */
  clearable?: boolean;
  /**
   * Callback when the clear button is clicked.
   * If not provided, `onChange` is fired with a synthetic event whose `target` is the real
   * HTMLInputElement (so `e.target.name`, `e.target.value` etc. work correctly).
   */
  onClear?: () => void;
  /** Show character count (requires maxLength to be set). */
  showCount?: boolean;
  loading?: boolean;
  loader?: ReactNode;
  /**
   * Size of the default CircularLoader in pixels.
   * Only applies to the built-in loader — ignored when a custom `loader` prop is provided.
   */
  loaderSize?: number;
  fullWidth?: boolean;
  /** CSS class for the root container element (wraps label, input row, error/success). */
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  successClassName?: string;
  descriptionClassName?: string;
  inputClassName?: string;
  prefixClassName?: string;
  suffixClassName?: string;
  countClassName?: string;
}
