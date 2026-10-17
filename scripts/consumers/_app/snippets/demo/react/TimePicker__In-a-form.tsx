import { ReactNode, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { TimePicker } from "@chumlab/ui/time-picker";

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

export default function TimePickerExample() {
  return (
    <FormDemo
      onEmpty="Submit with no time: the browser blocks the submit and moves focus to the time input. It submits the time as the field holds it."
    >
      <TimePicker name="time" label="Time" required />
    </FormDemo>
  );
}
