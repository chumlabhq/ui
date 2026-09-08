import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <div className="space-y-4">
                <Tooltip content="This trigger is display: block" triggerDisplay="block">
                  <div className={`w-full px-4 py-3 rounded text-sm text-center bg-cl-bg-hover text-cl-text dark:bg-cl-bg-elevated dark:text-cl-bg`}>
                    Block display — stretches full width
                  </div>
                </Tooltip>
                <p className={`text-sm text-cl-text-secondary`}>
                  Hover over this{" "}
                  <Tooltip content="Inline tooltip" triggerDisplay="inline">
                    <span className="underline decoration-dotted cursor-help font-medium">inline text</span>
                  </Tooltip>{" "}
                  to see an inline trigger.
                </p>
              </div>
  );
}
