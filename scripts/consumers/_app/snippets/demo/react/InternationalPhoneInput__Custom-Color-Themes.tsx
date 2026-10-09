import { useState } from "react";
import { InternationalPhoneInput, PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function InternationalPhoneInputExample() {
  const [purpleFocusValue, setPurpleFocusValue] = useState<PhoneNumberData | undefined>();
  const [greenFocusValue, setGreenFocusValue] = useState<PhoneNumberData | undefined>();
  const [orangeFocusValue, setOrangeFocusValue] = useState<PhoneNumberData | undefined>();
  return (
    <div className="flex flex-wrap gap-8">
      <div className="w-full sm:max-w-md">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Purple theme
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            aria-label="Purple theme"
            value={purpleFocusValue}
            onValueChange={setPurpleFocusValue}
            placeholder="Enter phone number"
            classes={
              {
                                  ...({
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
              }),
                                  input: "flex-1 h-10 px-3 rounded-cl-md border outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-cl-bg-input focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus",
                                           countrySelect: {
                                             item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-accent/10 data-[highlighted]:bg-cl-accent/10 text-cl-text-chrome",
                                             itemIndicator: "w-4 h-4 shrink-0 text-cl-accent"
                                           }
                                }
            }
          />
        </div>
      </div>
      <div className="w-full sm:max-w-md">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Green theme
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            aria-label="Green theme"
            value={greenFocusValue}
            onValueChange={setGreenFocusValue}
            placeholder="Enter phone number"
            classes={
              {
                                  ...({
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
              }),
                                  input: "flex-1 h-10 px-3 rounded-cl-md border outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-cl-bg-input focus:ring-2 focus:ring-cl-success focus:border-cl-success",
                                           countrySelect: {
                                             item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-success-bg data-[highlighted]:bg-cl-success/15 text-cl-text-chrome",
                                             itemIndicator: "w-4 h-4 shrink-0 text-cl-success"
                                           }
                                }
            }
          />
        </div>
      </div>
      <div className="w-full sm:max-w-md">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Orange theme
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            aria-label="Orange theme"
            value={orangeFocusValue}
            onValueChange={setOrangeFocusValue}
            placeholder="Enter phone number"
            classes={
              {
                                  ...({
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
              }),
                                  input: "flex-1 h-10 px-3 rounded-cl-md border outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-cl-bg-input focus:ring-2 focus:ring-cl-warning focus:border-cl-warning",
                                           countrySelect: {
                                             item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-warning/15 data-[highlighted]:bg-cl-warning/15 text-cl-text-chrome",
                                             itemIndicator: "w-4 h-4 shrink-0 text-cl-warning"
                                           }
                                }
            }
          />
        </div>
      </div>
    </div>
  );
}
