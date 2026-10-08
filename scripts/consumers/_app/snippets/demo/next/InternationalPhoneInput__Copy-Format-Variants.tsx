"use client";

import { useState } from "react";
import { InternationalPhoneInput, PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function InternationalPhoneInputExample() {
  const [copyFormatE164, setCopyFormatE164] = useState<PhoneNumberData | undefined>();
  const [copyFormatIntl, setCopyFormatIntl] = useState<PhoneNumberData | undefined>();
  const [copyFormatNational, setCopyFormatNational] = useState<PhoneNumberData | undefined>();
  return (
    <div className="space-y-6 w-full sm:max-w-md">
      <div>
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          E.164
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            aria-label="E164 format"
            value={copyFormatE164}
            onValueChange={setCopyFormatE164}
            copyFormat="e164"
            placeholder="+15551234567"
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
                         item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text-chrome",
                         icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                         itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
                         searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                         empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                       }
              }
            }
          />
        </div>
      </div>
      <div>
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          International
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            aria-label="International format"
            value={copyFormatIntl}
            onValueChange={setCopyFormatIntl}
            copyFormat="international"
            placeholder="+1 (555) 123-4567"
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
                         item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text-chrome",
                         icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                         itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
                         searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                         empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                       }
              }
            }
          />
        </div>
      </div>
      <div>
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          National
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            aria-label="National format"
            value={copyFormatNational}
            onValueChange={setCopyFormatNational}
            copyFormat="national"
            placeholder="(555) 123-4567"
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
                         item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text-chrome",
                         icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                         itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
                         searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                         empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                       }
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
