import { Dropdown } from "@chumlab/ui/dropdown";

export default function DropdownExample() {
  return (
    <div className="w-full flex flex-wrap gap-8">
      <div className="w-full sm:max-w-64">
        <Dropdown
          options={[]}
          placeholder="Loading..."
          loading={true}
          shimmerCount={3}
          classes={
            {
              root: "w-full",
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }
          }
        />
      </div>
      <div className="w-full sm:max-w-64">
        <Dropdown
          options={[]}
          placeholder="Loading..."
          loading={true}
          shimmerCount={8}
          classes={
            {
              root: "w-full",
              trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-white text-cl-text hover:border-cl-border-input focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent dark:border dark:border-cl-border dark:bg-cl-bg-elevated dark:text-white dark:hover:border-cl-border dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-cl-accent",
              content: "rounded-cl-md shadow-lg overflow-hidden bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border",
              label: "block text-sm font-medium mb-1 text-cl-text-secondary"
            }
          }
        />
      </div>
    </div>
  );
}
