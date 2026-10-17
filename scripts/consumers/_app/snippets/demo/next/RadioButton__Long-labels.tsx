import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <div className="w-full max-w-sm">
      <RadioGroup
        name="long-delivery"
        label="How should we deliver orders that arrive after the warehouse has closed?"
        defaultValue="next"
      >
        <RadioButton
          value="next"
          label="Hold them and send everything together on the next working day"
        />
        <RadioButton
          value="split"
          label="Send what is ready now and the rest separately, which can cost more"
        />
      </RadioGroup>
    </div>
  );
}
