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
              label="India landline"
              validate={mobilePhoneValidator}
              value={libMobileFixedValue}
              onValueChange={setLibMobileFixedValue}
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
              label="India mobile"
              validate={mobilePhoneValidator}
              value={libMobileMobileValue}
              onValueChange={setLibMobileMobileValue}
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
              label="US number"
              validate={mobilePhoneValidator}
              value={libMobileUsValue}
              onValueChange={setLibMobileUsValue}
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
