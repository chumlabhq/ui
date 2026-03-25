import type { OtpInputLabelProps } from "../utils/types";

const OtpInputLabel = ({
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

OtpInputLabel.displayName = "OtpInputLabel";

export { OtpInputLabel };
