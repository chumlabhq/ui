import { useState } from "react";
import { InternationalPhoneInput, PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function InternationalPhoneInputExample() {
  const [basicValue, setBasicValue] = useState<PhoneNumberData | undefined>();
  return (
    <div className="w-full sm:max-w-md">
      <InternationalPhoneInput
        aria-label="Phone number"
        value={basicValue}
        onValueChange={setBasicValue}
        placeholder="Enter phone number"
      />
      <div
        className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        onValueChange:
        {basicValue ? JSON.stringify(basicValue) : "not fired yet"}
      </div>
    </div>
  );
}
