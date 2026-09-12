import { useRef } from "react";
import { TextArea } from "@chumlab/ui/textarea";

export default function TextAreaExample() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="space-y-4 w-full max-w-md">
      <TextArea
        ref={textAreaRef}
        aria-label="Ref demo"
        placeholder="Click buttons below"
        classes={
          {
            control: "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50",
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
            <button
              key={lbl}
              onClick={
                () => {
                  if (lbl === "Focus") textAreaRef.current?.focus();
                  else if (lbl === "Select All") {
                    textAreaRef.current?.focus();
                    textAreaRef.current?.select();
                  } else if (lbl === "Get Value")
                    alert(`"${textAreaRef.current?.value}"`);
                }
              }
              className="px-3 py-1.5 text-[11px] font-medium rounded-cl-md transition-colors bg-cl-bg-hover text-cl-text-tertiary hover:bg-cl-bg-hover ring-1 ring-inset ring-border-soft dark:bg-cl-text/4 dark:text-cl-text-tertiary dark:hover:bg-cl-text/8 dark:ring-1 dark:ring-inset dark:ring-cl-text/6 cursor-pointer"
            >
              {lbl}
            </button>
          ))
        }
      </div>
    </div>
  );
}
