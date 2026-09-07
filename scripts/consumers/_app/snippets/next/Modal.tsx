"use client";

import { useState } from "react";
import { Modal } from "@chumlab/ui/modal";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal open={open} onOpenChange={setOpen} title="Welcome Back">
        <p>Your session has been restored.</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button onClick={() => setOpen(false)}>Continue</button>
        </div>
      </Modal>
    </>
  );
}
