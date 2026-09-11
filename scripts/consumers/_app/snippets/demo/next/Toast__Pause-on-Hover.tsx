"use client";

import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
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
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"
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
      </button>
    </>
  );
}
