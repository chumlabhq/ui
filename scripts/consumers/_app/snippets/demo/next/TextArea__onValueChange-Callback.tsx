"use client";

import { useState } from "react";
import { TextArea } from "@chumlab/ui/textarea";

export default function TextAreaExample() {
  const [feedback, setFeedback] = useState("");
  return (
    <div className="w-full max-w-md space-y-3">
      <TextArea
        label="Type anything"
        placeholder="Watch the value below..."
        value={feedback}
        onValueChange={setFeedback}
        clearable
        onClear={() => setFeedback("")}
        classes={
          {
            control: "px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50",
            input: "w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-disabled",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            message: "text-xs mt-1.5 flex items-center gap-1.5 text-cl-error text-cl-success",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }
        }
        className="flex flex-col"
      />
      <div
        className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
      >
        value:
        {JSON.stringify(feedback)}
      </div>
    </div>
  );
}
