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
          toast.info("With progress bar", {
            showProgress: true,
            description: "Progress bar shows remaining time"
          })
        }
      >
        With Progress (default)
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"
        onClick={
          () =>
          toast.info("No progress indicator", {
            showProgress: false,
            description: "Clean toast without progress bar"
          })
        }
      >
        Without Progress
      </button>
    </>
  );
}
