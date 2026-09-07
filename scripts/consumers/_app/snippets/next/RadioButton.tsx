import { RadioGroup, RadioButton } from "@chumlab/ui/radio-button";

export default function Example() {
  return (
    <RadioGroup name="plan" defaultValue="basic">
      <RadioButton value="basic" label="Basic" />
      <RadioButton value="pro" label="Pro" />
      <RadioButton value="enterprise" label="Enterprise" />
    </RadioGroup>
  );
}
