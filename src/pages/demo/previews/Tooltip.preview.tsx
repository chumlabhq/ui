import { useState } from "react";
import { Tooltip } from "../../../components/Tooltip/index.js";
import { Button } from "../../../components/Button/index.js";
import type { Previews } from "./types.js";

function Phone() {
  const [open, setOpen] = useState(true);
  return (
    <div className="pt-12">
      <Tooltip content="Copies a link to this page" open={open} onOpenChange={setOpen}>
        <Button className="border border-cl-border bg-cl-bg-elevated text-cl-text">Share</Button>
      </Tooltip>
    </div>
  );
}

export default { phone: Phone } satisfies Previews;
