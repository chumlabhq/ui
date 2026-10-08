import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <>
      <Tooltip content="Instant appearance (0ms)" delayDuration={0}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated focus-visible:ring-offset-cl-bg"
        >
          Instant
        </Button>
      </Tooltip>
      <Tooltip content="Fast appearance (100ms)" delayDuration={100}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated focus-visible:ring-offset-cl-bg"
        >
          Fast (100ms)
        </Button>
      </Tooltip>
      <Tooltip content="Default (200ms)" delayDuration={200}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated focus-visible:ring-offset-cl-bg"
        >
          Default (200ms)
        </Button>
      </Tooltip>
      <Tooltip content="Slow appearance (1000ms)" delayDuration={1000}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated focus-visible:ring-offset-cl-bg"
        >
          Slow (1s)
        </Button>
      </Tooltip>
    </>
  );
}
