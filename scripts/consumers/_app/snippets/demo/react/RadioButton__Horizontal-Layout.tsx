import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <RadioGroup
      name="horizontal"
      defaultValue="left"
      orientation="horizontal"
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
        value="left"
        label="Left"
        classes={
          {
            root: "flex items-center gap-2",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <RadioButton
        value="center"
        label="Center"
        classes={
          {
            root: "flex items-center gap-2",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <RadioButton
        value="right"
        label="Right"
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
