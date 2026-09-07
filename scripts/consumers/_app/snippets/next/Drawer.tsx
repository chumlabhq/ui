"use client";

import { Drawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerCloseButton } from "@chumlab/ui/drawer";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerHeader>
          <h2>Settings</h2>
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody>
          <p>Drawer content goes here.</p>
        </DrawerBody>
        <DrawerFooter>
          <button onClick={() => setOpen(false)}>Close</button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}
