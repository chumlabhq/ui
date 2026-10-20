"use client";

import { useRef } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const checkboxRef = useRef<HTMLInputElement>(null);
  return (
    <Checkbox
      ref={checkboxRef}
      label="Accept terms"
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
