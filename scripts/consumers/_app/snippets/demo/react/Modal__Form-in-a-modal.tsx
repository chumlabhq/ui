import { ReactNode, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Input } from "@chumlab/ui/input";
import { Modal } from "@chumlab/ui/modal";

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

export default function ModalExample() {
  const [formModalOpen, setFormModalOpen] = useState(false);
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setFormModalOpen(true)}
      >
        Open the form
      </Button>
      <Modal open={formModalOpen} onOpenChange={setFormModalOpen} title="Contact us">
        <FormDemo
          onEmpty="Submit with the email empty: the browser blocks the submit and focuses the email field, which is inside the dialog's focus trap."
        >
          <Input name="email" type="email" label="Email" required />
        </FormDemo>
      </Modal>
    </>
  );
}
