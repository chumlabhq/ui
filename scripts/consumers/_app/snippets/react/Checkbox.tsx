import { Checkbox } from "@chumlab/ui/checkbox";
import { useState } from "react";

export default function Example() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="I agree to the terms"
      checked={checked}
      onValueChange={setChecked}
    />
  );
}
