import { useState } from "react";
import { Modal } from "../../../components/Modal/index.js";
import { Button } from "../../../components/Button/index.js";
import type { Previews } from "./types.js";

const SECONDARY = "border border-cl-border bg-cl-bg-elevated text-cl-text";
const PRIMARY = "bg-cl-text text-cl-bg hover:opacity-90";

function Phone() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button className={SECONDARY} onClick={() => setOpen(true)}>Open the dialog</Button>
      <Modal open={open} onOpenChange={setOpen} title="Leave this page?" description="Your draft is saved, and you can come back to it.">
        <div className="mt-4 flex justify-end gap-2">
          <Button className={SECONDARY} onClick={() => setOpen(false)}>Stay</Button>
          <Button className={PRIMARY} onClick={() => setOpen(false)}>Leave</Button>
        </div>
      </Modal>
    </>
  );
}

const CLAUSES = Array.from({ length: 24 }, (_, i) => `Clause ${i + 1}. These terms cover how the service is provided, what you agree to when you use it, and how either of us can end the agreement.`);

function Tall() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button className={SECONDARY} onClick={() => setOpen(true)}>Open the terms</Button>
      <Modal open={open} onOpenChange={setOpen} title="Terms of service" description="Read to the end to accept.">
        <div className="space-y-3 text-sm text-cl-text-secondary">
          {CLAUSES.map((clause) => (
            <p key={clause}>{clause}</p>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button className={PRIMARY} onClick={() => setOpen(false)}>Accept the terms</Button>
        </div>
      </Modal>
    </>
  );
}

export default { phone: Phone, tall: Tall } satisfies Previews;
