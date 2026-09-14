import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [onValueChangeDemo, setOnValueChangeDemo] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        label="Using onValueChange"
        onValueChange={setOnValueChangeDemo}
        checked={onValueChangeDemo}
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
        {String(onValueChangeDemo)}
      </p>
    </div>
  );
}
