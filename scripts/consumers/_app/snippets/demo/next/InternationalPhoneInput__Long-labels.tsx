import { InternationalPhoneInput } from "@chumlab/ui/international-phone-input";

export default function InternationalPhoneInputExample() {
  return (
    <div className="w-full max-w-sm">
      <InternationalPhoneInput
        label="Mobile number the courier can call on the day of delivery"
        description="Used only for this delivery, and deleted once the parcel has been signed for."
      />
    </div>
  );
}
