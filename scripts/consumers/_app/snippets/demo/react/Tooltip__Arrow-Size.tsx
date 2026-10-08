import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <div className="flex items-center gap-6 flex-wrap">
      {
        [4, 6, 10].map((size) => (
          <Tooltip key={size} content={`Arrow size: ${size}px`} arrowSize={size}>
            <Button
              className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
            >
              {size}
              px arrow
            </Button>
          </Tooltip>
        ))
      }
    </div>
  );
}
