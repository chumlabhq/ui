import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <>
      <Tooltip content="Arrow visible on this tooltip" showArrow={true}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        >
          With Arrow
        </Button>
      </Tooltip>
      <Tooltip content="No arrow on this tooltip" showArrow={false}>
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        >
          No Arrow
        </Button>
      </Tooltip>
    </>
  );
}
