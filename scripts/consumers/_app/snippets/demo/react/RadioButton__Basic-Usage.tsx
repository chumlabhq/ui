import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <>
      <RadioGroup
        name="basic"
        defaultValue="email"
        label="Notification preference"
        description="Choose how you'd like to receive updates"
      >
        <RadioButton value="email" label="Email" description="Receive updates via email" />
        <RadioButton value="sms" label="SMS" description="Text messages to your phone" />
        <RadioButton
          value="push"
          label="Push notifications"
          description="In-app and browser alerts"
        />
        <RadioButton
          value="none"
          label="None"
          description="Opt out of all notifications"
          disabled
        />
      </RadioGroup>
    </>
  );
}
