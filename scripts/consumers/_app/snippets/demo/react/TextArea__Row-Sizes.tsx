import { TextArea } from "@chumlab/ui/textarea";

export default function TextAreaExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
      {
        (
          [
            ["2 rows", 2],
            ["4 rows (default)", 4],
            ["8 rows", 8]
          ] as const
        ).map(([lbl, r]) => (
          <div key={String(lbl)} className="space-y-1.5">
            <span
              className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
            >
              {lbl}
            </span>
            <TextArea
              aria-label={String(lbl)}
              placeholder="Resizable..."
              rows={r as number}
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
          </div>
        ))
      }
    </div>
  );
}
