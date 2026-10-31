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
      <div className="text-center">
        <Button
          className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg"
          endIcon={<ArrowRightIcon />}
          iconAnimation="slideEnd"
        >
          Default (auto)
        </Button>
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
          respects OS setting
        </p>
      </div>
      <div className="text-center">
        <Button
          className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg"
          endIcon={<ArrowRightIcon />}
          iconAnimation="slideEnd"
          reduceMotion={true}
        >
          No Animation
        </Button>
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
          reduceMotion=true
        </p>
      </div>
    </>
  );
}
