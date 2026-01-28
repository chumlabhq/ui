import type { TextareaHTMLAttributes, ReactNode } from "react";

export interface TextAreaLabelProps {
  label: ReactNode;
  required?: boolean;
  textAreaId?: string;
  className?: string;
}

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onLeadingIconClick?: () => void;
  onTrailingIconClick?: () => void;
  isLoading?: boolean;
  loader?: ReactNode;
  loaderSize?: number;
  fullWidth?: boolean;
  containerClassName?: string;
  wrapperClassName?: string;
  focusClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  className?: string;
}
