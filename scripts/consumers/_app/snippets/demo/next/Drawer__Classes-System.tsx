"use client";

import { useState } from "react";
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
  const classesDemo = useDrawerState();
  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"
        onClick={classesDemo.onOpen}
      >
        Custom Styled Drawer
      </button>
      <Drawer
        open={classesDemo.open}
        onOpenChange={classesDemo.onOpenChange}
        direction="right"
        size="360px"
        classes={
          {
            overlay: "fixed inset-0 transition-opacity bg-cl-accent/30 dark:bg-cl-accent/60",
            content: "fixed z-999999 shadow-2xl shadow-accent/20 dark:shadow-2xl dark:shadow-accent/10"
          }
        }
      >
        <div
          className="flex flex-col h-full bg-cl-bg border-l border-cl-border-input-focus dark:border dark:border-cl-border-input-focus/20"
        >
          <DrawerHeader
            className="flex items-center justify-between px-5 py-4 border-b border-cl-border-input-focus dark:border dark:border-cl-border-input-focus/20"
          >
            <h2 className="text-lg font-semibold text-cl-accent dark:text-cl-accent">
              Custom Classes
            </h2>
            <DrawerCloseButton
              className="p-2 rounded-cl-md text-cl-accent hover:bg-cl-accent/10 dark:text-cl-accent dark:hover:bg-cl-accent/10"
            >
              <CloseIcon />
            </DrawerCloseButton>
          </DrawerHeader>
          <DrawerBody className="flex-1 px-5 py-4 text-cl-text-secondary">
            <p className="text-sm">
              Indigo-themed overlay and panel shadow via the classes prop.
            </p>
          </DrawerBody>
        </div>
      </Drawer>
    </>
  );
}
