import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <RadioGroup
                name="success"
                label="Preferred contact"
                defaultValue="email"
                success
                successMessage="Contact preference saved"
                size="md"
                classes={({
        root: "",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })}
              >
                <RadioButton value="email" label="Email" classes={({
        root: "flex items-center gap-2",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })} />
                <RadioButton value="phone" label="Phone" classes={({
        root: "flex items-center gap-2",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })} />
              </RadioGroup>
  );
}
