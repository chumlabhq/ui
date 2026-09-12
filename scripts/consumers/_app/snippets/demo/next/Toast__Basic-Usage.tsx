"use client";

import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-success text-cl-bg hover:bg-cl-success dark:bg-cl-success dark:text-cl-bg dark:hover:bg-cl-success"
        onClick={() => toast.success("Operation completed successfully!")}
      >
        Success
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-warning text-cl-bg hover:bg-cl-warning dark:bg-cl-warning dark:text-cl-bg dark:hover:bg-cl-warning"
        onClick={() => toast.warning("Please review before proceeding.")}
      >
        Warning
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-error text-cl-bg hover:bg-cl-error/90"
        onClick={
          () =>
          toast.error("Something went wrong. Please try again.")
        }
      >
        Error
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
        onClick={() => toast.info("Here's some useful information.")}
      >
        Info
      </button>
    </>
  );
}
