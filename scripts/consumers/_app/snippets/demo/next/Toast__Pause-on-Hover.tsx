"use client";

import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90"
        onClick={
          () =>
          toast.info("Hover to pause", {
            duration: 5000,
            description: "Timer pauses when hovered (default)",
            pauseOnHover: true
          })
        }
      >
        Pause on Hover (default)
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.info("No pause on hover", {
            duration: 5000,
            description: "Timer continues when hovered",
            pauseOnHover: false
          })
        }
      >
        No Pause
      </Button>
    </>
  );
}

export default function ToastExample() {
  return (
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}
