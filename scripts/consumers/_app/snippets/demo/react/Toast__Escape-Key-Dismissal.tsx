import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"}
                  onClick={() =>
                    toast.info("Press Escape to dismiss", {
                      duration: Infinity,
                      description:
                        "This toast can be dismissed with the Escape key"
                    })
                  }
                >
                  With Escape Dismissal
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  onClick={() =>
                    toast.info("Standard toast", {
                      duration: Infinity,
                      description: "Use close button to dismiss (Escape disabled)"
                    })
                  }
                >
                  Without Escape Dismissal
                </button>
    </>
  );
}
