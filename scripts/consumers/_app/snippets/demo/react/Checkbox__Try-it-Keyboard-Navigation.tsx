import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs mb-1 text-cl-text-tertiary">
        Try: Tab into the checkboxes below, then press Space to toggle them.
      </p>
      <Checkbox
        label="First option"
        defaultChecked
        classes={
          {
            root: "",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <Checkbox
        label="Second option"
        classes={
          {
            root: "",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
      <Checkbox
        label="Third option (disabled)"
        disabled
        classes={
          {
            root: "",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }
        }
      />
    </div>
  );
}
