import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [indeterminate, setIndeterminate] = useState(true);
  return (
    <Checkbox
      label="Select all items"
      indeterminate={indeterminate}
      checked={false}
      onCheckedChange={() => setIndeterminate(!indeterminate)}
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
  );
}
