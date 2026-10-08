import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <>
      <Tooltip content="Default z-index (9999)" zIndex={9999}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated focus-visible:ring-offset-cl-bg"
        >
          Default
        </Button>
      </Tooltip>
      <Tooltip content="Lower z-index (100)" zIndex={100}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated focus-visible:ring-offset-cl-bg"
        >
          z-index: 100
        </Button>
      </Tooltip>
      <Tooltip content="Higher z-index (99999)" zIndex={99999}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated focus-visible:ring-offset-cl-bg"
        >
          z-index: 99999
        </Button>
      </Tooltip>
    </>
  );
}
