import type { InputHTMLAttributes, ReactNode } from "react";

export interface OtpInputLabelProps {
  label: ReactNode;
  required?: boolean;
  inputId?: string;
  className?: string;
}

export interface OtpInputStyleProps {
  containerClassName?: string;
  wrapperClassName?: string;
  groupClassName?: string;
  inputClassName?: string;
  inputFocusClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  separatorClassName?: string;
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

export interface OtpInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type" | "maxLength"
  >,
  OtpInputStyleProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  label?: ReactNode;
  required?: boolean;
  error?: boolean;
  errorMessage?: ReactNode;
  disabled?: boolean;
  groups?: number[];
  separator?: ReactNode;
  allowPaste?: boolean;
  autoFocusFirst?: boolean;
  inputType?: "text" | "password";
  inputPattern?: string;
  inputClassNames?: (string | undefined)[];
  fullWidth?: boolean;
  renderInput?: (props: OtpInputRenderProps) => ReactNode;
}
