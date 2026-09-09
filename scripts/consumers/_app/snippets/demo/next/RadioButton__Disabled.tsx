import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium mb-2 text-cl-text-secondary">Group disabled</p>
        <RadioGroup
          name="disabled-group"
          defaultValue="option-a"
          disabled
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
            value="option-a"
            label="Option A"
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: "text-xs text-cl-text-secondary"
              }
            }
          />
          <RadioButton
            value="option-b"
            label="Option B"
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: "text-xs text-cl-text-secondary"
              }
            }
          />
        </RadioGroup>
      </div>
      <div>
        <p className="text-xs font-medium mb-2 text-cl-text-secondary">Individual disabled</p>
        <RadioGroup
          name="disabled-individual"
          defaultValue="enabled"
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
            value="enabled"
            label="Enabled option"
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: "text-xs text-cl-text-secondary"
              }
            }
          />
          <RadioButton
            value="disabled"
            label="Disabled option"
            disabled
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: "text-xs text-cl-text-secondary"
              }
            }
          />
        </RadioGroup>
      </div>
    </div>
  );
}
