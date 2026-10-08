import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90"
        onClick={
          () =>
          toast.info("Quick notification", {
            duration: 2000,
            description: "Disappears in 2 seconds"
          })
        }
      >
        2 Seconds
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90"
        onClick={
          () =>
          toast.info("Standard notification", {
            duration: 5000,
            description: "Disappears in 5 seconds (default)"
          })
        }
      >
        5 Seconds (default)
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90"
        onClick={
          () =>
          toast.info("Long notification", {
            duration: 10000,
            description: "Disappears in 10 seconds"
          })
        }
      >
        10 Seconds
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.info("Persistent notification", {
            duration: Infinity,
            description: "Stays until manually closed"
          })
        }
      >
        Persistent (Infinity)
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
