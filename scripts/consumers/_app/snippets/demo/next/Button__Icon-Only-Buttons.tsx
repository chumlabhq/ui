import { Button } from "@chumlab/ui/button";

const CheckIcon = ({ className = "" }: { className?: string }) => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

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
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none p-2.5 rounded-cl-lg text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] ring-1 ring-inset ring-border-soft hover:ring-border-soft focus-visible:ring-border-active dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-text/8 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        startIcon={<SearchIcon />}
        aria-label="Search"
      />
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none p-2.5 rounded-cl-lg text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] ring-1 ring-inset ring-border-soft hover:ring-border-soft focus-visible:ring-border-active dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-text/8 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        startIcon={<PlusIcon />}
        aria-label="Add"
      />
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none p-2.5 rounded-cl-lg text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] ring-1 ring-inset ring-border-soft hover:ring-border-soft focus-visible:ring-border-active dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-text/8 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        startIcon={<DownloadIcon />}
        aria-label="Download"
      />
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none p-2.5 rounded-cl-lg text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] ring-1 ring-inset ring-border-soft hover:ring-border-soft focus-visible:ring-border-active dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-text/8 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"
        startIcon={<TrashIcon />}
        aria-label="Delete"
      />
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none p-2.5 rounded-cl-lg text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover shadow-sm shadow-black/[0.03] ring-1 ring-inset ring-border-soft hover:ring-border-soft focus-visible:ring-border-active dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-text/8 dark:active:bg-cl-text/4 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg bg-cl-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:hover:bg-cl-accent/90 text-cl-on-accent"
        startIcon={<CheckIcon />}
        aria-label="Confirm"
      />
    </>
  );
}
