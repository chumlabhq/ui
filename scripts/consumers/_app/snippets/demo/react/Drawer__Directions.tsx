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

const directions = {
    left: useDrawerState(),
    right: useDrawerState(),
    top: useDrawerState(),
    bottom: useDrawerState(),
  };

export default function DrawerExample() {
  return (
    <>
      {(["left", "right", "top", "bottom"] as const).map((dir) => (
                  <button
                    key={dir}
                    className={"inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"}
                    onClick={directions[dir].onOpen}
                  >
                    {dir}
                  </button>
                ))}
    </>
  );
}
