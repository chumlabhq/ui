"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const [infoDismissCount, setInfoDismissCount] = useState(0);
  const [successDismissCount, setSuccessDismissCount] = useState(0);
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
        onClick={
          () =>
          toast.info("Toast with callback", {
            description: "The readout below counts this dismissal",
            onDismiss: () => setInfoDismissCount((n) => n + 1)
          })
        }
      >
        With onDismiss Callback
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.success("Action completed", {
            description: "The readout below counts this dismissal",
            onDismiss: () => setSuccessDismissCount((n) => n + 1)
          })
        }
      >
        Success with onDismiss
      </Button>
      <div
        className="w-full rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        <div>
          info onDismiss:
          {infoDismissCount ? `fired ${infoDismissCount}×` : "not fired yet"}
        </div>
        <div>
          success onDismiss:
          {successDismissCount ? `fired ${successDismissCount}×` : "not fired yet"}
        </div>
      </div>
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
