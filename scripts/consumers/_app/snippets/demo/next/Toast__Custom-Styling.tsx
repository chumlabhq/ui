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
                      message: "Light themed toast",
                      description: "Using classes.container to override styles",
                      classes: {
                        // bg is hardcoded white, so the text needs to be
                        // hardcoded dark too — text-cl-text would invert to
                        // near-white in dark mode and disappear on the white
                        // surface. Using the light-mode --cl-text hex value.
                        root: "bg-white border border-[#e5e7eb] text-[#0f1218]",
                        description: "text-[#0f1218]/70",
                        icon: "text-cl-accent",
                        closeTrigger: "text-[#0f1218]/60 hover:text-[#0f1218] hover:bg-black/5"
                      }
                    })
                  }
                >
                  Light Theme
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  onClick={() =>
                    toast.toast({
                      type: "success",
                      message: "Custom border radius",
                      description: "Rounded-full style",
                      classes: {
                        root: "rounded-full bg-[#195030]"
                      }
                    })
                  }
                >
                  Rounded Full
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  onClick={() =>
                    toast.toast({
                      type: "info",
                      message: "Custom message style",
                      description: "Description with custom styling",
                      classes: {
                        title: "text-lg font-bold text-cl-warning",
                        description: "text-xs italic text-cl-accent"
                      }
                    })
                  }
                >
                  Custom Text Styles
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  onClick={() =>
                    toast.toast({
                      type: "success",
                      message: "Custom content wrapper",
                      description: "Using classes.content for padding",
                      classes: {
                        root: "p-6 bg-cl-text/10 rounded-cl-md"
                      }
                    })
                  }
                >
                  Custom Content Wrapper
                </button>
    </>
  );
}
