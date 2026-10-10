"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerFooter, DrawerHeader } from "@chumlab/ui/drawer";
import { Dropdown } from "@chumlab/ui/dropdown";
import { Input } from "@chumlab/ui/input";
import { TextArea } from "@chumlab/ui/textarea";

function useDrawerState(initial = false) {
  const [open, setOpen] = useState(initial);
  return {
    open,
    onOpen: () => setOpen(true),
    onOpenChange: (o: boolean) => setOpen(o),
    onClose: () => setOpen(false),
  };
}

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
];

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
  const formDrawer = useDrawerState();
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"
        onClick={formDrawer.onOpen}
      >
        Create New Item
      </Button>
      <Drawer
        open={formDrawer.open}
        onOpenChange={formDrawer.onOpenChange}
        side="right"
        size="400px"
      >
        <div className="flex flex-col h-full bg-cl-bg text-cl-text">
          <DrawerHeader
            className="flex items-center justify-between px-6 py-4 border-b border-cl-border"
          >
            <h2
              className="text-[17px] font-semibold text-cl-text leading-tight tracking-[-0.01em]"
            >
              Create Item
            </h2>
            <DrawerCloseButton
              className="inline-flex items-center justify-center w-9 h-9 rounded-cl-md transition-colors text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg"
            >
              <CloseIcon />
            </DrawerCloseButton>
          </DrawerHeader>
          <DrawerBody className="flex-1 overflow-y-auto px-6 py-5">
            <form
              className="space-y-4"
              onSubmit={
                (e) => {
                  e.preventDefault();
                  formDrawer.onClose();
                }
              }
            >
              <Input data-autofocus label="Name" placeholder="Item name" />
              <TextArea label="Description" rows={3} placeholder="Optional description" />
              <Dropdown
                label="Category"
                options={categoryOptions}
                placeholder="Select a category..."
              />
            </form>
          </DrawerBody>
          <DrawerFooter
            className="flex items-center justify-end gap-3 px-6 py-4 border-t border-cl-border bg-cl-bg-elevated"
          >
            <Button
              className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"
              onClick={formDrawer.onClose}
            >
              Cancel
            </Button>
            <Button
              className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"
              onClick={formDrawer.onClose}
            >
              Create
            </Button>
          </DrawerFooter>
        </div>
      </Drawer>
    </>
  );
}
