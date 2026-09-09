"use client";

import { useState } from "react";

function useDrawerState(initial = false) {
  const [open, setOpen] = useState(initial);
  return {
    open,
    onOpen: () => setOpen(true),
    onOpenChange: (o: boolean) => setOpen(o),
    onClose: () => setOpen(false),
  };
}

export default function DrawerExample() {
  const customDuration = useDrawerState();
  return (
    <button
      className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"
      onClick={customDuration.onOpen}
    >
      Open (600ms)
    </button>
  );
}
