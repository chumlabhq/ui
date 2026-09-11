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
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90 dark:active:bg-cl-accent/80 dark:shadow-accent/20 dark:hover:shadow-accent/30 dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg"
        size="sm"
      >
        Small
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90 dark:active:bg-cl-accent/80 dark:shadow-accent/20 dark:hover:shadow-accent/30 dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg"
        size="md"
      >
        Medium
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90 dark:active:bg-cl-accent/80 dark:shadow-accent/20 dark:hover:shadow-accent/30 dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg"
        size="lg"
      >
        Large
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg border border-cl-border text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] hover:border-cl-border-input focus-visible:ring-border-active dark:border dark:border-cl-text/15 dark:text-cl-text dark:hover:bg-cl-text/6 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        size="sm"
        startIcon={<PlusIcon />}
      >
        Small
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg border border-cl-border text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] hover:border-cl-border-input focus-visible:ring-border-active dark:border dark:border-cl-text/15 dark:text-cl-text dark:hover:bg-cl-text/6 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        size="md"
        startIcon={<PlusIcon />}
      >
        Medium
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg border border-cl-border text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] hover:border-cl-border-input focus-visible:ring-border-active dark:border dark:border-cl-text/15 dark:text-cl-text dark:hover:bg-cl-text/6 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        size="lg"
        startIcon={<PlusIcon />}
      >
        Large
      </Button>
    </>
  );
}
