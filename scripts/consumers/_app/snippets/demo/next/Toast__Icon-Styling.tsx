"use client";

import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border dark:border-cl-text-tertiary text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            type: "info",
            message: "Styled icon",
            description: "Icon with custom background",
            icon: <span className="text-lg">✨</span>,
            classes: { icon: "bg-cl-text/20 p-1.5 rounded-full" }
          })
        }
      >
        Rounded Icon Background
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border dark:border-cl-text-tertiary text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            type: "success",
            message: "Large icon",
            description: "Icon with larger size",
            classes: { icon: "text-2xl" }
          })
        }
      >
        Large Default Icon
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
