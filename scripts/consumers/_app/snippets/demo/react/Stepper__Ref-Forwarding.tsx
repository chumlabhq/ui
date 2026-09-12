import { useRef } from "react";
import { Step, Stepper } from "@chumlab/ui/stepper";

const basicSteps: Step[] = [
  { id: 1, label: "Step 1" },
  { id: 2, label: "Step 2" },
  { id: 3, label: "Step 3" },
  { id: 4, label: "Step 4" },
];

export default function StepperExample() {
  const stepperRef = useRef<HTMLDivElement>(null);
  return (
    <div className="w-full space-y-4">
      <Stepper
        ref={stepperRef}
        steps={basicSteps}
        value={2}
        onValueChange={() => {}}
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
      <button
        onClick={
          () =>
          stepperRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer"
      >
        Scroll to Stepper
      </button>
    </div>
  );
}
