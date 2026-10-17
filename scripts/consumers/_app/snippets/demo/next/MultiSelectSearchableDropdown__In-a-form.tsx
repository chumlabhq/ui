import { ReactNode, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { MultiSelectSearchableDropdown } from "@chumlab/ui/multi-select-searchable-dropdown";

function FormDemo({ children, onEmpty }: { children: ReactNode; onEmpty: string }) {
  const [submitted, setSubmitted] = useState<string[] | null>(null);
  return (
    <form
      data-demo-form=""
      className="w-full sm:max-w-sm space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted([...new FormData(event.currentTarget)].map(([key, value]) => `${key}=${String(value)}`));
      }}
      onReset={() => setSubmitted(null)}
    >
      {children}
      <p className="text-sm text-cl-text-secondary">{onEmpty}</p>
      <div className="flex gap-2">
        <Button type="submit" className="bg-cl-text text-cl-bg hover:opacity-90">
          Submit
        </Button>
        <Button type="reset" className="border border-cl-border bg-cl-bg-elevated text-cl-text hover:border-cl-border-input">
          Reset
        </Button>
      </div>
      <output
        aria-live="polite"
        aria-label="What the form submitted"
        data-demo-form-readout=""
        className="block whitespace-pre-wrap break-all rounded-cl-md border border-cl-border bg-cl-bg-elevated p-3 font-mono text-xs text-cl-text"
      >
        {submitted === null ? "Nothing submitted yet." : submitted.length ? submitted.join("\n") : "(no entries)"}
      </output>
    </form>
  );
}

export default function MultiSelectSearchableDropdownExample() {
  return (
    <FormDemo
      onEmpty="Submit with nothing selected: a required field needs one value, so the submit is blocked and focus moves to the trigger. It submits the values joined with commas."
    >
      <MultiSelectSearchableDropdown
        name="fruits"
        label="Fruits"
        required
        options={[{ value: "a", label: "Apple" }, { value: "b", label: "Banana" }, { value: "c", label: "Cherry" }]}
      />
    </FormDemo>
  );
}
