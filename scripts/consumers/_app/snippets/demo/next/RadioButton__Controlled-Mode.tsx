"use client";

import { useState } from "react";
import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  const [controlled, setControlled] = useState("option-a");
  return (
    <RadioGroup
      name="controlled"
      value={controlled}
      onValueChange={setControlled}
      size="md"
      classes={
        {
          root: "",
          label: "text-sm font-medium text-cl-text",
          description: "text-xs text-cl-text-secondary"
        }
      }
    >
      <RadioButton
        value="option-a"
        label="Option A"
        classes={
          {
            root: "flex items-center gap-2",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <RadioButton
        value="option-b"
        label="Option B"
        classes={
          {
            root: "flex items-center gap-2",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <RadioButton
        value="option-c"
        label="Option C"
        classes={
          {
            root: "flex items-center gap-2",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
    </RadioGroup>
  );
}
