"use client";

import { useState } from "react";
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

const ExternalLinkIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);

export default function ButtonExample() {
  const [polymorphicClick, setPolymorphicClick] = useState("not fired yet");
  const [spanActivations, setSpanActivations] = useState(0);
  return (
    <>
      <Button
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg"
        onClick={(e) => setPolymorphicClick(JSON.stringify(e.currentTarget.tagName))}
      >
        Button Element
      </Button>
      <Button
        as="a"
        href="https://chumlab.com"
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 underline-offset-4 text-cl-accent hover:text-cl-accent hover:underline focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg"
      >
        Simple Link
      </Button>
      <Button
        as="a"
        href="https://chumlab.com"
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 underline-offset-4 text-cl-accent hover:text-cl-accent hover:underline focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg"
        endIcon={<ExternalLinkIcon />}
        iconAnimation="slideRight"
      >
        External Link
      </Button>
      <Button
        as="a"
        href="https://chumlab.com"
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg"
      >
        Styled Link
      </Button>
      <Button
        as="span"
        className="cursor-pointer text-sm font-medium transition-colors text-cl-text-tertiary hover:text-cl-text"
        onClick={() => setSpanActivations((n) => n + 1)}
      >
        Text Button
      </Button>
      <Button
        as="span"
        className="cursor-pointer text-sm font-medium transition-colors text-cl-text-tertiary hover:text-cl-text"
        endIcon={<ArrowRightIcon />}
        iconAnimation="slideRight"
        onClick={() => setSpanActivations((n) => n + 1)}
      >
        Learn More
      </Button>
      <span
        className="text-xs font-medium text-cl-text-tertiary"
        data-span-activations={spanActivations}
      >
        Activated
        {spanActivations}
        x
      </span>
    </>
  );
}
