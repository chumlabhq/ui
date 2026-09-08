import { Input } from "@chumlab/ui/input";

export default function InputExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                  <div className="space-y-1.5">
                    <span className={"text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled"}>Small</span>
                    <Input
                      aria-label="Small"
                      placeholder="Small size"
                      size="sm"
                      classes={({
        root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
        input: `w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        prefix: `text-sm select-none text-cl-text-tertiary`,
        suffix: `text-sm select-none text-cl-text-tertiary`,
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className={"text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled"}>Medium (default)</span>
                    <Input
                      aria-label="Medium"
                      placeholder="Medium size"
                      size="md"
                      classes={({
        root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
        input: `w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        prefix: `text-sm select-none text-cl-text-tertiary`,
        suffix: `text-sm select-none text-cl-text-tertiary`,
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className={"text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled"}>Large</span>
                    <Input
                      aria-label="Large"
                      placeholder="Large size"
                      size="lg"
                      classes={({
        root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
        input: `w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        prefix: `text-sm select-none text-cl-text-tertiary`,
        suffix: `text-sm select-none text-cl-text-tertiary`,
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      })}
                    />
                  </div>
                </div>
  );
}
