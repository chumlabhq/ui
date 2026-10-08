import { MultiSelectDropdown } from "@chumlab/ui/multi-select-dropdown";

export default function MultiSelectDropdownExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <div className="w-full sm:max-w-72">
        <MultiSelectDropdown
          options={[]}
          value={[]}
          onValueChange={() => {}}
          placeholder="Loading..."
          loading
          shimmerCount={3}
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border dark:border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }
          }
        />
      </div>
      <div className="w-full sm:max-w-72">
        <MultiSelectDropdown
          options={[]}
          value={[]}
          onValueChange={() => {}}
          placeholder="Loading..."
          loading
          shimmerCount={8}
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border dark:border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary",
              description: "text-xs mb-1 text-cl-text-secondary",
              chip: "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-text dark:bg-cl-text/10",
              chipRemove: "w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary"
            }
          }
        />
      </div>
    </div>
  );
}
