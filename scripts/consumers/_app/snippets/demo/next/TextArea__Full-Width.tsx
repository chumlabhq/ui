import { TextArea } from "@chumlab/ui/textarea";

const MessageIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function TextAreaExample() {
  return (
    <div className="w-full space-y-4">
      <TextArea
        label="Message"
        placeholder="Enter your message..."
        fullWidth
        clearable
        maxLength={500}
        showCount
        startIcon={<MessageIcon className="text-cl-text-tertiary" />}
        classes={
          {
            control: "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-text/10 bg-cl-bg-input shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent-halo focus-within:border-cl-border-input-focus",
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
        className="flex flex-col"
      />
    </div>
  );
}
