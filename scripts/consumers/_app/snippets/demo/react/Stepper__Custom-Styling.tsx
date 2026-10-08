import { useState } from "react";
import { Stepper } from "@chumlab/ui/stepper";

export default function StepperExample() {
  const [customStep, setCustomStep] = useState<number>(2);
  return (
    <Stepper
      steps={
        [
          { id: 1, label: "Design" },
          { id: 2, label: "Develop" },
          { id: 3, label: "Deploy" }
        ]
      }
      value={customStep}
      onValueChange={(id) => setCustomStep(id as number)}
      isStepClickable={() => true}
      classes={
        {
                    ...({
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
        }),
                    trigger: "flex items-center gap-2 px-3 py-2 rounded-cl-lg border-2 border-transparent transition-all hover:border-cl-border-input-focus",
                    itemIndicator: "shrink-0 rounded-cl-lg flex items-center justify-center shadow-lg bg-cl-accent text-cl-on-accent shadow-accent",
                    itemIcon: "w-5 h-5",
                    itemText: "text-sm font-semibold text-cl-accent"
                  }
      }
    />
  );
}
