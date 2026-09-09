"use client";

import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [withDesc, setWithDesc] = useState(false);
  return (
    <Checkbox
      label="Email notifications"
      description="Receive email updates about your account activity"
      checked={withDesc}
      onValueChange={setWithDesc}
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
