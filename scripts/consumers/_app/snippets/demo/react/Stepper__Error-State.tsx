import { useState } from "react";
import { StepStatus, Stepper } from "@chumlab/ui/stepper";

const errorGetStatus = (
    _stepId: string | number,
    index: number,
    activeIndex: number,
  ): StepStatus => {
    if (index === 1) return "error";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "pending";
  };

export default function StepperExample() {
  const [errorStep, setErrorStep] = useState<number>(2);
  return (
    <Stepper
      steps={
        [
          { id: 1, label: "Account" },
          { id: 2, label: "Verification" },
          { id: 3, label: "Complete" }
        ]
      }
      value={errorStep}
      onValueChange={(id) => setErrorStep(id as number)}
      getStepStatus={errorGetStatus}
      isStepClickable={() => true}
      classes={
        {
          trigger:
            "cursor-pointer rounded-cl-md px-2 py-1.5 hover:bg-cl-bg-hover dark:hover:bg-cl-text/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
          itemIndicator:
            "data-[state=active]:bg-cl-accent data-[state=active]:text-cl-on-accent data-[state=completed]:bg-cl-accent data-[state=completed]:text-cl-on-accent data-[state=inactive]:bg-black/[0.06] dark:data-[state=inactive]:bg-white/10 data-[state=inactive]:text-cl-text-secondary data-[invalid]:bg-cl-error data-[invalid]:text-cl-on-accent",
          itemText:
            "data-[state=active]:text-cl-accent data-[state=completed]:text-cl-text data-[state=inactive]:text-cl-text-tertiary data-[invalid]:text-cl-error",
          description:
            "data-[state=active]:text-cl-accent data-[state=completed]:text-cl-text-secondary data-[state=inactive]:text-cl-text-tertiary data-[invalid]:text-cl-error",
          separator:
            "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:h-6 bg-black/[0.08] dark:bg-white/15 data-[state=active]:bg-cl-accent/30 data-[state=completed]:bg-cl-accent"
        }
      }
    />
  );
}
