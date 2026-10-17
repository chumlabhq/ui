import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { MultiSelectDropdown } from "@chumlab/ui/multi-select-dropdown";

export default function MultiSelectDropdownExample() {
  const [sauceMounts, setSauceMounts] = useState(0);
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row">
      <div className="w-full sm:max-w-xs">
        <MultiSelectDropdown
          label="Toppings"
          options={
            [
              { value: "basil", label: "Basil" },
              { value: "olive", label: "Olive" },
              { value: "pepper", label: "Pepper" }
            ]
          }
          defaultValue={["olive", "basil"]}
        />
      </div>
      <div className="w-full sm:max-w-xs space-y-3">
        <Button
          className="border border-cl-border bg-cl-bg-elevated text-cl-text"
          onClick={() => setSauceMounts((n) => n + 1)}
        >
          Show it open
        </Button>
        {
          sauceMounts > 0 && (
            <MultiSelectDropdown
              key={sauceMounts}
              label="Sauces"
              options={
                [
                  { value: "pesto", label: "Pesto" },
                  { value: "tomato", label: "Tomato" },
                  { value: "white", label: "White" }
                ]
              }
              defaultOpen
            />
          )
        }
      </div>
    </div>
  );
}
