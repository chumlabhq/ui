"use client";

import { useState } from "react";
import { TextArea } from "@chumlab/ui/textarea";

const wrapperFor = (err: boolean, ok: boolean) =>
    err ? "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-error shadow-sm shadow-danger/0.04 focus-within:ring-2 focus-within:ring-cl-error/15" : ok ? "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-success shadow-sm shadow-success/0.04 focus-within:ring-2 focus-within:ring-cl-success/15" : "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus";

const CheckIcon = ({ className = "" }: { className?: string }) => (
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

const AlertIcon = ({ className = "" }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

export default function TextAreaExample() {
  const [bio, setBio] = useState("");
  const [bio2, setBio2] = useState("");
  const bioOk = bio.length >= 10;
  const bioBad = bio.length > 0 && bio.length < 10;
  return (
    <div className="w-full max-w-md">
      <TextArea
        label="Bio"
        placeholder="Tell us about yourself..."
        maxLength={200}
        showCount
        clearable
        value={bio2}
        onChange={(e) => setBio2(e.target.value)}
        onClear={() => setBio2("")}
        error={bioBad}
        errorMessage={
          <>
            <AlertIcon />
            At least 10 characters required
          </>
        }
        success={bioOk}
        successMessage={
          <>
            <CheckIcon />
            Looks great!
          </>
        }
        classes={
          { ...({
            control: "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus",
            input: "w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-tertiary",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            /* No colour here on purpose. The library paints this slot
               `data-[invalid]:text-cl-error data-[valid]:text-cl-success`; a plain
               colour token drops both variants and then only the last one survives,
               which is how every error message on this page rendered green. */
            message: "text-xs mt-1.5 flex items-center gap-1.5",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }), control: wrapperFor(bioBad, bioOk) }
        }
        className="flex flex-col"
      />
    </div>
  );
}
