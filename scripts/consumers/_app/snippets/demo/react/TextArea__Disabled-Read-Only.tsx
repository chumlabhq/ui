import { TextArea } from "@chumlab/ui/textarea";

const LockIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function TextAreaExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
      <TextArea
        label="Description"
        value="Cannot edit this content"
        disabled
        startIcon={<LockIcon className="text-cl-text-secondary" />}
        classes={
          {
                          ...({
            control: "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus",
            input: "w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-tertiary",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            /* No colour here on purpose. The library paints this slot
               `data-[invalid]:text-cl-error data-[valid]:text-cl-success`; a plain
               colour token drops both variants and then only the last one survives,
               which is how every error message on this page rendered green. */
            message: "text-xs mt-1.5 flex items-center gap-1.5",
            count: "text-[11px] mt-1 text-end tabular-nums text-cl-text-tertiary"
          }),
                          input: "w-full bg-transparent outline-none text-sm resize-none cursor-not-allowed text-cl-text-tertiary placeholder:text-cl-text-tertiary",
                          control: "rounded-cl-lg border gap-2.5 opacity-50 cursor-not-allowed border-cl-border bg-cl-bg-hover"
                        }
        }
        className="flex flex-col"
      />
      <TextArea
        label="Notes"
        placeholder="Disabled placeholder"
        disabled
        classes={
          {
                          ...({
            control: "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus",
            input: "w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-tertiary",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            /* No colour here on purpose. The library paints this slot
               `data-[invalid]:text-cl-error data-[valid]:text-cl-success`; a plain
               colour token drops both variants and then only the last one survives,
               which is how every error message on this page rendered green. */
            message: "text-xs mt-1.5 flex items-center gap-1.5",
            count: "text-[11px] mt-1 text-end tabular-nums text-cl-text-tertiary"
          }),
                          input: "w-full bg-transparent outline-none text-sm resize-none cursor-not-allowed text-cl-text-tertiary placeholder:text-cl-text-tertiary",
                          control: "rounded-cl-lg border gap-2.5 opacity-50 cursor-not-allowed border-cl-border bg-cl-bg-hover"
                        }
        }
        className="flex flex-col"
      />
      <TextArea
        label="Terms"
        value="This content can be selected and copied but not edited."
        readOnly
        classes={
          {
                          ...({
            control: "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus",
            input: "w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-tertiary",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            /* No colour here on purpose. The library paints this slot
               `data-[invalid]:text-cl-error data-[valid]:text-cl-success`; a plain
               colour token drops both variants and then only the last one survives,
               which is how every error message on this page rendered green. */
            message: "text-xs mt-1.5 flex items-center gap-1.5",
            count: "text-[11px] mt-1 text-end tabular-nums text-cl-text-tertiary"
          }),
                          control: `${"rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus"} cursor-default`
                        }
        }
        className="flex flex-col"
      />
    </div>
  );
}
