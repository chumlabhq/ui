import { Button } from "@chumlab/ui/button";

const SearchIcon = ({ className = "" }: { className?: string }) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function ButtonExample() {
  return (
    <>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90 dark:active:bg-cl-accent/80 dark:shadow-accent/20 dark:hover:shadow-accent/30 dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg"
        tooltip="Save your changes"
      >
        Save
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none px-4 py-2.5 rounded-cl-lg shadow-md bg-cl-error text-cl-bg hover:bg-cl-error/30 active:bg-cl-error shadow-danger/20 hover:shadow-lg hover:shadow-danger/25 focus-visible:ring-cl-error dark:bg-cl-error dark:text-cl-bg dark:hover:bg-cl-error/30 dark:active:bg-cl-error dark:shadow-danger/20 dark:hover:shadow-danger/30 dark:focus-visible:ring-cl-error dark:focus-visible:ring-offset-cl-bg"
        tooltip="Cannot be undone"
        tooltipProps={{ side: "bottom" }}
      >
        Delete
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg border border-cl-border text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] hover:border-cl-border-input focus-visible:ring-border-active dark:border dark:border-cl-text/15 dark:text-cl-text dark:hover:bg-cl-text/6 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        tooltip="Copy to clipboard"
        tooltipProps={{ side: "right", delayDuration: 100 }}
      >
        Copy
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none p-2.5 rounded-cl-lg text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] ring-1 ring-inset ring-border-soft hover:ring-border-soft focus-visible:ring-border-active dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-text/8 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        startIcon={<SearchIcon />}
        aria-label="Search"
        tooltip="Search items"
        tooltipProps={{ side: "bottom", showArrow: false }}
      />
    </>
  );
}
