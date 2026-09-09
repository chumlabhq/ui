"use client";

import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [errorDemo, setErrorDemo] = useState(false);
  return (
    <Checkbox
      label="I accept the terms"
      checked={errorDemo}
      onValueChange={setErrorDemo}
      error={!errorDemo}
      errorMessage={!errorDemo ? "You must accept the terms to continue" : undefined}
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
