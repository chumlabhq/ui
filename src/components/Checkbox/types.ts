import type { InputHTMLAttributes, ReactNode, FocusEvent } from "react";

export type CheckboxSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type CheckboxShape = "square" | "rounded" | "circle";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size" | "defaultChecked"> {
  label?: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: ReactNode;
  size?: CheckboxSize;
  shape?: CheckboxShape;
  checkedIcon?: ReactNode;
  uncheckedIcon?: ReactNode;
  indeterminateIcon?: ReactNode;
  containerClassName?: string;
  labelContainerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  checkboxClassName?: string;
  checkedClassName?: string;
  uncheckedClassName?: string;
  indeterminateClassName?: string;
  iconClassName?: string;
  errorClassName?: string;
  sizeClassName?: string;
  shapeClassName?: string;
}
