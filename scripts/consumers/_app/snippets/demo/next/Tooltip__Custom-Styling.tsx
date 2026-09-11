import { Tooltip } from "@chumlab/ui/tooltip";

const contentClassNameError = "rounded-cl-md bg-cl-error shadow-lg px-3 py-2 text-sm text-white font-medium";

const contentClassNameWarning = "rounded-cl-md bg-cl-warning shadow-lg px-3 py-2 text-sm text-white font-medium";

const contentClassNameSuccess = "rounded-cl-md bg-cl-success shadow-lg px-3 py-2 text-sm text-white font-medium";

const contentClassNameDark = "rounded-cl-md bg-cl-bg shadow-xl px-3 py-2 text-sm text-white";

export default function TooltipExample() {
  return (
    <>
      <Tooltip
        content="Dark theme tooltip"
        classes={{ content: contentClassNameDark, arrow: "fill-cl-bg" }}
      >
        <button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Dark
        </button>
      </Tooltip>
      <Tooltip
        content="Success styled tooltip"
        classes={{ content: contentClassNameSuccess, arrow: "fill-cl-success" }}
      >
        <button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Success
        </button>
      </Tooltip>
      <Tooltip
        content="Warning styled tooltip"
        classes={{ content: contentClassNameWarning, arrow: "fill-cl-warning" }}
      >
        <button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Warning
        </button>
      </Tooltip>
      <Tooltip
        content="Error styled tooltip"
        classes={{ content: contentClassNameError, arrow: "fill-cl-error" }}
      >
        <button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Error
        </button>
      </Tooltip>
    </>
  );
}
