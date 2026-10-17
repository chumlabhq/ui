"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Dropdown } from "@chumlab/ui/dropdown";

export default function DropdownExample() {
  const [sizeMounts, setSizeMounts] = useState(0);
  return (
    <div className="w-full sm:max-w-xs space-y-3">
      <Button
        className="border border-cl-border bg-cl-bg-elevated text-cl-text"
        onClick={() => setSizeMounts((n) => n + 1)}
      >
        Show it open
      </Button>
      {
        sizeMounts > 0 && (
          <Dropdown
            key={sizeMounts}
            label="Size"
            options={
              [
                { value: "s", label: "Small" },
                { value: "m", label: "Medium" },
                { value: "l", label: "Large" }
              ]
            }
            defaultOpen
          />
        )
      }
    </div>
  );
}
