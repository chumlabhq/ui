import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <RadioGroup
      name="required"
      label="Select a plan"
      required
      defaultValue=""
      size="md"
      classes={
        {
          root: "",
          label: "text-sm font-medium text-cl-text",
          description: "text-xs text-cl-text-secondary"
        }
      }
    >
      <RadioButton
        value="free"
        label="Free"
        classes={
          {
            root: "flex items-center gap-2",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <RadioButton
        value="pro"
        label="Pro"
        classes={
          {
            root: "flex items-center gap-2",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <RadioButton
        value="enterprise"
        label="Enterprise"
        classes={
          {
            root: "flex items-center gap-2",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
    </RadioGroup>
  );
}
