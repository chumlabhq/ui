"use client";

import { useState } from "react";
import { InternationalPhoneInput, PhoneNumberData } from "@chumlab/ui/international-phone-input";
import { createLibphonenumberValidator } from "@chumlab/ui/phone-validators";

const phoneSample = (
  countryCode: string,
  dialCode: string,
  phoneNumber: string,
  validator: (d: PhoneNumberData) => { valid: boolean },
): PhoneNumberData => {
  const fullNumber = `${dialCode}${phoneNumber}`;
  return {
    countryCode,
    phoneNumber,
    fullNumber,
    isValid: validator({ countryCode, phoneNumber, fullNumber, isValid: false })
      .valid,
  };
};

const mobilePhoneValidator = createLibphonenumberValidator({
  mobileOnly: true,
  message: "Enter a valid mobile number for the selected country",
});

const possiblePhoneValidator = createLibphonenumberValidator({ mode: "isPossible" });

const anyValidPhoneValidator = createLibphonenumberValidator({
  message: "Enter a valid phone number for the selected country",
});

export default function InternationalPhoneInputExample() {
  const [libIsValidValue, setLibIsValidValue] = useState<PhoneNumberData | undefined>(
    () => phoneSample("US", "+1", "1111111111", anyValidPhoneValidator),
  );
  const [libIsPossibleValue, setLibIsPossibleValue] = useState<PhoneNumberData | undefined>(
    () => phoneSample("US", "+1", "1111111111", possiblePhoneValidator),
  );
  const [libMobileFixedValue, setLibMobileFixedValue] = useState<PhoneNumberData | undefined>(
    () => phoneSample("IN", "+91", "1234567890", mobilePhoneValidator),
  );
  const [libMobileMobileValue, setLibMobileMobileValue] = useState<PhoneNumberData | undefined>(
    () => phoneSample("IN", "+91", "9876543210", mobilePhoneValidator),
  );
  const [libMobileUsValue, setLibMobileUsValue] = useState<PhoneNumberData | undefined>(
    () => phoneSample("US", "+1", "4155550142", mobilePhoneValidator),
  );
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <InternationalPhoneInput
            label="Phone Number"
            validate={anyValidPhoneValidator}
            value={libIsValidValue}
            onValueChange={setLibIsValidValue}
            classes={
              {
                root: "flex flex-col gap-1",
                label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                input: "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50 dark:[color-scheme:dark]",
                countrySelect: {
                         trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-white hover:bg-cl-bg-hover text-cl-text dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:hover:bg-cl-text/6 dark:text-cl-text-secondary",
                         content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-text/10",
                         searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-text/10",
                         searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary",
                         list: "max-h-60 overflow-y-auto",
                         item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text dark:hover:bg-cl-text/6 dark:data-[focused]:bg-cl-text/10 dark:text-cl-text-secondary",
                         icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                         itemIndicator: "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
                         searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                         empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                       }
              }
            }
          />
          {
            libIsValidValue && (
              <div
                className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
              >
                isValid:
                {libIsValidValue.isValid ? "true" : "false"}
                · E.164:
                {" "}
                {libIsValidValue.fullNumber || "—"}
              </div>
            )
          }
        </div>
        <div>
          <InternationalPhoneInput
            label="Phone Number"
            validate={possiblePhoneValidator}
            value={libIsPossibleValue}
            onValueChange={setLibIsPossibleValue}
            classes={
              {
                root: "flex flex-col gap-1",
                label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                input: "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50 dark:[color-scheme:dark]",
                countrySelect: {
                         trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-white hover:bg-cl-bg-hover text-cl-text dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:hover:bg-cl-text/6 dark:text-cl-text-secondary",
                         content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-text/10",
                         searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-text/10",
                         searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary",
                         list: "max-h-60 overflow-y-auto",
                         item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text dark:hover:bg-cl-text/6 dark:data-[focused]:bg-cl-text/10 dark:text-cl-text-secondary",
                         icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                         itemIndicator: "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
                         searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                         empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                       }
              }
            }
          />
          {
            libIsPossibleValue && (
              <div
                className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
              >
                isValid:
                {libIsPossibleValue.isValid ? "true" : "false"}
                · E.164:
                {" "}
                {libIsPossibleValue.fullNumber || "—"}
              </div>
            )
          }
        </div>
      </div>
      <div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <InternationalPhoneInput
              label="India landline → rejected"
              validate={mobilePhoneValidator}
              value={libMobileFixedValue}
              onValueChange={setLibMobileFixedValue}
              classes={
                {
                  root: "flex flex-col gap-1",
                  label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                  input: "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50 dark:[color-scheme:dark]",
                  countrySelect: {
                           trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-white hover:bg-cl-bg-hover text-cl-text dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:hover:bg-cl-text/6 dark:text-cl-text-secondary",
                           content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-text/10",
                           searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-text/10",
                           searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary",
                           list: "max-h-60 overflow-y-auto",
                           item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text dark:hover:bg-cl-text/6 dark:data-[focused]:bg-cl-text/10 dark:text-cl-text-secondary",
                           icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                           itemIndicator: "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
                           searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                           empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                         }
                }
              }
            />
            {
              libMobileFixedValue && (
                <div
                  className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
                >
                  isValid:
                  {libMobileFixedValue.isValid ? "true" : "false"}
                  · E.164:
                  {" "}
                  {libMobileFixedValue.fullNumber || "—"}
                </div>
              )
            }
          </div>
          <div>
            <InternationalPhoneInput
              label="India mobile → accepted"
              validate={mobilePhoneValidator}
              value={libMobileMobileValue}
              onValueChange={setLibMobileMobileValue}
              classes={
                {
                  root: "flex flex-col gap-1",
                  label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                  input: "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50 dark:[color-scheme:dark]",
                  countrySelect: {
                           trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-white hover:bg-cl-bg-hover text-cl-text dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:hover:bg-cl-text/6 dark:text-cl-text-secondary",
                           content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-text/10",
                           searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-text/10",
                           searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary",
                           list: "max-h-60 overflow-y-auto",
                           item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text dark:hover:bg-cl-text/6 dark:data-[focused]:bg-cl-text/10 dark:text-cl-text-secondary",
                           icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                           itemIndicator: "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
                           searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                           empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                         }
                }
              }
            />
            {
              libMobileMobileValue && (
                <div
                  className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
                >
                  isValid:
                  {libMobileMobileValue.isValid ? "true" : "false"}
                  · E.164:
                  {" "}
                  {libMobileMobileValue.fullNumber || "—"}
                </div>
              )
            }
          </div>
          <div>
            <InternationalPhoneInput
              label="US number → accepted"
              validate={mobilePhoneValidator}
              value={libMobileUsValue}
              onValueChange={setLibMobileUsValue}
              classes={
                {
                  root: "flex flex-col gap-1",
                  label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                  input: "flex-1 h-10 px-3 rounded-cl-md border bg-transparent outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-white focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:text-white dark:placeholder:text-cl-text-tertiary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50 dark:[color-scheme:dark]",
                  countrySelect: {
                           trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-white hover:bg-cl-bg-hover text-cl-text dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:hover:bg-cl-text/6 dark:text-cl-text-secondary",
                           content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-text/10",
                           searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-text/10",
                           searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary",
                           list: "max-h-60 overflow-y-auto",
                           item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover data-[focused]:bg-cl-bg-hover text-cl-text dark:hover:bg-cl-text/6 dark:data-[focused]:bg-cl-text/10 dark:text-cl-text-secondary",
                           icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                           itemIndicator: "w-4 h-4 shrink-0 text-cl-accent dark:text-cl-accent",
                           searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                           empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                         }
                }
              }
            />
            {
              libMobileUsValue && (
                <div
                  className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
                >
                  isValid:
                  {libMobileUsValue.isValid ? "true" : "false"}
                  · E.164:
                  {" "}
                  {libMobileUsValue.fullNumber || "—"}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
