import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputLabelProps {
  label: ReactNode;
  required?: boolean;
  inputId?: string;
  className?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onLeadingIconClick?: () => void;
  onTrailingIconClick?: () => void;
  leadingIconLabel?: string;
  trailingIconLabel?: string;
  isLoading?: boolean;
  loader?: ReactNode;
  loaderSize?: number;
  fullWidth?: boolean;
  containerClassName?: string;
  wrapperClassName?: string;
  focusClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}
