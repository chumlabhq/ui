import { useState } from "react";
import { Step, Stepper } from "@chumlab/ui/stepper";

const CheckCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const TruckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
  </svg>
);

const CreditCardIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
    <path
      fillRule="evenodd"
      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
      clipRule="evenodd"
    />
  </svg>
);

const UserIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);

const checkoutSteps: Step[] = [
  {
    id: "account",
    label: "Account",
    description: "Create your account",
    icon: UserIcon,
  },
  {
    id: "payment",
    label: "Payment",
    description: "Add payment method",
    icon: CreditCardIcon,
  },
  {
    id: "shipping",
    label: "Shipping",
    description: "Set delivery address",
    icon: TruckIcon,
  },
  {
    id: "confirm",
    label: "Confirm",
    description: "Review your order",
    icon: CheckCircleIcon,
  },
];

export default function StepperExample() {
  const [checkoutStep, setCheckoutStep] = useState<string>("payment");
  return (
    <Stepper
      steps={checkoutSteps}
      value={checkoutStep}
      onValueChange={(id) => setCheckoutStep(id as string)}
      variant="icon"
      showDescriptions
      showConnectors
      labelPosition="bottom"
      fullWidth
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
                    itemText: "text-sm font-medium leading-tight mt-1 transition-colors"
                  }
      }
    />
  );
}
