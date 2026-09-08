import { MultiSelectSearchableDropdown } from "@chumlab/ui/multi-select-searchable-dropdown";

export default function MultiSelectSearchableDropdownExample() {
  return (
    <div className="flex items-start gap-6">
                <div>
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Default message</p>
                  <div className="w-56">
                    <MultiSelectSearchableDropdown
                      options={[]}
                      defaultOpen
                      placeholder="No options..."
                      classes={({
        root: "",
        trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
        content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
        searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-border dark:bg-cl-bg-elevated`,
        searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
        loading: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
        label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
        chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text`,
        chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary`
      })}
                      aria-label="Empty default"
                    />
                  </div>
                </div>
                <div>
                  <p className={`mb-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>Custom message</p>
                  <div className="w-56">
                    <MultiSelectSearchableDropdown
                      options={[]}
                      noResultsContent={
                        <div className="flex flex-col items-center gap-1 py-2">
                          <span className="text-lg">🍎</span>
                          <span
                            className={`text-xs text-cl-text-secondary`}
                          >
                            No fruits available right now
                          </span>
                        </div>
                      }
                      placeholder="No options..."
                      classes={({
        root: "",
        trigger: `flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors min-h-[42px] border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent`,
        content: `rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`,
        searchInput: `flex items-center gap-2 px-3 py-2 border-b border-cl-border dark:border dark:border-cl-border dark:bg-cl-bg-elevated`,
        searchIcon: `w-4 h-4 shrink-0 text-cl-text-tertiary`,
        loading: `px-3 py-4 text-sm text-center text-cl-text-secondary`,
        label: `block text-sm font-medium mb-1 text-cl-text-secondary`,
        chip: `inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-cl-md shrink-0 max-w-[100px] bg-cl-accent/10 text-cl-accent dark:bg-cl-text/10 dark:text-cl-text`,
        chipRemove: `w-3 h-3 shrink-0 cursor-pointer hover:text-cl-accent dark:hover:text-cl-text-secondary`
      })}
                      aria-label="Empty custom message"
                    />
                  </div>
                </div>
              </div>
  );
}
