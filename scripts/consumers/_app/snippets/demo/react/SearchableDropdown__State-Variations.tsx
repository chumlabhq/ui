import { SearchableDropdown, SearchableDropdownOption } from "@chumlab/ui/searchable-dropdown";

const fruitOptions: SearchableDropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
];

export default function SearchableDropdownExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <SearchableDropdown
          label="Fruit"
          options={fruitOptions}
          placeholder="Search fruits..."
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
      <div>
        <SearchableDropdown
          label="Fruit"
          options={fruitOptions}
          defaultValue="banana"
          placeholder="Search fruits..."
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
      <div>
        <SearchableDropdown
          label="Fruit"
          options={fruitOptions}
          defaultValue="cherry"
          disabled
          placeholder="Search fruits..."
          classes={
            {
                            ...({
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
              searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-recessed",
              searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }),
                            trigger: `${"flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent"} opacity-50 cursor-not-allowed`
                          }
          }
        />
      </div>
      <div>
        <SearchableDropdown
          label="Fruit"
          options={fruitOptions}
          placeholder="Search fruits..."
          error
          errorMessage="This field is required"
          classes={
            {
                             ...({
               trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent",
               content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
               searchInput: "flex items-center gap-2 px-3 py-2 border-b border-cl-border bg-cl-bg-recessed",
               searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
               label: "block text-sm font-medium mb-1 text-cl-text-secondary"
             }),
            trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-start rounded-cl-md transition-colors border border-cl-error bg-cl-bg-panel text-cl-text hover:border-cl-error focus:outline-none focus:ring-2 focus:ring-cl-error"
                           }
          }
        />
      </div>
      <div>
        <SearchableDropdown
          label="Fruit"
          options={[]}
          placeholder="Loading..."
          loading={true}
          shimmerCount={4}
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
      <div>
        <SearchableDropdown
          label="Fruit"
          options={fruitOptions}
          defaultValue="grape"
          clearable
          placeholder="Search fruits..."
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
