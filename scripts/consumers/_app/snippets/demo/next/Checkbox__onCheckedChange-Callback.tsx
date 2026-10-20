"use client";

import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [onCheckedChangeDemo, setOnCheckedChangeDemo] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        label="Subscribe to newsletter"
        onCheckedChange={setOnCheckedChangeDemo}
        checked={onCheckedChangeDemo}
        size="md"
        shape="rounded"
        classes={
          {
            root: "",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <p className="text-sm text-cl-text-secondary" data-demo-action>
        Checked:
        {String(onCheckedChangeDemo)}
      </p>
    </div>
  );
}
