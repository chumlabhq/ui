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
              }),
                                  input: "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:text-white dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50",
                                           countrySelect: {
                                             item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-accent/10 data-[focused]:bg-cl-accent/10 text-cl-text-chrome dark:data-[focused]:bg-cl-accent/15",
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
              }),
                                  input: "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-success focus:border-cl-success dark:text-white dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-success/30 dark:focus:border-cl-success/50",
                                           countrySelect: {
                                             item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-success/15 data-[focused]:bg-cl-success/15 text-cl-text-chrome dark:hover:bg-cl-success/10",
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
              }),
                                  input: "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-warning focus:border-cl-warning dark:text-white dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-warning/30 dark:focus:border-cl-warning/50",
                                           countrySelect: {
                                             item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-warning/15 data-[focused]:bg-cl-warning/15 text-cl-text-chrome dark:hover:bg-cl-warning/10",
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
