import { Dropdown } from "@chumlab/ui/dropdown";

export default function DropdownExample() {
  return (
    <div className="w-full flex flex-wrap gap-8">
      <div className="w-full sm:max-w-64">
        <p id="dropdown-empty-default">Default text</p>
        <Dropdown
          aria-labelledby="dropdown-empty-default"
          options={[]}
          placeholder="No options..."
          classes={
            {
              root: "w-full",
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }
          }
        />
      </div>
      <div className="w-full sm:max-w-64">
        <p id="dropdown-empty-custom">Custom ReactNode</p>
        <Dropdown
          aria-labelledby="dropdown-empty-custom"
          options={[]}
          placeholder="Custom empty..."
          emptyContent={
            <span className="flex flex-col items-center gap-1 py-2">
              <span className="text-lg text-cl-text-tertiary">🔍</span>
              <span className="text-sm text-cl-text-secondary">Nothing here yet</span>
            </span>
          }
          classes={
            {
              root: "w-full",
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }
          }
        />
      </div>
    </div>
  );
}
