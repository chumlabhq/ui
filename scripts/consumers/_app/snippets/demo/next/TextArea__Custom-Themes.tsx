import { TextArea } from "@chumlab/ui/textarea";

export default function TextAreaExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
      <div className="space-y-1.5">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Underline
        </span>
        <TextArea
          aria-label="Underline theme"
          placeholder="Enter text..."
          rows={3}
          classes={
            {
                              ...({
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
            }),
                              control: "px-0 gap-2.5 transition-all duration-150 rounded-none border-0 border-b-2 bg-transparent border-cl-border focus-within:ring-0 focus-within:border-cl-border-input-focus dark:border-cl-text/10 dark:focus-within:border-cl-border-input-focus"
                            }
          }
        />
      </div>
      <div className="space-y-1.5">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Blue accent
        </span>
        <TextArea
          aria-label="Blue accent theme"
          placeholder="Blue accent theme..."
          rows={3}
          classes={
            {
                              ...({
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
            }),
                              control: "rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-border-input-focus bg-cl-accent/[0.08] shadow-sm focus-within:ring-2 focus-within:ring-cl-accent/15 dark:border dark:border-cl-border-input-focus/30 dark:bg-cl-accent/[0.10] dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/25"
                            }
          }
        />
      </div>
    </div>
  );
}
