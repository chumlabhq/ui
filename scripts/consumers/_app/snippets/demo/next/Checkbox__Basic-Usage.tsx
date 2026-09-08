"use client";

import { useState } from "react";
import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  const [basic, setBasic] = useState(false);
  return (
    <>
      {}
      <div className="flex flex-col gap-3">
                  <Checkbox
                    label="Accept terms and conditions"
                    checked={basic}
                    onValueChange={setBasic}
                  />
                  <Checkbox
                    label="Subscribe to newsletter"
                    description="Get weekly updates about new features"
                  />
                  <Checkbox
                    label="Remember me"
                    defaultChecked
                  />
                </div>
    </>
  );
}
