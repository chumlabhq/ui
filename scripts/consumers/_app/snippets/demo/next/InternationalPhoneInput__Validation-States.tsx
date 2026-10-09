"use client";

import { useState } from "react";
import { InternationalPhoneInput, PhoneNumberData } from "@chumlab/ui/international-phone-input";

const CheckSmallIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function InternationalPhoneInputExample() {
  const [errorValue, setErrorValue] = useState<PhoneNumberData | undefined>();
  const [successValue, setSuccessValue] = useState<PhoneNumberData | undefined>();
  const successOk = successValue?.isValid === true;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
      <div>
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Error
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            label="Phone Number"
            value={errorValue}
            onValueChange={setErrorValue}
            error
            errorMessage="Please enter a valid phone number"
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
                                  input: "flex-1 h-10 px-3 rounded-cl-md border bg-cl-bg-input outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-error focus:ring-2 focus:ring-cl-error/30",
                                           countrySelect: {
                                             trigger: {
                              trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-error bg-cl-bg-input hover:bg-cl-bg-hover text-cl-text-chrome"
                            }.trigger
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
          Success
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            label="Phone Number"
            value={successValue}
            onValueChange={setSuccessValue}
            success={successOk}
            successMessage={
              successOk ? (
                <>
                  <CheckSmallIcon />
                  Phone number is valid
                </>
              ) : (
                undefined
              )
            }
            placeholder="Enter a valid number"
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
                                  ...(successOk
                                    ? {
                                        input: "flex-1 h-10 px-3 rounded-cl-md border bg-cl-bg-input outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-success focus:ring-2 focus:ring-cl-success/30",
                                        countrySelect: {
                                          trigger: {
                                trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-success bg-cl-bg-input text-cl-text-chrome"
                              }.trigger
                                        }
                                      }
                                    : {})
                                }
            }
          />
        </div>
      </div>
    </div>
  );
}
