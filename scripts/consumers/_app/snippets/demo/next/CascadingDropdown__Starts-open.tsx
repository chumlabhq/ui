"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { CascadingDropdown } from "@chumlab/ui/cascading-dropdown";

export default function CascadingDropdownExample() {
  const [categoryMounts, setCategoryMounts] = useState(0);
  return (
    <div className="w-full sm:max-w-xs space-y-3">
      <Button
        className="border border-cl-border bg-cl-bg-elevated text-cl-text"
        onClick={() => setCategoryMounts((n) => n + 1)}
      >
        Show it open
      </Button>
      {
        categoryMounts > 0 && (
          <CascadingDropdown
            key={categoryMounts}
            label="Category"
            options={
              [
                { value: "fruit", label: "Fruit", children: [{ value: "apple", label: "Apple" }, { value: "pear", label: "Pear" }] },
                { value: "veg", label: "Vegetables", children: [{ value: "carrot", label: "Carrot" }, { value: "leek", label: "Leek" }] }
              ]
            }
            defaultOpen
          />
        )
      }
    </div>
  );
}
