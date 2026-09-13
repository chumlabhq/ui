import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

const shadowSharpDrop = "4px 4px 0px rgba(0, 0, 0, 0.1)";

const shadowSoftElevated = "0 10px 40px -10px rgba(0, 0, 0, 0.2)";

const shadowPurpleGlow = "0 4px 20px rgba(147, 51, 234, 0.5)";

const shadowBlueGlow = "0 4px 20px rgba(59, 130, 246, 0.5)";

export default function TooltipExample() {
  return (
    <>
      <Tooltip content="Custom blue glow shadow" shadow={shadowBlueGlow}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Blue Glow
        </Button>
      </Tooltip>
      <Tooltip content="Custom purple glow shadow" shadow={shadowPurpleGlow}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Purple Glow
        </Button>
      </Tooltip>
      <Tooltip content="Soft elevated shadow" shadow={shadowSoftElevated}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Soft Elevated
        </Button>
      </Tooltip>
      <Tooltip content="Sharp drop shadow" shadow={shadowSharpDrop}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        >
          Sharp Drop
        </Button>
      </Tooltip>
    </>
  );
}
