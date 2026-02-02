import type { TextareaHTMLAttributes, ReactNode } from "react";

export interface TextAreaLabelProps {
  label: ReactNode;
  required?: boolean;
  textAreaId?: string;
  className?: string;
}

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
