"use client";

import { useRef, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { TextArea } from "@chumlab/ui/textarea";

export default function TextAreaExample() {
  const [refReadValue, setRefReadValue] = useState("not fired yet");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="space-y-4 w-full max-w-md">
      <TextArea
        ref={textAreaRef}
        aria-label="Ref demo"
        placeholder="Click buttons below"
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
      />
      <div className="flex gap-2 flex-wrap">
        {
          (["Focus", "Select All", "Get Value"] as const).map((lbl) => (
            <Button
              key={lbl}
              size="sm"
              onClick={
                () => {
                  if (lbl === "Focus") textAreaRef.current?.focus();
                  else if (lbl === "Select All") {
                    textAreaRef.current?.focus();
                    textAreaRef.current?.select();
                  } else if (lbl === "Get Value")
                    setRefReadValue(JSON.stringify(textAreaRef.current?.value));
                }
              }
              className="rounded-cl-md bg-cl-text/4 text-cl-text-tertiary hover:bg-cl-bg-hover ring-1 ring-inset ring-border-soft dark:hover:bg-cl-text/8 dark:ring-1 dark:ring-inset dark:ring-cl-text/6"
            >
              {lbl}
            </Button>
          ))
        }
      </div>
      <div
        className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        ref.current.value:
        {refReadValue}
      </div>
    </div>
  );
}
