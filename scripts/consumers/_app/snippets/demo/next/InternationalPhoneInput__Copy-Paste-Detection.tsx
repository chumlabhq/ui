"use client";

import { useState } from "react";
import { InternationalPhoneInput, PasteDetectedData, PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function InternationalPhoneInputExample() {
  const [copyPasteValue, setCopyPasteValue] = useState<PhoneNumberData | undefined>();
  const [lastPasteData, setLastPasteData] = useState<PasteDetectedData | null>(null);
  return (
    <div className="w-full sm:max-w-md">
      <InternationalPhoneInput
        label="Phone Number"
        value={copyPasteValue}
        onValueChange={setCopyPasteValue}
        enablePasteDetection
        copyFormat="e164"
        onPasteDetected={setLastPasteData}
        placeholder="Try pasting +44 20 7123 4567"
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
      <div className="mt-3 space-y-2">
        <p className="text-sm text-cl-text-secondary">
          <strong>Paste:</strong>
          Try
          {" "}
          <code
            className="px-1.5 py-0.5 rounded-cl-md text-[11px] font-mono font-medium bg-cl-bg-elevated text-cl-text-secondary"
          >
            +44 20 7123 4567
          </code>
          or
          {" "}
          <code
            className="px-1.5 py-0.5 rounded-cl-md text-[11px] font-mono font-medium bg-cl-bg-elevated text-cl-text-secondary"
          >
            +1 555 123 4567
          </code>
        </p>
        <p className="text-sm text-cl-text-secondary">
          <strong>Copy:</strong>
          Select and Ctrl+C — copies in E.164 format.
        </p>
      </div>
      {
        lastPasteData && (
          <div
            className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
          >
            <p>
              Pasted:
              {lastPasteData.rawValue}
              | Country:
              {" "}
              {lastPasteData.detectedCountry?.name || "Not detected"}
              | Phone:
              {lastPasteData.phoneNumber}
            </p>
          </div>
        )
      }
      {
        copyPasteValue && (
          <div
            className="mt-2 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
          >
            E.164:
            {copyPasteValue.fullNumber}
            | Valid:
            {" "}
            {copyPasteValue.isValid ? "Yes" : "No"}
          </div>
        )
      }
    </div>
  );
}
