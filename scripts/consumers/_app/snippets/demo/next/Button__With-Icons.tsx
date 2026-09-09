import { Button } from "@chumlab/ui/button";

const TrashIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const DownloadIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

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

const ArrowRightIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="m12 5 7 7-7 7" />
  </svg>
);

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
        className="cursor-pointer text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none px-4 py-2.5 rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90 dark:active:bg-cl-accent/80 dark:shadow-accent/20 dark:hover:shadow-accent/30 dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg"
        startIcon={<PlusIcon />}
      >
        Add Item
      </Button>
      <Button
        className="cursor-pointer text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none px-4 py-2.5 rounded-cl-lg bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover ring-1 ring-inset ring-border-soft shadow-sm shadow-black/[0.04] hover:shadow focus-visible:ring-border-active dark:bg-cl-text/8 dark:text-cl-text dark:hover:bg-cl-text/[0.14] dark:active:bg-cl-text/6 dark:ring-1 dark:ring-inset dark:ring-cl-text/[0.1] dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        endIcon={<ArrowRightIcon />}
      >
        Continue
      </Button>
      <Button
        className="cursor-pointer text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none px-4 py-2.5 rounded-cl-lg border border-cl-border text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] hover:border-cl-border-input focus-visible:ring-border-active dark:border dark:border-cl-text/15 dark:text-cl-text dark:hover:bg-cl-text/6 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        startIcon={<SearchIcon />}
        endIcon={<ArrowRightIcon />}
      >
        Search
      </Button>
      <Button
        className="cursor-pointer text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none px-4 py-2.5 rounded-cl-lg shadow-md bg-cl-success text-cl-bg hover:bg-cl-success/30 active:bg-cl-success shadow-success/20 hover:shadow-lg hover:shadow-success/25 focus-visible:ring-cl-success dark:bg-cl-success dark:text-cl-bg dark:hover:bg-cl-success/30 dark:active:bg-cl-success dark:shadow-success/20 dark:hover:shadow-success/30 dark:focus-visible:ring-cl-success dark:focus-visible:ring-offset-cl-bg"
        startIcon={<DownloadIcon />}
      >
        Download
      </Button>
      <Button
        className="cursor-pointer text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none px-4 py-2.5 rounded-cl-lg shadow-md bg-cl-error text-cl-bg hover:bg-cl-error/30 active:bg-cl-error shadow-danger/20 hover:shadow-lg hover:shadow-danger/25 focus-visible:ring-cl-error dark:bg-cl-error dark:text-cl-bg dark:hover:bg-cl-error/30 dark:active:bg-cl-error dark:shadow-danger/20 dark:hover:shadow-danger/30 dark:focus-visible:ring-cl-error dark:focus-visible:ring-offset-cl-bg"
        startIcon={<TrashIcon />}
      >
        Delete
      </Button>
    </>
  );
}
