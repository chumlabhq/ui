import { Dropdown } from "@chumlab/ui/dropdown";

export default function DropdownExample() {
  return (
    <div className="w-full flex flex-wrap gap-8">
      <div className="w-full sm:max-w-64">
        <p id="dropdown-shimmer-3">3 shimmer items</p>
        <Dropdown
          aria-labelledby="dropdown-shimmer-3"
          options={[]}
          placeholder="Loading..."
          loading={true}
          shimmerCount={3}
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
        <p id="dropdown-shimmer-8">8 shimmer items</p>
        <Dropdown
          aria-labelledby="dropdown-shimmer-8"
          options={[]}
          placeholder="Loading..."
          loading={true}
          shimmerCount={8}
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
