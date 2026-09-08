"use client";

import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  onClick={() =>
                    toast.toast({
                      type: "info",
                      message: "Custom shadow",
                      description: "Using style prop for box-shadow",
                      style: {
                        boxShadow: "0 10px 40px rgba(59, 130, 246, 0.5)"
                      }
                    })
                  }
                >
                  Custom Shadow
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  onClick={() =>
                    toast.toast({
                      type: "success",
                      message: "Custom width",
                      description: "This toast has a wider minimum width",
                      style: {
                        minWidth: "400px"
                      }
                    })
                  }
                >
                  Custom Width
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  onClick={() =>
                    toast.toast({
                      type: "warning",
                      message: "Gradient background",
                      description: "Using style for gradient",
                      style: {
                        background:
                          "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        border: "none"
                      }
                    })
                  }
                >
                  Gradient Background
                </button>
    </>
  );
}
