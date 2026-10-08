import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <>
      <Tooltip
        content="This is a very long tooltip with superlongwordthatwillbreakifneeded to demonstrate break-word behavior"
        maxWidth={200}
        wordWrap="break-word"
      >
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        >
          Break Word (default)
        </Button>
      </Tooltip>
      <Tooltip
        content="This is a tooltip with normal word wrapping that respects word boundaries"
        maxWidth={200}
        wordWrap="normal"
      >
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        >
          Normal Wrap
        </Button>
      </Tooltip>
      <Tooltip
        content="This tooltip content will not wrap and may overflow"
        maxWidth={400}
        wordWrap="nowrap"
      >
        <Button
          className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        >
          No Wrap
        </Button>
      </Tooltip>
    </>
  );
}
