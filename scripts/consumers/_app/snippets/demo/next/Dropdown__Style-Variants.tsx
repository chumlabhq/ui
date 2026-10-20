import { Dropdown, DropdownOption } from "@chumlab/ui/dropdown";

const fruitOptions: DropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

export default function DropdownExample() {
  return (
    <>
      <div className="w-full sm:max-w-64">
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Default (bordered)</p>
        <Dropdown
          label="Fruit"
          options={fruitOptions}
          placeholder="Select..."
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
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Borderless</p>
        <Dropdown
          label="Fruit"
          options={fruitOptions}
          placeholder="Select..."
          classes={
            {
                          ...({
              root: "w-full",
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }),
                          trigger: "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md border-0 transition-colors cursor-pointer bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover",
                          value: "flex-1 text-left truncate"
                        }
          }
        />
      </div>
      <div className="w-full sm:max-w-64">
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Bottom border only</p>
        <Dropdown
          label="Fruit"
          options={fruitOptions}
          placeholder="Select..."
          classes={
            {
                          ...({
              root: "w-full",
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }),
                          trigger: "flex items-center gap-2 w-full px-1 py-2 text-sm border-0 border-b-2 rounded-none transition-colors cursor-pointer border-cl-border text-cl-text hover:border-cl-border-input-focus focus-within:border-cl-border-input-focus",
                          value: "flex-1 text-left truncate"
                        }
          }
        />
      </div>
      <div className="w-full sm:max-w-64">
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Ghost</p>
        <Dropdown
          label="Fruit"
          options={fruitOptions}
          placeholder="Select..."
          classes={
            {
                          ...({
              root: "w-full",
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }),
                          trigger: "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md border-0 bg-transparent transition-colors cursor-pointer text-cl-text-secondary hover:bg-cl-bg-hover",
                          value: "flex-1 text-left truncate"
                        }
          }
        />
      </div>
      <div className="w-full sm:max-w-64">
        <p className="mb-2 text-xs font-medium text-cl-text-tertiary">Pill</p>
        <Dropdown
          label="Fruit"
          options={fruitOptions}
          placeholder="Select..."
          fullWidth
          classes={
            {
                           ...({
               root: "w-full",
               trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
               content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
               label: "block text-sm font-medium mb-1 text-cl-text-secondary"
             }),
            trigger: "flex items-center justify-between gap-2 w-full px-4 py-2 text-sm rounded-full transition-colors cursor-pointer border border-cl-border bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover shadow-sm",
                           value: "flex-1 text-left truncate"
                         }
          }
        />
      </div>
    </>
  );
}
