import type { TextareaHTMLAttributes, ReactNode } from "react";

export interface TextAreaLabelProps {
  label: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

export type TextAreaSize = "sm" | "md" | "lg";

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  size?: TextAreaSize;
  /** Icon rendered before the textarea. Becomes a button when `onStartIconClick` is provided. */
  startIcon?: ReactNode;
  /** Icon rendered after the textarea. Becomes a button when `onEndIconClick` is provided. */
  endIcon?: ReactNode;
  /** Makes `startIcon` a clickable button. Requires `startIconLabel` for accessibility. */
  onStartIconClick?: () => void;
  /** Makes `endIcon` a clickable button. Requires `endIconLabel` for accessibility. */
  onEndIconClick?: () => void;
  /** Accessible label for `startIcon` when it is clickable. Required with `onStartIconClick`. */
  startIconLabel?: string;
  /** Accessible label for `endIcon` when it is clickable. Required with `onEndIconClick`. */
  endIconLabel?: string;
  /** Convenience callback fired with the textarea's string value on change. */
  onValueChange?: (value: string) => void;
  /** Show a built-in clear button when the textarea has a value. */
  clearable?: boolean;
  /**
   * Callback when the clear button is clicked.
   * If not provided, `onChange` is fired with a synthetic event whose `target` is the real
   * HTMLTextAreaElement (so `e.target.name`, `e.target.value` etc. work correctly).
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
  /** CSS class for the root container element (wraps label, textarea row, error/success). */
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  successClassName?: string;
  descriptionClassName?: string;
  textAreaClassName?: string;
  countClassName?: string;
}
