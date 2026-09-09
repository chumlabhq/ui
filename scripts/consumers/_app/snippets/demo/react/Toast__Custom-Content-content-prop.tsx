import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-4">
        <button
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
          onClick={
            () =>
            toast.toast({
              type: "info",
              content: (
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-base">
                    New Update Available
                  </p>
                  <p className="text-sm opacity-80">
                    Version 2.0 is now available.
                  </p>
                  <div className="flex gap-2 mt-1">
                    <button className="px-3 py-1 bg-white text-[#213f70] text-xs font-medium rounded hover:bg-cl-text/90 cursor-pointer">
                      Update Now
                    </button>
                    <button className="px-3 py-1 bg-cl-text/20 text-white text-xs rounded hover:bg-cl-text/30 cursor-pointer">
                      Later
                    </button>
                  </div>
                </div>
              ),
              duration: 10000
            })
          }
        >
          With Action Buttons
        </button>
        <button
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-success text-cl-bg hover:bg-cl-success dark:bg-cl-success dark:text-cl-bg dark:hover:bg-cl-success"
          onClick={
            () =>
            toast.toast({
              type: "success",
              content: (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cl-text/20 flex items-center justify-center">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <p className="font-bold">Achievement Unlocked!</p>
                    <p className="text-sm opacity-80">
                      You've completed 100 tasks
                    </p>
                  </div>
                </div>
              ),
              showProgress: false
            })
          }
        >
          Custom Layout
        </button>
        <button
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"
          onClick={
            () =>
            toast.toast({
              type: "info",
              content: (
                <div>
                  <p className="font-medium">Download Progress</p>
                  <div className="mt-2 h-2 bg-cl-text/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-3/4 animate-pulse" />
                  </div>
                  <p className="text-xs mt-1 opacity-70">
                    75% complete
                  </p>
                </div>
              ),
              duration: 8000,
              showProgress: false
            })
          }
        >
          Progress Content
        </button>
      </div>
      <div
        className="mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent"
      >
        <strong>Note:</strong>
        When using
        {" "}
        <code className="font-mono">content</code>
        , the
        {" "}
        <code className="font-mono">message</code>
        and
        {" "}
        <code className="font-mono">description</code>
        props are ignored.
      </div>
    </div>
  );
}
