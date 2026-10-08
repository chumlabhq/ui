import { useState } from "react";
import { TextArea } from "@chumlab/ui/textarea";

export default function TextAreaExample() {
  const [notes, setNotes] = useState("");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
      <TextArea
        label="Controlled"
        placeholder="Type something..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        clearable
        onClear={() => setNotes("")}
        classes={
          {
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
          }
        }
        className="flex flex-col"
      />
      <TextArea
        label="Uncontrolled"
        placeholder="Type and clear..."
        clearable
        defaultValue=""
        classes={
          {
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
          }
        }
        className="flex flex-col"
      />
    </div>
  );
}
