import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Dropdown, DropdownOption } from "@chumlab/ui/dropdown";

const fruitOptions: DropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

export default function DropdownExample() {
  const [formSubmit, setFormSubmit] = useState("not fired yet");
  return (
    <>
      <form
        onSubmit={
          (e) => {
            e.preventDefault();
            setFormSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
          }
        }
        className="w-full flex flex-col sm:flex-row sm:items-end gap-4"
      >
        <div className="w-full sm:max-w-64">
          <Dropdown
            name="fruit"
            label="Fruit (in form)"
            options={fruitOptions}
            placeholder="Select a fruit..."
            classes={
              {
                root: "w-full",
                trigger: "flex items-center justify-between gap-2 w-full px-3 py-2 text-left rounded-cl-md transition-colors border border-cl-border-input bg-cl-bg-panel text-cl-text hover:border-cl-border-input-hover focus:outline-none focus:ring-2 focus:ring-cl-accent focus:border-transparent data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
                content: "rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-border",
                label: "block text-sm font-medium mb-1 text-cl-text-secondary"
              }
            }
          />
        </div>
        <Button
          type="submit"
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer"
        >
          Submit
        </Button>
      </form>
      <div
        className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        onSubmit:
        {formSubmit}
      </div>
    </>
  );
}
