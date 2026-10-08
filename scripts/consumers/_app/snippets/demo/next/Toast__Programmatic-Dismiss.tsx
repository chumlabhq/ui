"use client";

import { useRef } from "react";
import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  const toastIdRef = useRef<string | null>(null);
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-3">
        <Button
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90"
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
        </Button>
        <Button
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
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
        </Button>
        <Button
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-error text-cl-bg hover:bg-cl-error/90"
          onClick={() => toast.dismissAll()}
        >
          Dismiss All
        </Button>
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

export default function ToastExample() {
  return (
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}
