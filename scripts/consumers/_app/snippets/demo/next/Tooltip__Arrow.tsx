import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <>
      <Tooltip content="Arrow visible on this tooltip" showArrow={true}>
        <button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          With Arrow
        </button>
      </Tooltip>
      <Tooltip content="No arrow on this tooltip" showArrow={false}>
        <button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          No Arrow
        </button>
      </Tooltip>
    </>
  );
}
