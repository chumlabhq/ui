import type { ReactNode } from "react";

export interface FieldLabelProps {
  label: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

export const FieldLabel = ({
  label,
  required = false,
  htmlFor,
  className,
}: FieldLabelProps) => {
  return (
    <label htmlFor={htmlFor} className={className}>
      {label}
      {required && <span aria-hidden="true">*</span>}
    </label>
  );
};
