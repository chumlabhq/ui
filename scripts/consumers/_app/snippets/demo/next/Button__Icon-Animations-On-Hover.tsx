import { Button } from "@chumlab/ui/button";

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

export default function ButtonExample() {
  return (
    <>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg"
        endIcon={<ArrowRightIcon />}
        iconAnimation="slideEnd"
      >
        Slide Right
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] active:bg-cl-bg-hover ring-1 ring-inset ring-border-soft shadow-sm shadow-black/[0.04] hover:shadow focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        startIcon={<ArrowRightIcon />}
        iconAnimation="slideStart"
        animateIcon="leading"
      >
        Slide Left
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg border border-cl-border-strong text-cl-text hover:bg-cl-bg-hover active:bg-cl-text/4 shadow-sm shadow-black/[0.03] hover:border-cl-border-input focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        endIcon={<ArrowRightIcon />}
        iconAnimation="slideUp"
      >
        Slide Up
      </Button>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none px-4 py-2.5 rounded-cl-lg text-cl-text-secondary hover:bg-cl-bg-hover active:bg-cl-text/4 focus-visible:ring-border-active focus-visible:ring-offset-cl-bg"
        endIcon={<ArrowRightIcon />}
        iconAnimation="slideDown"
      >
        Slide Down
      </Button>
    </>
  );
}
