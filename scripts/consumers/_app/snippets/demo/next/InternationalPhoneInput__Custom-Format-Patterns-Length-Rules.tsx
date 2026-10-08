"use client";

import { useState } from "react";
import { InternationalPhoneInput, PhoneFormatPattern, PhoneLengthRule, PhoneNumberData } from "@chumlab/ui/international-phone-input";

const CUSTOM_LENGTH_RULES: Record<string, PhoneLengthRule> = {
  SG: { min: 8, max: 8 },
};

const CUSTOM_FORMAT_PATTERNS: Record<string, PhoneFormatPattern> = {
  CUSTOM_SG: {
    pattern: (digits: string) => {
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)}-${digits.slice(4, 8)}`;
    },
    countries: ["sg"],
  },
};

export default function InternationalPhoneInputExample() {
  const [customPatternValue, setCustomPatternValue] = useState<PhoneNumberData | undefined>();
  return (
    <div className="w-full sm:max-w-md">
      <InternationalPhoneInput
        label="Singapore (custom format: XXXX-XXXX)"
        defaultCountry="sg"
        preferredCountries={["sg"]}
        value={customPatternValue}
        onValueChange={setCustomPatternValue}
        formatPatterns={CUSTOM_FORMAT_PATTERNS}
        lengthRules={CUSTOM_LENGTH_RULES}
        placeholder="1234-5678"
        classes={
          {
            root: "flex flex-col gap-1",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            input: "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:text-white dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50 dark:[color-scheme:dark]",
            countrySelect: {
                     trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-cl-bg-input hover:bg-cl-bg-hover text-cl-text-chrome dark:border dark:border-cl-text/10 dark:hover:bg-cl-text/6",
                     content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-text/10 dark:border",
                     searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-text/10 dark:border",
                     searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white",
                     list: "max-h-60 overflow-y-auto",
                     item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text-chrome dark:hover:bg-cl-text/6",
                     icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                     itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
                     searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                     empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                   }
          }
        }
      />
      {
        customPatternValue && (
          <div
            className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
          >
            Full:
            {customPatternValue.fullNumber}
            | Valid:
            {" "}
            {customPatternValue.isValid ? "Yes" : "No"}
            | National:
            {" "}
            {customPatternValue.nationalNumber}
          </div>
        )
      }
    </div>
  );
}
