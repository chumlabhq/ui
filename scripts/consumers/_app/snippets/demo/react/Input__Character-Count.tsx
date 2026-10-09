import { useState } from "react";
import { Input } from "@chumlab/ui/input";

const wrapperFor = (err: boolean, ok: boolean) =>
    err ? "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-error shadow-sm shadow-danger/0.04 focus-within:ring-2 focus-within:ring-cl-error/15" : ok ? "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-success shadow-sm shadow-success/0.04 focus-within:ring-2 focus-within:ring-cl-success/15" : "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus";

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

export default function InputExample() {
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const userOk = username.length >= 3;
  const userBad = username.length > 0 && username.length < 3;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-2xl">
      <Input
        label="Bio"
        placeholder="Tell us about yourself..."
        maxLength={100}
        showCount
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        classes={
          {
            root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
            input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            prefix: "text-sm select-none text-cl-text-tertiary",
            suffix: "text-sm select-none text-cl-text-tertiary",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }
        }
      />
      <Input
        label="Username"
        placeholder="max 20 chars"
        maxLength={20}
        showCount
        clearable
        onClear={() => setUsername("")}
        prefix="@"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        success={userOk}
        successMessage={
          <>
            <CheckIcon />
            Username available
          </>
        }
        error={userBad}
        errorMessage="Minimum 3 characters"
        classes={
          { ...({
            root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
            input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            prefix: "text-sm select-none text-cl-text-tertiary",
            suffix: "text-sm select-none text-cl-text-tertiary",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }), control: wrapperFor(userBad, userOk) }
        }
      />
    </div>
  );
}
