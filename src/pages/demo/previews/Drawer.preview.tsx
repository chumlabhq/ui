import { useState, type ReactNode } from "react";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerHeader } from "../../../components/Drawer/index.js";
import { Button } from "../../../components/Button/index.js";
import type { Previews } from "./types.js";

const SECONDARY = "border border-cl-border bg-cl-bg-elevated text-cl-text";
const PRIMARY = "bg-cl-text text-cl-bg hover:opacity-90";

/** The drawer paints only its structure; the panel's surface is the consumer's. */
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-cl-bg text-cl-text">
      <DrawerHeader className="flex items-center justify-between border-b border-cl-border px-5 py-4">
        <h2 className="text-[17px] font-semibold leading-tight">{title}</h2>
        <DrawerCloseButton className="inline-flex h-9 w-9 items-center justify-center rounded-cl-md text-cl-text-tertiary hover:bg-cl-bg-hover hover:text-cl-text">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </DrawerCloseButton>
      </DrawerHeader>
      <DrawerBody className="flex-1 overflow-y-auto px-5 py-4">{children}</DrawerBody>
    </div>
  );
}

function Phone() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button className={SECONDARY} onClick={() => setOpen(true)}>Open the menu</Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <Panel title="Menu">
          <nav aria-label="Menu" className="space-y-3 text-sm text-cl-text-secondary">
            {["Home", "Orders", "Saved items", "Settings"].map((item) => (
              <p key={item}>{item}</p>
            ))}
          </nav>
        </Panel>
      </Drawer>
    </>
  );
}

const ITEMS = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}: Notebook, A5, dotted`);

function LongSheet() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button className={SECONDARY} onClick={() => setOpen(true)}>Open the order</Button>
      <Drawer open={open} onOpenChange={setOpen} side="bottom" size="70%" swipeable>
        <Panel title="Your order">
          <ul className="space-y-2 text-sm text-cl-text-secondary">
            {ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-6 flex justify-end">
            <Button className={PRIMARY} onClick={() => setOpen(false)}>Place the order</Button>
          </div>
        </Panel>
      </Drawer>
    </>
  );
}

export default { phone: Phone, "long-sheet": LongSheet } satisfies Previews;
