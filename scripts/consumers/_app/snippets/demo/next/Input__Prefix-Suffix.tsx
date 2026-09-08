"use client";

import { useState } from "react";
import { Input } from "@chumlab/ui/input";

export default function InputExample() {
  const [amount, setAmount] = useState("");
  const [url, setUrl] = useState("");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-2xl">
                  <Input
                    label="Price"
                    placeholder="0.00"
                    type="number"
                    prefix="$"
                    suffix="USD"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    classes={({
        root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
        input: `w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        prefix: `text-sm select-none text-cl-text-tertiary`,
        suffix: `text-sm select-none text-cl-text-tertiary`,
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                  />
                  <Input
                    label="Website"
                    placeholder="yoursite"
                    prefix="https://"
                    suffix=".com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    classes={({
        root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
        input: `w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        prefix: `text-sm select-none text-cl-text-tertiary`,
        suffix: `text-sm select-none text-cl-text-tertiary`,
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                  />
                  <Input
                    label="Weight"
                    placeholder="0"
                    type="number"
                    suffix="kg"
                    classes={({
        root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
        input: `w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        prefix: `text-sm select-none text-cl-text-tertiary`,
        suffix: `text-sm select-none text-cl-text-tertiary`,
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                  />
                  <Input
                    label="Twitter handle"
                    placeholder="username"
                    prefix="@"
                    classes={({
        root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
        input: `w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        prefix: `text-sm select-none text-cl-text-tertiary`,
        suffix: `text-sm select-none text-cl-text-tertiary`,
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                  />
                </div>
  );
}
