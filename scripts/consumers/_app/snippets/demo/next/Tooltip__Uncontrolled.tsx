import { Button } from "@chumlab/ui/button";
import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <div className="pt-10">
      <Tooltip content="Saved to your library" defaultOpen>
        <Button className="border border-cl-border bg-cl-bg-elevated text-cl-text">Save</Button>
      </Tooltip>
    </div>
  );
}
