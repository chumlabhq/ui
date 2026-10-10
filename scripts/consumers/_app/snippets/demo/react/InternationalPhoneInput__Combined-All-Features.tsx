import { useState } from "react";
import { CountryOption, InternationalPhoneInput, PasteDetectedData, PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function InternationalPhoneInputExample() {
  const [combinedValue, setCombinedValue] = useState<PhoneNumberData | undefined>();
  const [combinedCountry, setCombinedCountry] = useState<CountryOption | null>(null);
  const [combinedPaste, setCombinedPaste] = useState<PasteDetectedData | null>(null);
  return (
    <div className="w-full sm:max-w-md space-y-3">
      <InternationalPhoneInput
        label="Phone Number"
        required
        value={combinedValue}
        onValueChange={setCombinedValue}
        onCountryChange={setCombinedCountry}
        pasteDetection
        onPasteDetect={setCombinedPaste}
        copyFormat="international"
        validateOnBlur
        validationMessage="The phone number you entered is not valid"
        countryDropdownAriaLabel="Select your country"
        preferredCountries={["us", "gb", "ca", "in"]}
        placeholder="Enter your phone number"
        classes={
          {
            root: "flex flex-col gap-1",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            input: "flex-1 h-10 px-3 rounded-cl-md border outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-cl-bg-input focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:[color-scheme:dark]",
            countrySelect: {
                     trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-cl-bg-input hover:bg-cl-bg-hover text-cl-text-chrome",
                     content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-text/10",
                     searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-text/10",
                     searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary",
                     list: "max-h-60 overflow-y-auto",
                     item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover text-cl-text-chrome",
                     icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                     itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
                     searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                     empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                   }
          }
        }
      />
      <div
        className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
      >
        <div>
          Country:
          {combinedCountry?.name || combinedValue?.countryCode || "US"}
          {" "}
          {combinedCountry?.dialCode || ""}
        </div>
        <div>
          Number:
          {combinedValue?.fullNumber || "—"}
          |
          {" "}
          Valid:
          {combinedValue?.isValid ? "Yes" : "No"}
        </div>
        {
          combinedPaste && (
            <div>
              Last paste:
              {combinedPaste.rawValue}
              →
              {" "}
              {combinedPaste.detectedCountry?.name || "no country"}
            </div>
          )
        }
      </div>
    </div>
  );
}
