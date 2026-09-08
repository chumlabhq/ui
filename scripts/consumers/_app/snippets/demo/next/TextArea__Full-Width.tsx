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
                    label="Full width with all features"
                    placeholder="Enter your message..."
                    fullWidth
                    clearable
                    maxLength={500}
                    showCount
                    startIcon={<MessageIcon className={"text-cl-text-tertiary"} />}
                    classes={({
        control: `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text border-cl-border bg-white shadow-sm shadow-black/[0.04] focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:text-cl-text-secondary dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
        input: `w-full bg-transparent outline-none text-sm resize-y text-cl-text placeholder:text-cl-text-disabled`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        message: "text-xs mt-1.5 flex items-center gap-1.5 text-cl-error text-cl-success",
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                    className={"flex flex-col"}
                  />
                </div>
  );
}
