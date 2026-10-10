"use client";

import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "info",
            message: "Custom progress color",
            description: "Using progressColor prop (inline style)",
            progressColor: "#a855f7"
          })
        }
      >
        Purple (progressColor)
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "info",
            message: "Gradient progress",
            description: "Using classes.range prop",
            classes: {
              range:
                "bg-linear-to-r from-cl-accent via-cl-warning to-cl-error"
            }
          })
        }
      >
        Gradient (classes.range)
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "success",
            message: "Themed progress",
            description: "Green progress bar",
            progressColor: "#22c55e"
          })
        }
      >
        Green Progress
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
