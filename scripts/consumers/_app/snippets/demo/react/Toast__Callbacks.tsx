import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
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
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"
        onClick={
          () =>
          toast.success("Action completed", {
            description: "Alert will show when dismissed",
            onDismiss: () => alert("Toast dismissed! Performing cleanup...")
          })
        }
      >
        Alert on Dismiss
      </button>
    </>
  );
}
