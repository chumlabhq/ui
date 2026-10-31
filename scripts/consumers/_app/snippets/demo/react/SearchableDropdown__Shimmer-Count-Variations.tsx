import { SearchableDropdown } from "@chumlab/ui/searchable-dropdown";

export default function SearchableDropdownExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <div className="w-full sm:max-w-64">
        <p id="searchable-dropdown-shimmer-3">3 shimmer items</p>
        <SearchableDropdown
          aria-labelledby="searchable-dropdown-shimmer-3"
          options={[]}
          placeholder="Loading..."
          loading={true}
          shimmerCount={3}
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
              searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-recessed",
              searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }
          }
        />
      </div>
      <div className="w-full sm:max-w-64">
        <p id="searchable-dropdown-shimmer-8">8 shimmer items</p>
        <SearchableDropdown
          aria-labelledby="searchable-dropdown-shimmer-8"
          options={[]}
          placeholder="Loading..."
          loading={true}
          shimmerCount={8}
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
              searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-recessed",
              searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }
          }
        />
      </div>
    </div>
  );
}
