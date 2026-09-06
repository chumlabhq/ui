"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Drawer, DrawerHeader } from "@chumlab/ui/drawer";
import { Modal } from "@chumlab/ui/modal";
import { Table } from "@chumlab/ui/table";
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
 * A Table that switches to cards below a breakpoint.
 *
 * Here for one reason: `renderMobileCard` is a function, so this variant cannot
 * be written in `registry.tsx`, and without it Table's viewport-width state is
 * unobservable — the width only changes the markup when both props are set. The
 * breakpoint is above the harness viewport (1280) and above the width a server
 * assumes (1024), so the two disagree about which of the two trees to render.
 *
 * Its own two rows rather than the registry's: `registry.tsx` imports this
 * module, so importing back would be a cycle.
 */
const MOBILE_ROWS = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Grace", role: "Admiral" },
];

const MOBILE_COLUMNS = [
  { id: "name", accessorKey: "name", header: "Name" },
  { id: "role", accessorKey: "role", header: "Role" },
];

export function ResponsiveTable() {
  return (
    <Table
      data={MOBILE_ROWS}
      columns={MOBILE_COLUMNS}
      responsiveBreakpoint={1200}
      renderMobileCard={(row) => <div data-mobile-card>{row.name}</div>}
    />
  );
}

/**
 * Moves a subtree into a portal after mount, and reports NOTHING to React.
 *
 * The positive control for the structural check, and the reason that check
 * exists: the server ships the node inline, the first client render ships the
 * same node inline — so hydration compares two identical trees and is happy —
 * and then an effect relocates it. React deletes and re-inserts without a
 * recoverable error. `Tooltip` did exactly this with its `portal` prop, and the
 * error channel called it clean.
 */
export function HydrationMover() {
  const [moved, setMoved] = useState(false);
  useEffect(() => setMoved(true), []);
  const node = (
    <div id="mover-node" role="note">
      moved
    </div>
  );
  return <div>{moved ? createPortal(node, document.body) : node}</div>;
}

/**
 * Renders one string on a server and a different one in a browser, which is a
 * hydration mismatch by construction. See CANARY in `registry.tsx`.
 */
export function HydrationCanary() {
  return <p>{typeof window === "undefined" ? "server" : "client"}</p>;
}
