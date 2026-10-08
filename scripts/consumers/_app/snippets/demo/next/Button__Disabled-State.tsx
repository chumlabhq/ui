import { Button } from "@chumlab/ui/button";

const PlusIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default function ButtonExample() {
  return (
    <>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent dark:shadow-accent/20 focus-visible:ring-offset-cl-bg"
        disabled
      >
        Disabled Primary
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover ring-1 ring-inset ring-border-soft shadow-sm shadow-black/[0.04] hover:shadow focus-visible:ring-border-active dark:bg-cl-text/8 dark:hover:bg-cl-text/[0.14] dark:active:bg-cl-text/6 dark:ring-1 dark:ring-inset dark:ring-cl-text/[0.1] focus-visible:ring-offset-cl-bg"
        disabled
      >
        Disabled Secondary
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg border border-cl-border text-cl-text hover:bg-cl-bg-hover active:bg-cl-text/4 shadow-sm shadow-black/[0.03] hover:border-cl-border-input focus-visible:ring-border-active dark:border dark:border-cl-text/15 dark:hover:bg-cl-text/6 focus-visible:ring-offset-cl-bg"
        disabled
      >
        Disabled Outline
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none px-4 py-2.5 rounded-cl-lg text-cl-text-secondary hover:bg-cl-bg-hover active:bg-cl-text/4 focus-visible:ring-border-active dark:hover:bg-cl-text/8 focus-visible:ring-offset-cl-bg"
        disabled
        startIcon={<PlusIcon />}
      >
        Disabled with Icon
      </Button>
    </>
  );
}
