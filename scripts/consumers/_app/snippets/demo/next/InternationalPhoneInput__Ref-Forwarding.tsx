"use client";

import { useRef, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { InternationalPhoneInput, PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function InternationalPhoneInputExample() {
  const [refValue, setRefValue] = useState<PhoneNumberData | undefined>();
  const [refReadValue, setRefReadValue] = useState("not fired yet");
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-4 w-full sm:max-w-md">
      <InternationalPhoneInput
        ref={inputRef}
        label="Phone Number"
        value={refValue}
        onValueChange={setRefValue}
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
      <div className="flex gap-2 flex-wrap">
        {
          (["Focus", "Select All", "Get Value"] as const).map((lbl) => (
            <Button
              key={lbl}
              size="sm"
              onClick={
                () => {
                  if (lbl === "Focus") inputRef.current?.focus();
                  else if (lbl === "Select All") {
                    inputRef.current?.focus();
                    inputRef.current?.select();
                  } else if (lbl === "Get Value")
                    setRefReadValue(JSON.stringify(inputRef.current?.value));
                }
              }
              className="rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover"
            >
              {lbl}
            </Button>
          ))
        }
      </div>
      <div
        className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        ref.current.value:
        {refReadValue}
      </div>
    </div>
  );
}
