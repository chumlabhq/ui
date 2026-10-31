import { useRef, useState, type Ref } from "react";
import Drawer from "../../components/Drawer/Drawer.js";
import DrawerBody from "../../components/Drawer/components/DrawerBody.js";
import DrawerCloseButton from "../../components/Drawer/components/DrawerCloseButton.js";
import DrawerHeader from "../../components/Drawer/components/DrawerHeader.js";

// Its own module rather than inside a fixtures file: the coverage audit reads
// every `name=` attribute in a fixtures file as that component's prop.

/** Forty lines and a control at the end: taller than a 720px viewport in any overlay. */
export function TallContent({ autoFocusLast = false, lastRef }: { autoFocusLast?: boolean; lastRef?: Ref<HTMLButtonElement> }) {
  return (
    <>
      {Array.from({ length: 40 }, (_, i) => (
        <p key={i}>Line {i + 1} of content taller than the viewport.</p>
      ))}
      <button type="button" ref={lastRef} data-autofocus={autoFocusLast || undefined}>
        Last action
      </button>
    </>
  );
}

export function TallDrawer({ side, initialFocusLast = false, autoFocusLast = false, swipeable = false }: { side: "start" | "end" | "top" | "bottom"; initialFocusLast?: boolean; autoFocusLast?: boolean; swipeable?: boolean }) {
  const last = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <Drawer open={open} onOpenChange={setOpen} side={side} initialFocus={initialFocusLast ? last : undefined} swipeable={swipeable}>
      <DrawerHeader>Tall drawer</DrawerHeader>
      <DrawerCloseButton />
      <DrawerBody>
        <TallContent lastRef={last} autoFocusLast={autoFocusLast} />
      </DrawerBody>
    </Drawer>
  );
}
