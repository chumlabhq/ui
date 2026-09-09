import { useRef } from "react";
import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  const toastIdRef = useRef<string | null>(null);
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-3">
        <button
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
          onClick={
            () => {
              toastIdRef.current = toast.info("Persistent toast", {
                duration: Infinity,
                description: "Use the dismiss button to remove this"
              });
            }
          }
        >
          Create Tracked Toast
        </button>
        <button
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"
          onClick={
            () => {
              if (toastIdRef.current) {
                toast.dismiss(toastIdRef.current);
                toastIdRef.current = null;
              }
            }
          }
        >
          Dismiss by ID
        </button>
        <button
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-error text-white hover:bg-cl-error/90"
          onClick={() => toast.dismissAll()}
        >
          Dismiss All
        </button>
      </div>
      <p className="text-xs text-cl-text-secondary">
        The
        <code className="font-mono">toast()</code>
        methods return a unique ID that can be used with
        {" "}
        <code className="font-mono">dismiss(id)</code>
        .
      </p>
    </div>
  );
}
