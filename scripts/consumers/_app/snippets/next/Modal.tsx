"use client";

import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@chumlab/ui/modal";
import { Button } from "@chumlab/ui/button";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalHeader>Welcome Back</ModalHeader>
        <ModalBody>
          <p>Your session has been restored.</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Continue</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
