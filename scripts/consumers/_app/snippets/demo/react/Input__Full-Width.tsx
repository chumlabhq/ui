import { Input } from "@chumlab/ui/input";

const MailIcon = ({ className = "" }: { className?: string }) => (
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
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function InputExample() {
  return (
    <div className="w-full space-y-4">
      <Input
        aria-label="Full width"
        placeholder="Full width input"
        fullWidth
        classes={
          {
            root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
            input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            prefix: "text-sm select-none text-cl-text-tertiary",
            suffix: "text-sm select-none text-cl-text-tertiary",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }
        }
      />
      <Input
        label="Full width, all features"
        placeholder="Enter your message..."
        fullWidth
        startIcon={<MailIcon className="text-cl-text-tertiary" />}
        clearable
        maxLength={200}
        showCount
        classes={
          {
            root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
            input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
            label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
            description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
            prefix: "text-sm select-none text-cl-text-tertiary",
            suffix: "text-sm select-none text-cl-text-tertiary",
            count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
          }
        }
      />
    </div>
  );
}
