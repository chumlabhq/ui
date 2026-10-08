import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

const contentClassNameError = "rounded-cl-md bg-cl-error shadow-lg px-3 py-2 text-sm text-cl-on-accent font-medium";

const contentClassNameWarning = "rounded-cl-md bg-cl-warning shadow-lg px-3 py-2 text-sm text-cl-text dark:text-cl-on-accent font-medium";

const contentClassNameSuccess = "rounded-cl-md bg-cl-success shadow-lg px-3 py-2 text-sm text-cl-on-accent font-medium";

const contentClassNameDark = "rounded-cl-md bg-[#0a0d12] shadow-xl px-3 py-2 text-sm text-white";

export default function TooltipExample() {
  return (
    <>
      <Tooltip
        content="Dark theme tooltip"
        classes={{ content: contentClassNameDark, arrow: "fill-[#0a0d12]" }}
      >
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        >
          Dark
        </Button>
      </Tooltip>
      <Tooltip
        content="Success styled tooltip"
        classes={{ content: contentClassNameSuccess, arrow: "fill-cl-success" }}
      >
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        >
          Success
        </Button>
      </Tooltip>
      <Tooltip
        content="Warning styled tooltip"
        classes={{ content: contentClassNameWarning, arrow: "fill-cl-warning" }}
      >
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        >
          Warning
        </Button>
      </Tooltip>
      <Tooltip
        content="Error styled tooltip"
        classes={{ content: contentClassNameError, arrow: "fill-cl-error" }}
      >
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        >
          Error
        </Button>
      </Tooltip>
    </>
  );
}
