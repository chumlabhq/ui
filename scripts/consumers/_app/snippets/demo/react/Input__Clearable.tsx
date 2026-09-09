import { useState } from "react";
import { Input } from "@chumlab/ui/input";

const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function InputExample() {
  const [search, setSearch] = useState("");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-2xl">
      <Input
        label="Controlled"
        placeholder="Type something..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        clearable
        onClear={() => setSearch("")}
        startIcon={<SearchIcon className="text-cl-text-tertiary" />}
        classes={
          {
            root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
            input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            prefix: "text-sm select-none text-cl-text-tertiary",
            suffix: "text-sm select-none text-cl-text-tertiary",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }
        }
      />
      <Input
        label="Uncontrolled"
        placeholder="Type and clear..."
        clearable
        defaultValue=""
        classes={
          {
            root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
            input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            prefix: "text-sm select-none text-cl-text-tertiary",
            suffix: "text-sm select-none text-cl-text-tertiary",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }
        }
      />
    </div>
  );
}
