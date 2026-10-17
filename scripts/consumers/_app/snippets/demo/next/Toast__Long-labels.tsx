"use client";

import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <Button
      className="border border-cl-border bg-cl-bg-elevated text-cl-text"
      onClick={
        () =>
        toast.info("Your export of 12,480 rows is ready, and the download link is valid for the next seven days", {
          description: "We also emailed the link to the address on your account, in case you close this page before it finishes.",
          duration: Infinity
        })
      }
    >
      Show a long toast
    </Button>
  );
}

export default function ToastExample() {
  return (
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}
