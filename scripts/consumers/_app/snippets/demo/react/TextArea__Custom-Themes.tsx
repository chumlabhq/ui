import { TextArea } from "@chumlab/ui/textarea";

export default function TextAreaExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <div className="space-y-1.5">
                    <span className={"text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled"}>Underline</span>
                    <TextArea
                      aria-label="Underline theme"
                      placeholder="Enter text..."
                      rows={3}
                      classes={{
                        ...({
        control: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
        input: `w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-disabled`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        message: "text-xs mt-1.5 flex items-center gap-1.5 text-cl-error text-cl-success",
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      }),
                        control: `px-0.5 py-2.5 border-b-2 gap-2.5 transition-all duration-150 border border-cl-border focus-within:border-cl-border-input-focus dark:border dark:border-cl-text/10 dark:focus-within:border-cl-border-input-focus`
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className={"text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled"}>Blue accent</span>
                    <TextArea
                      aria-label="Blue accent theme"
                      placeholder="Blue accent theme..."
                      rows={3}
                      classes={{
                        ...({
        control: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
        input: `w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-disabled`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        message: "text-xs mt-1.5 flex items-center gap-1.5 text-cl-error text-cl-success",
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      }),
                        control: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-border-input-focus bg-cl-accent/[0.08] shadow-sm focus-within:ring-2 focus-within:ring-cl-accent/15 dark:border dark:border-cl-border-input-focus/30 dark:bg-cl-accent/[0.10] dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/25`
                      }}
                    />
                  </div>
                </div>
  );
}
