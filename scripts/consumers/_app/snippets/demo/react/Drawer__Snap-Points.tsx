import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Drawer, DrawerBody, DrawerHeader } from "@chumlab/ui/drawer";

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
  const [snapIndex, setSnapIndex] = useState(1);
  const snapPoints = useDrawerState();
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"
          onClick={snapPoints.onOpen}
        >
          Open Bottom Sheet
        </Button>
        <span className="text-xs font-mono text-cl-text-secondary">
          snap:
          {Math.round([0.3, 0.6, 1][snapIndex] * 100)}
          %
        </span>
      </div>
      <Drawer
        open={snapPoints.open}
        onOpenChange={snapPoints.onOpenChange}
        swipeable
        direction="bottom"
        size="85vh"
        snapPoints={[0.3, 0.6, 1]}
        activeSnapPointIndex={snapIndex}
        onSnapPointIndexChange={setSnapIndex}
        defaultSnapPointIndex={1}
      >
        <div className="flex flex-col h-full bg-cl-bg text-cl-text rounded-t-cl-lg">
          <DrawerHeader className="px-5 pb-3 border-b border-cl-border">
            <h2
              className="text-[17px] font-semibold text-cl-text leading-tight tracking-[-0.01em]"
            >
              Bottom Sheet
            </h2>
            <p className="text-xs mt-1 text-cl-text-secondary">Snap points: 30%, 60%, 100%</p>
          </DrawerHeader>
          <div className="flex gap-2 px-5 py-3">
            {
              [0, 1, 2].map((i) => (
                <button
                  key={i}
                  className={`${snapIndex === i ? "inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer" : "inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer"} text-xs cursor-pointer`}
                  onClick={() => setSnapIndex(i)}
                >
                  {Math.round([0.3, 0.6, 1][i] * 100)}
                  %
                </button>
              ))
            }
          </div>
          <DrawerBody className="flex-1 overflow-y-auto px-5 py-4">
            {
              Array.from({ length: 20 }).map((_, i) => (
                <p
                  key={i}
                  className="text-sm py-2 border-b border-cl-border text-cl-text-tertiary dark:border dark:border-cl-border dark:text-cl-text-tertiary"
                >
                  Item
                  {i + 1}
                  — scroll to see more content
                </p>
              ))
            }
          </DrawerBody>
        </div>
      </Drawer>
    </>
  );
}
