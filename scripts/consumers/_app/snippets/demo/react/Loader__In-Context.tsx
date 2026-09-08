import { CircularLoader, DotLoader, LinearLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <button type="button" className={"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-cl-md bg-cl-bg-hover text-cl-text-tertiary cursor-not-allowed dark:bg-cl-bg-elevated dark:text-cl-text-tertiary dark:cursor-not-allowed"} disabled>
                    <CircularLoader
                      size={16}
                      className="text-cl-accent"
                    />
                    Saving...
                  </button>
                  <button type="button" className={"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90"}>
                    <CircularLoader size={16} className="text-cl-accent" />
                    Processing
                  </button>
                  <button type="button" className={"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90"}>
                    <DotLoader dotSize={5} gap={3} className="text-cl-accent" />
                  </button>
                </div>
    
                <div className={"rounded-cl-lg p-8 flex flex-col items-center justify-center gap-3 border border-cl-border bg-cl-bg-elevated"}>
                  <CircularLoader
                    size={36}
                    thickness={3}
                    className="text-cl-accent"
                  />
                  <p className={"text-xs text-cl-text-secondary"}>Loading content...</p>
                </div>
    
                <div
                  className={`rounded-cl-lg border overflow-hidden border-cl-border`}
                >
                  <LinearLoader
                    height={3}
                    className="text-cl-accent"
                    trackColor="rgba(91,155,255,0.18)"
                    borderRadius={0}
                  />
                  <div className={`p-6 bg-cl-bg-elevated`}>
                    <div
                      className={`h-4 w-32 sm:w-48 rounded bg-cl-bg-hover dark:bg-cl-text/60`}
                    />
                    <div
                      className={`mt-2 h-3 w-48 sm:w-64 rounded bg-cl-bg-hover dark:bg-cl-bg-hover`}
                    />
                  </div>
                </div>
    
                <div className={"flex items-center gap-2 rounded-cl-md px-3 py-2 text-sm bg-cl-warning/15 border border-cl-warning text-cl-warning dark:bg-cl-warning/20 dark:border dark:border-cl-warning/40 dark:text-cl-warning"}>
                  <CircularLoader
                    size={14}
                    thickness={2}
                    className="text-cl-accent"
                  />
                  Syncing your data...
                </div>
              </div>
  );
}
