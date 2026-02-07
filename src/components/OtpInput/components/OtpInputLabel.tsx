import type { OtpInputLabelProps } from "../utils/types";

export const OtpInputLabel = ({
  label,
  required = false,
  htmlFor,
  className,
}: OtpInputLabelProps) => {
  return (
    <label htmlFor={htmlFor} className={className}>
      {label}
      {required && <span aria-hidden="true">*</span>}
    </label>
  );
};
