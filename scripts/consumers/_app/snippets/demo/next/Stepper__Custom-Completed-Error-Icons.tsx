"use client";

import { useState } from "react";
import { StepStatus, Stepper } from "@chumlab/ui/stepper";

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

const WarningIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function StepperExample() {
  const [customIconStep, setCustomIconStep] = useState<number>(2);
  return (
    <Stepper
      steps={
        [
          { id: 1, label: "Upload" },
          { id: 2, label: "Validate" },
          { id: 3, label: "Publish" }
        ]
      }
      value={customIconStep}
      onValueChange={(id) => setCustomIconStep(id as number)}
      completedIcon={StarIcon}
      errorIcon={WarningIcon}
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
