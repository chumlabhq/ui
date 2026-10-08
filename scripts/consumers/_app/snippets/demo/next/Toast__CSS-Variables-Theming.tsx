"use client";

import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-success text-cl-bg hover:bg-cl-success"
        onClick={
          () =>
          toast.success("Themed success", {
            description: "Uses --toast-success-bg CSS variable"
          })
        }
      >
        Success (Themed)
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-error text-cl-bg hover:bg-cl-error/90"
        onClick={
          () =>
          toast.error("Themed error", {
            description: "Uses --toast-error-bg CSS variable"
          })
        }
      >
        Error (Themed)
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
