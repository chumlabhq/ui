import { useState } from "react";
import { Step, Stepper } from "@chumlab/ui/stepper";

const basicSteps: Step[] = [
  { id: 1, label: "Step 1" },
  { id: 2, label: "Step 2" },
  { id: 3, label: "Step 3" },
  { id: 4, label: "Step 4" },
];

export default function StepperExample() {
  const [loopStep, setLoopStep] = useState<number>(2);
  return (
    <div className="w-full space-y-3">
      <Stepper
        steps={basicSteps}
        value={loopStep}
        onValueChange={(id) => setLoopStep(id as number)}
        loop
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
      <p className="text-sm text-cl-text-secondary">
        Use
        <kbd
          className="px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary"
        >
          {"\u2190"}
        </kbd>
        {" "}
        <kbd
          className="px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary"
        >
          {"\u2192"}
        </kbd>
        to move focus,
        {" "}
        <kbd
          className="px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary"
        >
          Enter
        </kbd>
        /
        {" "}
        <kbd
          className="px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary"
        >
          Space
        </kbd>
        to activate. Focus loops from last to first and first to last.
      </p>
    </div>
  );
}
