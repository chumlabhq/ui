import { TextAreaLabel } from "@chumlab/ui/textarea";

export default function TextAreaExample() {
  return (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <TextAreaLabel
          label="Custom Layout"
          htmlFor="custom-ta"
          className="text-[13px] font-medium mb-1.5 block text-cl-text-secondary"
        />
        <textarea
          id="custom-ta"
          placeholder="Native textarea with TextAreaLabel"
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-cl-lg border outline-none text-sm resize-y transition-all duration-150 bg-white border-cl-border text-cl-text placeholder:text-cl-text-tertiary shadow-sm focus:ring-2 focus:ring-cl-accent/15 focus:border-cl-border-input-focus dark:bg-cl-text/4 dark:border dark:border-cl-text/10 dark:text-white dark:placeholder:text-cl-text-tertiary dark:focus:ring-2 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/50"
        />
      </div>
      <div>
        <TextAreaLabel
          label="Required Field"
          htmlFor="req-ta"
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
