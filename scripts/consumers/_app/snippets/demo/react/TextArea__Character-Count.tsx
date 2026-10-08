import { useState } from "react";
import { TextArea } from "@chumlab/ui/textarea";

const wrapperFor = (err: boolean, ok: boolean) =>
    err ? "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-error shadow-sm shadow-danger/0.04 focus-within:ring-2 focus-within:ring-cl-error/15 dark:border dark:border-cl-error/40 dark:focus-within:ring-2 dark:focus-within:ring-cl-error/25" : ok ? "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-success shadow-sm shadow-success/0.04 focus-within:ring-2 focus-within:ring-cl-success/15 dark:border dark:border-cl-success/40 dark:focus-within:ring-2 dark:focus-within:ring-cl-success/25" : "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:border dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50";

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

export default function TextAreaExample() {
  const [bio, setBio] = useState("");
  const [notes2, setNotes2] = useState("");
  const bioOk = bio.length >= 10;
  const bioBad = bio.length > 0 && bio.length < 10;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
      <TextArea
        label="Bio"
        placeholder="Tell us about yourself..."
        maxLength={200}
        showCount
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        success={bioOk}
        successMessage={
          <>
            <CheckIcon />
            Looks great!
          </>
        }
        error={bioBad}
        errorMessage="At least 10 characters required"
        classes={
          { ...({
            control: "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:border dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50",
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
      <TextArea
        label="Notes"
        placeholder="Quick notes..."
        maxLength={100}
        showCount
        clearable
        value={notes2}
        onChange={(e) => setNotes2(e.target.value)}
        onClear={() => setNotes2("")}
        classes={
          {
            control: "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:border dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50",
            input: "w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-tertiary",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            /* No colour here on purpose. The library paints this slot
               `data-[invalid]:text-cl-error data-[valid]:text-cl-success`; a plain
               colour token drops both variants and then only the last one survives,
               which is how every error message on this page rendered green. */
            message: "text-xs mt-1.5 flex items-center gap-1.5",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }
        }
        className="flex flex-col"
      />
    </div>
  );
}
