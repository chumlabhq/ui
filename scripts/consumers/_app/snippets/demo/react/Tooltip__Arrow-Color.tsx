import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <>
      <Tooltip
        content="Indigo arrow"
        arrowColor="#4f46e5"
        classes={{ content: "rounded-cl-md px-3 py-2 text-sm text-cl-on-accent bg-cl-accent dark:bg-cl-accent" }}
      >
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Indigo
        </Button>
      </Tooltip>
      <Tooltip
        content="Emerald arrow"
        arrowColor="#047857"
        classes={{ content: "rounded-cl-md px-3 py-2 text-sm text-cl-bg bg-cl-success dark:bg-cl-success" }}
      >
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Emerald
        </Button>
      </Tooltip>
      <Tooltip
        content="Rose arrow"
        arrowColor="#e11d48"
        classes={{ content: "rounded-cl-md px-3 py-2 text-sm text-cl-on-accent bg-cl-accent dark:bg-cl-accent" }}
      >
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Rose
        </Button>
      </Tooltip>
      <Tooltip content="Default content, colored arrow only" arrowColor="#4f46e5">
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Arrow Only
        </Button>
      </Tooltip>
    </>
  );
}
