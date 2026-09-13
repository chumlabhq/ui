"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerFooter, DrawerHeader } from "@chumlab/ui/drawer";

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

function useDrawerState(initial = false) {
  const [open, setOpen] = useState(initial);
  return {
    open,
    onOpen: () => setOpen(true),
    onOpenChange: (o: boolean) => setOpen(o),
    onClose: () => setOpen(false),
  };
}

const renderDrawerContent = (
    title: string,
    onClose: () => void,
    extra?: React.ReactNode,
  ) => (
    <div className={"flex flex-col h-full bg-cl-bg text-cl-text"}>
      <DrawerHeader className={"flex items-center justify-between px-6 py-4 border-b border-cl-border"}>
        <h2 className={"text-[17px] font-semibold text-cl-text leading-tight tracking-[-0.01em]"}>{title}</h2>
        <DrawerCloseButton className={"inline-flex items-center justify-center w-9 h-9 rounded-cl-md transition-colors text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg"}>
          <CloseIcon />
        </DrawerCloseButton>
      </DrawerHeader>
      <DrawerBody className={"flex-1 overflow-y-auto px-6 py-5"}>
        <p className={`text-sm ${"text-cl-text-secondary leading-relaxed"}`}>
          {extra ||
            "This is the drawer content. Click outside, press Escape, or click the X to close."}
        </p>
      </DrawerBody>
      <DrawerFooter className={"flex items-center justify-end gap-3 px-6 py-4 border-t border-cl-border bg-cl-bg-elevated"}>
        <Button className={"inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"} onClick={onClose}>
          Cancel
        </Button>
        <Button className={"inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"} onClick={onClose}>
          Confirm
        </Button>
      </DrawerFooter>
    </div>
  );

export default function DrawerExample() {
  const keepMounted = useDrawerState();
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"
        onClick={keepMounted.onOpen}
      >
        Open (keepMounted)
      </Button>
      <Drawer open={keepMounted.open} onOpenChange={keepMounted.onOpenChange} keepMounted>
        {
          renderDrawerContent(
            "Keep Mounted",
            keepMounted.onClose,
            "This drawer stays in DOM when closed. Form state is preserved.",
          )
        }
      </Drawer>
    </>
  );
}
