import { OtpInput } from "@chumlab/ui/otp-input";
import { useState } from "react";

export default function Example() {
  const [otp, setOtp] = useState("");
  return (
    <OtpInput
      label="Verification Code"
      description="Enter the 6-digit code sent to your phone"
      value={otp}
      onValueChange={setOtp}
    />
  );
}
