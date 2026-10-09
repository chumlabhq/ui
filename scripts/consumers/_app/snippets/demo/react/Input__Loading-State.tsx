import { Input } from "@chumlab/ui/input";

const SearchIcon = ({ className = "" }: { className?: string }) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function InputExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full">
      <div className="space-y-1.5">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Default
        </span>
        <Input
          aria-label="Loading"
          placeholder="Loading..."
          loading
          classes={
            {
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
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
      <div className="space-y-1.5">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          With icon
        </span>
        <Input
          aria-label="Searching"
          placeholder="Searching..."
          loading
          startIcon={<SearchIcon className="text-cl-text-tertiary" />}
          classes={
            {
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
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
      <div className="space-y-1.5">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Custom loader
        </span>
        <Input
          aria-label="Validating"
          placeholder="Validating..."
          loading
          loader={
            <span className="text-[11px] font-medium animate-pulse text-cl-accent">
              Checking...
            </span>
          }
          classes={
            {
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
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
      <div className="space-y-1.5">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Custom loader size
        </span>
        <Input
          aria-label="Custom loader size"
          placeholder="Loading..."
          loading
          loaderSize={24}
          classes={
            {
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
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
    </div>
  );
}
