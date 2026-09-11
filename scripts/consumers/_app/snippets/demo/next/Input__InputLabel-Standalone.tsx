import { InputLabel } from "@chumlab/ui/input";

export default function InputExample() {
  return (
    <div className="space-y-4 w-full sm:max-w-sm">
      <div>
        <InputLabel
          label="Custom Layout"
          htmlFor="custom-input"
          className="text-[13px] font-medium mb-1.5 block text-cl-text-secondary"
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
          className="text-[13px] font-medium mb-1.5 block text-cl-text-secondary"
        />
        <p className="text-xs text-cl-text-tertiary">
          Required indicator (*) is automatically added
        </p>
      </div>
    </div>
  );
}
