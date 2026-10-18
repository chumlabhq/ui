import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Dropdown } from "@chumlab/ui/dropdown";
import { Input } from "@chumlab/ui/input";
import { Stepper } from "@chumlab/ui/stepper";

export default function StepperExample() {
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardName, setWizardName] = useState("");
  const [wizardPlan, setWizardPlan] = useState<string | null>(null);
  const [wizardDone, setWizardDone] = useState(false);
  return (
    <div data-demo-recipe="wizard" className="w-full space-y-6">
      <Stepper
        steps={
          [
            { id: "details", label: "Your details" },
            { id: "plan", label: "Plan" },
            { id: "review", label: "Review" }
          ]
        }
        value={["details", "plan", "review"][wizardStep]}
      />
      <div className="w-full sm:max-w-sm space-y-4">
        {
          wizardStep === 0 && (
            <Input
              label="Full name"
              value={wizardName}
              onValueChange={setWizardName}
              description="At least two characters."
            />
          )
        }
        {
          wizardStep === 1 && (
            <Dropdown
              label="Plan"
              options={
                [
                  { value: "starter", label: "Starter" },
                  { value: "team", label: "Team" },
                  { value: "business", label: "Business" }
                ]
              }
              value={wizardPlan}
              onValueChange={(plan) => setWizardPlan(plan)}
            />
          )
        }
        {
          wizardStep === 2 && (
            <p data-demo-wizard-review="" className="text-sm text-cl-text">
              {wizardDone ? `Done: ${wizardName} on the ${wizardPlan} plan.` : `${wizardName}, ${wizardPlan} plan. Finish to confirm.`}
            </p>
          )
        }
        <div className="flex gap-2">
          <Button
            className="border border-cl-border bg-cl-bg-elevated text-cl-text"
            disabled={wizardStep === 0}
            onClick={
              () => {
                setWizardDone(false);
                setWizardStep((step) => step - 1);
              }
            }
          >
            Back
          </Button>
          {
            wizardStep < 2 ? (
              <Button
                className="bg-cl-text text-cl-bg hover:opacity-90"
                disabled={wizardStep === 0 ? wizardName.trim().length < 2 : wizardPlan === null}
                onClick={() => setWizardStep((step) => step + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                className="bg-cl-text text-cl-bg hover:opacity-90"
                onClick={() => setWizardDone(true)}
              >
                Finish
              </Button>
            )
          }
        </div>
      </div>
    </div>
  );
}
