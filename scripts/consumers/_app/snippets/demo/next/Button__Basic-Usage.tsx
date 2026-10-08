import { Button } from "@chumlab/ui/button";

export default function ButtonExample() {
  return (
    <>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent dark:shadow-accent/20 focus-visible:ring-offset-cl-bg"
      >
        Primary
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover ring-1 ring-inset ring-border-soft shadow-sm shadow-black/[0.04] hover:shadow focus-visible:ring-border-active dark:bg-cl-text/8 dark:hover:bg-cl-text/[0.14] dark:active:bg-cl-text/6 dark:ring-1 dark:ring-inset dark:ring-cl-text/[0.1] focus-visible:ring-offset-cl-bg"
      >
        Secondary
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg border border-cl-border text-cl-text hover:bg-cl-bg-hover active:bg-cl-text/4 shadow-sm shadow-black/[0.03] hover:border-cl-border-input focus-visible:ring-border-active dark:border dark:border-cl-text/15 dark:hover:bg-cl-text/6 focus-visible:ring-offset-cl-bg"
      >
        Outline
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none px-4 py-2.5 rounded-cl-lg text-cl-text-secondary hover:bg-cl-bg-hover active:bg-cl-text/4 focus-visible:ring-border-active dark:hover:bg-cl-text/8 focus-visible:ring-offset-cl-bg"
      >
        Ghost
      </Button>
    </>
  );
}
