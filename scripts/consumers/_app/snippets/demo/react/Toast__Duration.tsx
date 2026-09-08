import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"}
                  onClick={() =>
                    toast.info("Quick notification", {
                      duration: 2000,
                      description: "Disappears in 2 seconds"
                    })
                  }
                >
                  2 Seconds
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"}
                  onClick={() =>
                    toast.info("Standard notification", {
                      duration: 5000,
                      description: "Disappears in 5 seconds (default)"
                    })
                  }
                >
                  5 Seconds (default)
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"}
                  onClick={() =>
                    toast.info("Long notification", {
                      duration: 10000,
                      description: "Disappears in 10 seconds"
                    })
                  }
                >
                  10 Seconds
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  onClick={() =>
                    toast.info("Persistent notification", {
                      duration: Infinity,
                      description: "Stays until manually closed"
                    })
                  }
                >
                  Persistent (Infinity)
                </button>
    </>
  );
}
