import { Button } from "@chumlab/ui/button";

export default function ButtonExample() {
  return (
    <>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg"
        loading
        loaderSize={12}
      >
        Small Loader
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg"
        loading
        loaderSize={20}
      >
        Large Loader
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] active:bg-cl-bg-hover ring-1 ring-inset ring-border-soft shadow-sm shadow-black/[0.04] hover:shadow focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        loading
        loader={<span className="text-xs animate-pulse text-cl-accent">...</span>}
      >
        Custom Dots
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg border border-cl-border-strong text-cl-text hover:bg-cl-bg-hover active:bg-cl-text/4 shadow-sm shadow-black/[0.03] hover:border-cl-border-input focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        loading
        loader={
          <div className="flex gap-0.5">
            <span
              className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        }
      >
        Bouncing Dots
      </Button>
    </>
  );
}
