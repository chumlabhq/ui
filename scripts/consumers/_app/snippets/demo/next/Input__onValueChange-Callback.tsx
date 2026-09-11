"use client";

import { useState } from "react";
import { Input } from "@chumlab/ui/input";

export default function InputExample() {
  const [search22, setSearch22] = useState("");
  const [search, setSearch] = useState("");
  return (
    <div className="w-full sm:max-w-sm space-y-3">
      <Input
        label="Type anything"
        placeholder="Watch the value below..."
        value={search22}
        onValueChange={setSearch22}
        clearable
        onClear={() => setSearch22("")}
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
      <div
        className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
      >
        value:
        {JSON.stringify(search)}
      </div>
    </div>
  );
}
