"use client";

import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-success text-cl-bg hover:bg-cl-success dark:bg-cl-success dark:text-cl-bg dark:hover:bg-cl-success"}
                  onClick={() =>
                    toast.success("Themed success", {
                      description: "Uses --toast-success-bg CSS variable"
                    })
                  }
                >
                  Success (Themed)
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-error text-white hover:bg-cl-error/90"}
                  onClick={() =>
                    toast.error("Themed error", {
                      description: "Uses --toast-error-bg CSS variable"
                    })
                  }
                >
                  Error (Themed)
                </button>
    </>
  );
}
