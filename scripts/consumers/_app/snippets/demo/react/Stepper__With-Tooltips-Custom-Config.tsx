import { useState } from "react";
import { Step, StepTooltipConfig, Stepper } from "@chumlab/ui/stepper";

const tooltipConfigSteps: Step[] = [
  {
    id: 1,
    label: "Info",
    tooltip: {
      content: "Hover for more details about this step",
      side: "bottom",
      showArrow: true,
    } as StepTooltipConfig,
  },
  {
    id: 2,
    label: "Settings",
    tooltip: {
      content: (
        <div className="space-y-1">
          <div className="font-semibold">Configure Settings</div>
          <div className="text-cl-text-tertiary text-xs">
            Customize your preferences here
          </div>
        </div>
      ),
      maxWidth: 200,
    } as StepTooltipConfig,
  },
  {
    id: 3,
    label: "Review",
    tooltip: {
      content: "Review all your changes before proceeding",
      side: "top",
      shadow: "xl",
    } as StepTooltipConfig,
  },
];

export default function StepperExample() {
  const [tooltipConfigStep, setTooltipConfigStep] = useState<number>(2);
  return (
    <div className="w-full space-y-3">
      <Stepper
        steps={tooltipConfigSteps}
        value={tooltipConfigStep}
        onValueChange={(id) => setTooltipConfigStep(id as number)}
        showTooltips
        isStepClickable={() => true}
        classes={
          {
                        ...({
            trigger:
              "cursor-pointer rounded-cl-md px-2 py-1.5 hover:bg-cl-code-text/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
            itemIndicator:
              "data-[state=active]:bg-cl-accent data-[state=active]:text-cl-on-accent data-[state=completed]:bg-cl-accent data-[state=completed]:text-cl-on-accent data-[state=inactive]:bg-black/[0.06] dark:data-[state=inactive]:bg-white/10 data-[state=inactive]:text-cl-text-secondary data-[invalid]:bg-cl-error data-[invalid]:text-cl-on-accent",
            itemText:
              "data-[state=active]:text-cl-accent data-[state=completed]:text-cl-text data-[state=inactive]:text-cl-text-tertiary data-[invalid]:text-cl-error",
            description:
              "data-[state=active]:text-cl-accent data-[state=completed]:text-cl-text-secondary data-[state=inactive]:text-cl-text-tertiary data-[invalid]:text-cl-error",
            separator:
              "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:h-6 bg-black/[0.08] dark:bg-white/15 data-[state=active]:bg-cl-accent/30 data-[state=completed]:bg-cl-accent"
          }),
                        itemIndicator: "shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-transparent transition-colors data-[status=active]:bg-cl-accent data-[status=active]:text-cl-on-accent data-[status=active]:border-cl-border-input-focus data-[status=completed]:bg-cl-accent data-[status=completed]:text-cl-on-accent data-[status=completed]:border-cl-accent data-[status=pending]:bg-black/[0.06] data-[status=pending]:text-cl-text-secondary data-[status=pending]:border-black/[0.08] dark:data-[status=pending]:bg-white/10 dark:data-[status=pending]:border-white/15",
                        itemIcon: "w-5 h-5"
                      }
        }
      />
      <p className="text-sm text-cl-text-secondary">
        Uses
        {" "}
        <code
          className="px-1 rounded text-xs font-mono bg-cl-bg-elevated text-cl-text-secondary"
        >
          data-[status]
        </code>
        {" "}
        selectors for per-status styling
      </p>
    </div>
  );
}
