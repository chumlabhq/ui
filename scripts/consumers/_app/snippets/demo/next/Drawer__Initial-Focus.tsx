"use client";

import { useRef, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerHeader } from "@chumlab/ui/drawer";

function useDrawerState(initial = false) {
  const [open, setOpen] = useState(initial);
  return {
    open,
    onOpen: () => setOpen(true),
    onOpenChange: (o: boolean) => setOpen(o),
    onClose: () => setOpen(false),
  };
}

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function DrawerExample() {
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const initialFocus = useDrawerState();
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"
        onClick={initialFocus.onOpen}
      >
        Open (focus on input)
      </Button>
      <Drawer
        open={initialFocus.open}
        onOpenChange={initialFocus.onOpenChange}
        initialFocus={initialFocusRef}
      >
        <div className="flex flex-col h-full bg-cl-bg text-cl-text">
          <DrawerHeader
            className="flex items-center justify-between px-6 py-4 border-b border-cl-border"
          >
            <h2
              className="text-[17px] font-semibold text-cl-text leading-tight tracking-[-0.01em]"
            >
              Initial Focus
            </h2>
            <DrawerCloseButton
              className="inline-flex items-center justify-center w-9 h-9 rounded-cl-md transition-colors text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg"
            >
              <CloseIcon />
            </DrawerCloseButton>
          </DrawerHeader>
          <DrawerBody className="flex-1 overflow-y-auto px-6 py-5">
            <label className="block text-sm mb-1 text-cl-text-secondary leading-relaxed">
              Name
            </label>
            <input
              ref={initialFocusRef}
              type="text"
              placeholder="This gets focus on open"
              className="w-full px-3 py-2 rounded-cl-md text-sm bg-cl-bg-elevated border border-cl-border text-cl-text"
            />
          </DrawerBody>
        </div>
      </Drawer>
    </>
  );
}
