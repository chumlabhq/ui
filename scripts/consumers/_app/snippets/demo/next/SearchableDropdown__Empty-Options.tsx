import { SearchableDropdown } from "@chumlab/ui/searchable-dropdown";

export default function SearchableDropdownExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <div className="w-full sm:max-w-64">
        <p id="searchable-dropdown-empty-default">Default text</p>
        <SearchableDropdown
          aria-labelledby="searchable-dropdown-empty-default"
          options={[]}
          placeholder="No options..."
          classes={
            {
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
              searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-recessed",
              searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }
          }
        />
      </div>
      <div className="w-full sm:max-w-64">
        <p id="searchable-dropdown-empty-custom">Custom ReactNode</p>
        <SearchableDropdown
          aria-labelledby="searchable-dropdown-empty-custom"
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
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
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
