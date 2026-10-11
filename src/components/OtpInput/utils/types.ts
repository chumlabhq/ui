import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export interface OtpInputLabelProps {
  label: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

export interface OtpInputClasses {
  /** The field and everything labelling it. */
  root?: string;
  /** The row of boxes. */
  control?: string;
  /** One run of boxes when `groups` splits the code up. */
  group?: string;
  /** A single character box. */
  input?: string;
  /** The label above the row. */
  label?: string;
  /** The error or hint line under the row. */
  message?: string;
  /** What is drawn between two groups. */
  separator?: string;
  /** The helper line under the label. */
  description?: string;
}

export interface OtpInputRenderProps {
  index: number;
  value: string;
  disabled: boolean;
  error: boolean;
  filled: boolean;
  inputProps: InputHTMLAttributes<HTMLInputElement> & {
    ref: (el: HTMLInputElement | null) => void;
  };
}

/**
 * Props for the OtpInput component.
 *
 * @example
 * ```tsx
 * <OtpInput value={otp} onValueChange={setOtp} length={6} />
 * ```
 */
export interface OtpInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Number of OTP input slots. */
  length?: number;
  /** Current OTP string. Not `code`. */
  value?: string;
  defaultValue?: string;
  /** Fires with the full OTP string on every keystroke. Not `onChange`. */
  onValueChange?: (value: string) => void;
  /** Fires when all slots are filled. */
  onComplete?: (value: string) => void;
  label?: ReactNode;
  id?: string;
  name?: string;
  required?: boolean;
  description?: ReactNode;
  /** Whether the input is in an error state. Pair with `errorMessage`. */
  error?: boolean;
  /** Message shown below the input when `error` is true. Not `helperText`. */
  errorMessage?: ReactNode;
  success?: boolean;
  successMessage?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  /** Visual grouping array, e.g. `[3, 3]`. Not `grouping` or `groupPattern`. Sum must equal `length`. */
  groups?: number[];
  separator?: ReactNode;
  allowPaste?: boolean;
  autoFocusFirst?: boolean;
  /** Input type for each slot. Use `"password"` to mask characters. */
  inputType?: "text" | "password" | "tel";
  inputPattern?: string;
  inputClassNames?: (string | undefined)[];
  fullWidth?: boolean;
  renderInput?: (props: OtpInputRenderProps) => ReactNode;
  validate?: (char: string) => boolean;
  inputAriaLabel?: (index: number, length: number) => string;
  classes?: OtpInputClasses;
  unstyled?: boolean;
}
