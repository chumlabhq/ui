import { useState } from "react";
import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  const [basic, setBasic] = useState("");
  return (
    <div className="flex flex-col gap-4">
                {}
                <OtpInput
                  label="Verification Code"
                  description="Enter the 6-digit code sent to your phone"
                  value={basic}
                  onValueChange={setBasic}
                />
              </div>
  );
}
