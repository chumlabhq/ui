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
  const snapPoints = useDrawerState();
  const [snapIndex, setSnapIndex] = useState(1);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"
        onClick={snapPoints.onOpen}
      >
        Open Bottom Sheet
      </button>
      <span className="text-xs font-mono text-cl-text-secondary">
        snap:
        {Math.round([0.3, 0.6, 1][snapIndex] * 100)}
        %
      </span>
    </div>
  );
}
