"use client";

import { useState } from "react";
import { Input } from "@chumlab/ui/input";

export default function InputExample() {
  const [callbackValue, setCallbackValue] = useState("");
  return (
    <div className="w-full sm:max-w-sm space-y-3">
      <Input
        label="Name"
        placeholder="Watch the value below..."
        value={callbackValue}
        onValueChange={setCallbackValue}
        clearable
        onClear={() => setCallbackValue("")}
        classes={
          {
            root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
            input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            prefix: "text-sm select-none text-cl-text-tertiary",
            suffix: "text-sm select-none text-cl-text-tertiary",
            count: "text-[11px] mt-1 text-end tabular-nums text-cl-text-tertiary"
          }
        }
      />
      <div
        className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        value:
        {JSON.stringify(callbackValue)}
      </div>
    </div>
  );
}
