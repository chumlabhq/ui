import { TextAreaLabel } from "@chumlab/ui/textarea";

export default function TextAreaExample() {
  return (
    <div className="space-y-4 w-full max-w-xl">
      <div className="flex items-start gap-3">
        <TextAreaLabel
          label="Notes"
          htmlFor="custom-ta"
          className="text-[13px] font-medium mb-1.5 block text-cl-text-secondary mb-0 mt-2 shrink-0 w-32"
        />
        <textarea
          id="custom-ta"
          placeholder="Label sits beside this field"
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-cl-lg border outline-none text-sm resize-y transition-all duration-150 bg-cl-bg-input border-cl-border text-cl-text placeholder:text-cl-text-tertiary shadow-sm focus:ring-2 focus:ring-cl-accent/15 focus:border-cl-border-input-focus"
        />
      </div>
      <div className="flex items-start gap-3">
        <TextAreaLabel
          label="Reason"
          htmlFor="req-ta"
          required
          className="text-[13px] font-medium mb-1.5 block text-cl-text-secondary mb-0 mt-2 shrink-0 w-32"
        />
        <textarea
          id="req-ta"
          required
          rows={3}
          placeholder="The * comes from `required`"
          className="w-full px-3.5 py-2.5 rounded-cl-lg border outline-none text-sm resize-y transition-all duration-150 bg-cl-bg-input border-cl-border text-cl-text placeholder:text-cl-text-tertiary shadow-sm focus:ring-2 focus:ring-cl-accent/15 focus:border-cl-border-input-focus"
        />
      </div>
    </div>
  );
}
