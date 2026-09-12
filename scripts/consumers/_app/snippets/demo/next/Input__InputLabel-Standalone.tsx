import { InputLabel } from "@chumlab/ui/input";

export default function InputExample() {
  return (
    <div className="space-y-4 w-full sm:max-w-md">
      <div className="flex items-center gap-3">
        <InputLabel
          label="Custom Layout"
          htmlFor="custom-input"
          className="text-[13px] font-medium mb-1.5 block text-cl-text-secondary mb-0 shrink-0 w-32"
        />
        <input
          id="custom-input"
          type="text"
          placeholder="Label sits beside this field"
          className="w-full px-3.5 py-2.5 rounded-cl-lg border outline-none text-sm transition-all duration-150 bg-cl-bg-input border-cl-border text-cl-text placeholder:text-cl-text-tertiary shadow-sm focus:ring-2 focus:ring-cl-accent/15 focus:border-cl-border-input-focus"
        />
      </div>
      <div className="flex items-center gap-3">
        <InputLabel
          label="Required Field"
          htmlFor="req"
          required
          className="text-[13px] font-medium mb-1.5 block text-cl-text-secondary mb-0 shrink-0 w-32"
        />
        <input
          id="req"
          type="text"
          required
          placeholder="The * comes from `required`"
          className="w-full px-3.5 py-2.5 rounded-cl-lg border outline-none text-sm transition-all duration-150 bg-cl-bg-input border-cl-border text-cl-text placeholder:text-cl-text-tertiary shadow-sm focus:ring-2 focus:ring-cl-accent/15 focus:border-cl-border-input-focus"
        />
      </div>
    </div>
  );
}
