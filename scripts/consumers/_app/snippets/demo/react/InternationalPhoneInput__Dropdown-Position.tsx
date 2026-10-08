import { useState } from "react";
import { InternationalPhoneInput, PhoneNumberData } from "@chumlab/ui/international-phone-input";

export default function InternationalPhoneInputExample() {
  const [posBotValue, setPosBotValue] = useState<PhoneNumberData | undefined>();
  const [posTopValue, setPosTopValue] = useState<PhoneNumberData | undefined>();
  const [forceBottomValue, setForceBottomValue] = useState<PhoneNumberData | undefined>();
  const [forceTopValue, setForceTopValue] = useState<PhoneNumberData | undefined>();
  const [forceLockScrollValue, setForceLockScrollValue] = useState<PhoneNumberData | undefined>();
  return (
    <>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-md">
            <InternationalPhoneInput
              aria-label="Position bottom"
              value={posBotValue}
              onValueChange={setPosBotValue}
              dropdownPosition="bottom"
              placeholder="Opens below..."
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
          </div>
        </div>
        <div>
          <div className="w-full sm:max-w-md">
            <InternationalPhoneInput
              aria-label="Position top"
              value={posTopValue}
              onValueChange={setPosTopValue}
              dropdownPosition="top"
              placeholder="Opens above..."
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
          </div>
        </div>
      </div>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-md">
            <InternationalPhoneInput
              aria-label="Force bottom"
              value={forceBottomValue}
              onValueChange={setForceBottomValue}
              dropdownPosition="bottom"
              forceDropdownPosition
              placeholder="Always opens below..."
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
          </div>
        </div>
        <div>
          <div className="w-full sm:max-w-md">
            <InternationalPhoneInput
              aria-label="Force top"
              value={forceTopValue}
              onValueChange={setForceTopValue}
              dropdownPosition="top"
              forceDropdownPosition
              placeholder="Always opens above..."
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
          </div>
        </div>
      </div>
      <div className="w-full space-y-8">
        <div>
          <div className="w-full sm:max-w-md">
            <InternationalPhoneInput
              aria-label="Force bottom with scroll lock"
              value={forceLockScrollValue}
              onValueChange={setForceLockScrollValue}
              dropdownPosition="bottom"
              forceDropdownPosition
              lockScroll
              placeholder="Forced bottom + scroll locked"
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
          </div>
        </div>
      </div>
    </>
  );
}
