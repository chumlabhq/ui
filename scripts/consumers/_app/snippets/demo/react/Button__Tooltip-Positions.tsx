import { Button } from "@chumlab/ui/button";

export default function ButtonExample() {
  return (
    <>
      {
        (["top", "right", "bottom", "left"] as const).map((side) => (
          <Button
            key={side}
            className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover ring-1 ring-inset ring-border-soft shadow-sm shadow-black/[0.04] hover:shadow focus-visible:ring-border-active dark:bg-cl-text/8 dark:text-cl-text dark:hover:bg-cl-text/[0.14] dark:active:bg-cl-text/6 dark:ring-1 dark:ring-inset dark:ring-cl-text/[0.1] dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
            tooltip={`${side} tooltip`}
            tooltipProps={{ side }}
          >
            {side}
          </Button>
        ))
      }
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90 dark:active:bg-cl-accent/80 dark:shadow-accent/20 dark:hover:shadow-accent/30 dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg"
        tooltip="Large offset"
        tooltipProps={{ side: "top", sideOffset: 16 }}
      >
        Offset
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover ring-1 ring-inset ring-border-soft shadow-sm shadow-black/[0.04] hover:shadow focus-visible:ring-border-active dark:bg-cl-text/8 dark:text-cl-text dark:hover:bg-cl-text/[0.14] dark:active:bg-cl-text/6 dark:ring-1 dark:ring-inset dark:ring-cl-text/[0.1] dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        tooltip="No arrow"
        tooltipProps={{ showArrow: false }}
      >
        No Arrow
      </Button>
    </>
  );
}
