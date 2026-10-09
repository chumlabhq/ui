"use client";

import { useState } from "react";
import { CountryFlag } from "@chumlab/ui/country-flag";
import { InternationalPhoneInput, PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function InternationalPhoneInputExample() {
  const [renderCustomValue, setRenderCustomValue] = useState<PhoneNumberData | undefined>();
  return (
    <div className="w-full sm:max-w-md">
      <InternationalPhoneInput
        label="Phone Number"
        value={renderCustomValue}
        onValueChange={setRenderCustomValue}
        placeholder="Enter phone number"
        renderCountryOption={
          ({ country, isSelected }) => (
            <div className="flex items-center gap-3 min-w-0">
              <CountryFlag
                code={country.flag}
                size={22}
                className="shrink-0 rounded-cl-sm"
                style={{ height: 17 }}
              />
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-medium ${isSelected ? ("text-cl-accent") : ""}`}>
                  {country.name}
                </div>
                <div className={"text-[11px] text-cl-text-tertiary"}>
                  {country.value} · {country.dialCode}
                </div>
              </div>
            </div>
          )
        }
        renderSelectedCountry={
          (country) => (
            <div className="flex items-center gap-2">
              <CountryFlag
                code={country.flag}
                size={22}
                className="rounded-cl-sm"
                style={{ height: 17 }}
              />
              <span className="text-xs font-medium">{country.value}</span>
              <span className={"text-xs text-cl-text-tertiary"}>
                {country.dialCode}
              </span>
            </div>
          )
        }
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
    </div>
  );
}
