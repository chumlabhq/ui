import { useState } from "react";
import { Step, Stepper } from "@chumlab/ui/stepper";

const basicSteps: Step[] = [
  { id: 1, label: "Step 1" },
  { id: 2, label: "Step 2" },
  { id: 3, label: "Step 3" },
  { id: 4, label: "Step 4" },
];

export default function StepperExample() {
  const [renderStepStep, setRenderStepStep] = useState<number>(2);
  return (
    <Stepper
      steps={basicSteps}
      value={renderStepStep}
      onValueChange={(id) => setRenderStepStep(id as number)}
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
      renderStep={
        (props, defaultElement) => {
          if (props.status === "active") {
            return (
              <li
                key={props.step.id}
                className="shrink-0"
                data-status={props.status}
              >
                <div
                  className={"flex items-center gap-2 px-3 py-2 rounded-cl-lg bg-cl-accent/10 border border-cl-border-input-focus dark:bg-cl-accent/20 dark:border dark:border-cl-border-input-focus/30"}
                >
                  <div
                    className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-cl-accent text-cl-on-accent dark:bg-cl-accent dark:text-cl-on-accent"}
                  >
                    {props.index + 1}
                  </div>
                  <span
                    className={"text-sm font-semibold text-cl-accent dark:text-cl-accent"}
                  >
                    {typeof props.step.label === "string"
                      ? props.step.label
                      : `Step ${props.index + 1}`}
                  </span>
                </div>
              </li>
            );
          }
          return defaultElement;
        }
      }
    />
  );
}
