"use client";

import { useRef } from "react";
import { Input } from "@chumlab/ui/input";

export default function InputExample() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-4 w-full sm:max-w-sm">
      <Input
        ref={inputRef}
        aria-label="Ref demo"
        placeholder="Click buttons below"
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
      <div className="flex gap-2 flex-wrap">
        {
          (["Focus", "Select All", "Get Value"] as const).map((lbl) => (
            <button
              key={lbl}
              onClick={
                () => {
                  if (lbl === "Focus") inputRef.current?.focus();
                  else if (lbl === "Select All") {
                    inputRef.current?.focus();
                    inputRef.current?.select();
                  } else if (lbl === "Get Value")
                    alert(`"${inputRef.current?.value}"`);
                }
              }
              className="px-3 py-1.5 text-[11px] font-medium rounded-cl-md transition-colors bg-cl-bg-hover text-cl-text-tertiary hover:bg-cl-bg-hover ring-1 ring-inset ring-border-soft dark:bg-cl-text/4 dark:text-cl-text-tertiary dark:hover:bg-cl-text/8 dark:ring-1 dark:ring-inset dark:ring-cl-text/6"
            >
              {lbl}
            </button>
          ))
        }
      </div>
    </div>
  );
}
