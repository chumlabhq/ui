import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [successDemo, setSuccessDemo] = useState(true);
  return (
    <Checkbox
      label="I agree to the terms"
      checked={successDemo}
      onCheckedChange={setSuccessDemo}
      success={successDemo}
      successMessage="Terms accepted"
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
