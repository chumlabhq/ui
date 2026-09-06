"use client";
import { useState } from "react";
import { Drawer, DrawerHeader } from "@chumlab/ui/drawer";
import { Modal } from "@chumlab/ui/modal";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

/**
 * The consumer's own client boundary, for the three components that cannot be
 * rendered from a server component at all: Modal and Drawer take `open` from
 * their host, and a Toast is pushed by a hook. Every other component in
 * `registry.tsx` is driven by plain props from a server component, which is the
 * shape that tests the library's own "use client" directives.
 *
 * These are still server-rendered — a "use client" component is prerendered by
 * Next and by React Router; the directive marks where hydration begins, not
 * where rendering does.
 */
export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" data-probe="open" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <Modal open={open} onOpenChange={setOpen} title="Modal">
        <p>Body</p>
      </Modal>
    </>
  );
}

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" data-probe="open" onClick={() => setOpen(true)}>
        Open drawer
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerHeader title="Drawer" />
        <p>Body</p>
      </Drawer>
    </>
  );
}

function ToastTrigger() {
  const { toast } = useToast();
  return (
    <button type="button" data-probe="open" onClick={() => toast("Saved")}>
      Show toast
    </button>
  );
}

export function ToastDemo() {
  return (
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}

/**
 * Renders one string on a server and a different one in a browser, which is a
 * hydration mismatch by construction. See CANARY in `registry.tsx`.
 */
export function HydrationCanary() {
  return <p>{typeof window === "undefined" ? "server" : "client"}</p>;
}
