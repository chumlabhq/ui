import { useState } from "react";
import { Stepper } from "@chumlab/ui/stepper";

const steps = [
  { id: 1, itemText: "Account" },
  { id: 2, itemText: "Profile" },
  { id: 3, itemText: "Review" },
];

export default function Example() {
  const [active, setActive] = useState<string | number>(1);
  return (
    <Stepper
      steps={steps}
      value={active}
      onValueChange={setActive}
      isStepClickable={() => true}
    />
  );
}
