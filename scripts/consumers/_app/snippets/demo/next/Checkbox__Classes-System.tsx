import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  return (
    <>
      <Checkbox
        label="Green theme"
        checked
        classes={
          {
                      ...({
            root: "",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }),
                      label: "text-sm font-medium text-cl-success"
                    }
        }
        size="md"
        shape="rounded"
      />
      <Checkbox
        label="Pink theme"
        checked
        classes={
          {
                      ...({
            root: "",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }),
                      label: "text-sm font-medium text-cl-accent dark:text-cl-accent"
                    }
        }
        size="md"
        shape="circle"
      />
    </>
  );
}
