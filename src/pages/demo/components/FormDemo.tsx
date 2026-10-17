import { useState, type ReactNode } from "react";
import { Button } from "../../../components/Button/index.js";

/**
 * A real `<form>` around a field, with what it submitted shown back.
 *
 * Every form field's page has one "In a form" section built on this, so the
 * pattern reads the same on all fifteen: the field with `name` and `required`,
 * a Submit and a Reset button, the line the field's `.ai.md` gives for an empty
 * required submit, and the FormData the browser actually built — not what the
 * component holds in state — read back on submit. Reset clears the readout,
 * and the field goes back to its default on its own, as a native one does.
 *
 * It imports nothing but react and the library, so the snippet a reader copies
 * carries it whole.
 */
export function FormDemo({ children, onEmpty }: { children: ReactNode; onEmpty: string }) {
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
