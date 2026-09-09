"use client";

import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [controlled, setControlled] = useState(false);
  return (
    <Checkbox
      label="Controlled checkbox"
      checked={controlled}
      onValueChange={setControlled}
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
