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
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Default (bordered)</p>
                  <Dropdown
                    options={fruitOptions}
                    placeholder="Select..."
                    classes={({
          root: "w-full",
          trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
          content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          label: `block text-sm font-medium mb-1 text-cl-text-secondary`
        })}
                  />
                </div>
      <div className="w-full sm:max-w-64">
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Borderless</p>
                  <Dropdown
                    options={fruitOptions}
                    placeholder="Select..."
                    classes={{
                      ...({
          root: "w-full",
          trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
          content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          label: `block text-sm font-medium mb-1 text-cl-text-secondary`
        }),
                      trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover dark:bg-cl-bg-hover dark:text-cl-text dark:hover:bg-cl-bg-hover`,
                      value: "flex-1 text-left truncate"
                    }}
                  />
                </div>
      <div className="w-full sm:max-w-64">
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Bottom border only</p>
                  <Dropdown
                    options={fruitOptions}
                    placeholder="Select..."
                    classes={{
                      ...({
          root: "w-full",
          trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
          content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          label: `block text-sm font-medium mb-1 text-cl-text-secondary`
        }),
                      trigger: `flex items-center gap-2 w-full px-1 py-2 text-sm border-b-2 rounded-none transition-colors cursor-pointer border border-cl-border text-cl-text hover:border-cl-border-input-focus focus-within:border-cl-border-input-focus dark:border dark:border-cl-border dark:text-cl-text dark:hover:border-cl-border-input-focus dark:focus-within:border-cl-border-input-focus`,
                      value: "flex-1 text-left truncate"
                    }}
                  />
                </div>
      <div className="w-full sm:max-w-64">
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Ghost</p>
                  <Dropdown
                    options={fruitOptions}
                    placeholder="Select..."
                    classes={{
                      ...({
          root: "w-full",
          trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
          content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          label: `block text-sm font-medium mb-1 text-cl-text-secondary`
        }),
                      trigger: `flex items-center gap-2 w-full px-3 py-2 text-sm rounded-cl-md transition-colors cursor-pointer text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-text/60`,
                      value: "flex-1 text-left truncate"
                    }}
                  />
                </div>
      <div className="w-full sm:max-w-64">
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Pill</p>
                  <Dropdown
                    options={fruitOptions}
                    placeholder="Select..."
                    fullWidth
                    classes={{
                      ...({
          root: "w-full",
          trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
          content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
          label: `block text-sm font-medium mb-1 text-cl-text-secondary`
        }),
       trigger: `flex items-center justify-between gap-2 w-full px-4 py-2 text-sm rounded-full transition-colors cursor-pointer border border-cl-border bg-white text-cl-text hover:border-cl-border-input shadow-sm dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:border-cl-border`,
                      value: "flex-1 text-left truncate"
                    }}
                  />
                </div>
    </>
  );
}
