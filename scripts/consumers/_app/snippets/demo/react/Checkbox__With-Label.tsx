import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [withLabel, setWithLabel] = useState(true);
  return (
    <Checkbox
                label="Accept terms and conditions"
                checked={withLabel}
                onValueChange={setWithLabel}
                size="md"
                shape="rounded"
                classes={({
        root: "",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })}
              />
  );
}
