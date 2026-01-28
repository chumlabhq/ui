import type { InputHTMLAttributes, ReactNode } from "react";

export type CheckboxSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type CheckboxShape = "square" | "rounded" | "circle";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size"> {
  label?: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
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
