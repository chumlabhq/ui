import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
        onClick={
          () =>
          toast.info("Toast with callback", {
            description: "Check console when this closes",
            onDismiss: () => console.log("Toast was dismissed!")
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
            description: "Alert will show when dismissed",
            onDismiss: () => alert("Toast dismissed! Performing cleanup...")
          })
        }
      >
        Alert on Dismiss
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
