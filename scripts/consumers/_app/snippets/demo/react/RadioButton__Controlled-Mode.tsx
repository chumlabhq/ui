import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  const [controlled, setControlled] = useState("option-a");
  return (
    <>
      <div className="w-full mb-3 p-3 rounded-cl-md flex items-center gap-3 bg-cl-bg-elevated">
        <span className="text-xs font-medium text-cl-text-secondary">Selected:</span>
        <span className="text-sm font-mono text-cl-text-secondary">
          {controlled}
        </span>
        <Button
          size="sm"
          className="ml-auto rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover"
          onClick={
            () =>
            setControlled((prev) =>
              prev === "option-a"
                ? "option-b"
                : prev === "option-b"
                  ? "option-c"
                  : "option-a",
            )
          }
        >
          Cycle Externally
        </Button>
      </div>
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
    </>
  );
}
