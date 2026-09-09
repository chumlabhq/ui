import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <RadioGroup
      name="error"
      label="Select a role"
      defaultValue=""
      error
      errorMessage="You must select a role to continue"
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
        value="admin"
        label="Admin"
        classes={
          {
            root: "flex items-center gap-2",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <RadioButton
        value="editor"
        label="Editor"
        classes={
          {
            root: "flex items-center gap-2",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <RadioButton
        value="viewer"
        label="Viewer"
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
