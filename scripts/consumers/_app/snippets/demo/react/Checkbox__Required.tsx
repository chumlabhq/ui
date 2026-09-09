import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  return (
    <Checkbox
      label="I agree to the privacy policy"
      required
      checked={false}
      size="md"
      shape="rounded"
      classes={
        {
          root: "",
          label: "text-sm font-medium text-cl-text",
          description: "text-xs text-cl-text-secondary"
        }
      }
    />
  );
}
