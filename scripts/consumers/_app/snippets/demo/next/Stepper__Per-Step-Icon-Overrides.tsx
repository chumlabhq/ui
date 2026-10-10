"use client";

import { useState } from "react";
import { Step, StepStatus, Stepper } from "@chumlab/ui/stepper";

const WarningIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const ThumbsUpIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
  </svg>
);

const errorGetStatus = (
    _stepId: string | number,
    index: number,
    activeIndex: number,
  ): StepStatus => {
    if (index === 1 && index >= activeIndex) return "error";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "pending";
  };

const perStepIconSteps: Step[] = [
  { id: 1, label: "Upload", completedIcon: <ThumbsUpIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
  { id: 2, label: "Validate", errorIcon: <WarningIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
  { id: 3, label: "Publish" },
];

export default function StepperExample() {
  const [perStepIconStep, setPerStepIconStep] = useState<number>(2);
  return (
    <Stepper
      steps={perStepIconSteps}
      value={perStepIconStep}
      onValueChange={(id) => setPerStepIconStep(id as number)}
      getStepStatus={errorGetStatus}
      isStepClickable={() => true}
      classes={
        {
          trigger:
            "cursor-pointer rounded-cl-md px-2 py-1.5 hover:bg-cl-code-text/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
          itemIndicator:
            "data-[state=active]:bg-cl-accent data-[state=active]:text-cl-on-accent data-[state=completed]:bg-cl-accent data-[state=completed]:text-cl-on-accent data-[state=inactive]:bg-cl-bg-hover data-[state=inactive]:text-cl-text-secondary data-[invalid]:bg-cl-error data-[invalid]:text-cl-on-accent",
          itemText:
            "data-[state=active]:text-cl-accent data-[state=completed]:text-cl-text data-[state=inactive]:text-cl-text-tertiary data-[invalid]:text-cl-error",
          description:
            "data-[state=active]:text-cl-accent data-[state=completed]:text-cl-text-secondary data-[state=inactive]:text-cl-text-tertiary data-[invalid]:text-cl-error",
          separator:
            "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:h-6 bg-cl-bg-track data-[state=active]:bg-cl-accent/30 data-[state=completed]:bg-cl-accent"
        }
      }
    />
  );
}
