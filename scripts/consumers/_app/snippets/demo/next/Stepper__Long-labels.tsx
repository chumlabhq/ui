import { Stepper } from "@chumlab/ui/stepper";

export default function StepperExample() {
  return (
    <div className="w-full max-w-lg">
      <Stepper
        steps={
          [
            { id: "details", label: "Your contact details", description: "Name, email and phone number" },
            { id: "address", label: "Delivery address and time slot", description: "Where and when it should arrive" },
            { id: "payment", label: "Payment and billing address", description: "Card, invoice or bank transfer" },
            { id: "review", label: "Review everything and place the order", description: "Nothing is charged until this step" }
          ]
        }
        value={1}
        showDescriptions
      />
    </div>
  );
}
