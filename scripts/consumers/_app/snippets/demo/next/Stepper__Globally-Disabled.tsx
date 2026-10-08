import { Step, Stepper } from "@chumlab/ui/stepper";

const basicSteps: Step[] = [
  { id: 1, label: "Step 1" },
  { id: 2, label: "Step 2" },
  { id: 3, label: "Step 3" },
  { id: 4, label: "Step 4" },
];

export default function StepperExample() {
  return (
    <div className="w-full space-y-2">
      <Stepper
        steps={basicSteps}
        value={2}
        disabled
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
      <p className="text-sm text-cl-text-secondary">
        All steps are non-interactive when the stepper is globally disabled
      </p>
    </div>
  );
}
