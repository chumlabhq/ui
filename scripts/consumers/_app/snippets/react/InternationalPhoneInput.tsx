import { useState } from "react";
import { InternationalPhoneInput } from "@chumlab/ui/international-phone-input";
import type { PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function Example() {
  const [phone, setPhone] = useState<PhoneNumberData | undefined>();
  return (
    <InternationalPhoneInput
      label="Phone Number"
      value={phone}
      onValueChange={setPhone}
      placeholder="Enter phone number"
    />
  );
}
