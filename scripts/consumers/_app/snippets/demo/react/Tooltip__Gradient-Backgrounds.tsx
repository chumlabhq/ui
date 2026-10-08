import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

const gradientBlue = { background: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)" };

const contentClassNameGradient = "rounded-cl-md shadow-xl px-4 py-2.5 text-sm text-white font-medium";

export default function TooltipExample() {
  return (
    <Tooltip
      content="Without arrow"
      classes={{ content: contentClassNameGradient }}
      contentStyle={gradientBlue}
      showArrow={false}
    >
      <Button
        className="cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
      >
        No Arrow
      </Button>
    </Tooltip>
  );
}
