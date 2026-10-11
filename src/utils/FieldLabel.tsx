import type { LabelHTMLAttributes, ReactNode } from "react";

export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label: ReactNode;
  required?: boolean;
}

export const FieldLabel = ({
  label,
  required = false,
  ...rest
}: FieldLabelProps) => {
  return (
    <label {...rest}>
      {label}
      {required && <span aria-hidden="true">*</span>}
    </label>
  );
};
