import type { InputHTMLAttributes, ReactNode, FocusEvent } from "react";

export type CheckboxSize = "xs" | "sm" | "md" | "lg" | "xl" | number;
export type CheckboxShape = "square" | "rounded" | "circle";

export interface CheckboxClasses {
  root?: string;
  labelContainer?: string;
  label?: string;
  description?: string;
  checkbox?: string;
  checked?: string;
  unchecked?: string;
  indeterminate?: string;
  icon?: string;
  error?: string;
}

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
  classes?: CheckboxClasses;
  unstyled?: boolean;
  reduceMotion?: boolean | "auto";
}
