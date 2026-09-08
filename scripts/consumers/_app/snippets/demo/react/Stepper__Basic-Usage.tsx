import { useState } from "react";
import { Step, Stepper } from "@chumlab/ui/stepper";

const basicSteps: Step[] = [
  { id: 1, label: "Step 1" },
  { id: 2, label: "Step 2" },
  { id: 3, label: "Step 3" },
  { id: 4, label: "Step 4" },
];

export default function StepperExample() {
  const [basicStep, setBasicStep] = useState<number>(2);
  return (
    <div className="w-full">
                {}
                <Stepper
                  steps={basicSteps}
                  value={basicStep}
                  onValueChange={(id) => setBasicStep(id as number)}
                  isStepClickable={() => true}
                />
              </div>
  );
}
