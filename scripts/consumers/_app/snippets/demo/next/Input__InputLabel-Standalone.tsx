import { InputLabel } from "@chumlab/ui/input";

export default function InputExample() {
  return (
    <div className="space-y-4 w-full sm:max-w-sm">
      <div>
        <InputLabel
          label="Custom Layout"
          htmlFor="custom-input"
          className={
            ({
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
              input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
              prefix: "text-sm select-none text-cl-text-tertiary",
              suffix: "text-sm select-none text-cl-text-tertiary",
              count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
            }).label
          }
        />
        <input
          id="custom-input"
          type="text"
          placeholder="Native input with InputLabel"
          className="w-full px-3.5 py-2.5 rounded-cl-lg border outline-none text-sm transition-all duration-150 bg-white border-cl-border text-cl-text placeholder:text-cl-text-tertiary shadow-sm focus:ring-2 focus:ring-cl-accent/15 focus:border-cl-border-input-focus dark:bg-cl-text/4 dark:border dark:border-cl-text/10 dark:text-white dark:placeholder:text-cl-text-tertiary dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50"
        />
      </div>
      <div>
        <InputLabel
          label="Required Field"
          htmlFor="req"
          required
          className={
            ({
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
              input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
              prefix: "text-sm select-none text-cl-text-tertiary",
              suffix: "text-sm select-none text-cl-text-tertiary",
              count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
            }).label
          }
        />
        <p className="text-xs text-cl-text-tertiary">
          Required indicator (*) is automatically added
        </p>
      </div>
    </div>
  );
}
