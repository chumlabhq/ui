import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        label="Processing..."
        loading
        checked
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
      <Checkbox
        label="Normal checkbox"
        checked
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
    </div>
  );
}
