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
                      control: "inline-flex items-center justify-center border-2 transition-colors cursor-pointer bg-cl-success border-cl-success text-cl-on-accent",
                      label: "text-sm font-medium text-cl-success"
                    }
        }
        size="md"
        shape="rounded"
      />
      <Checkbox
        label="Accent theme"
        checked
        classes={
          {
                      ...({
            root: "",
            label: "text-sm font-medium text-cl-text",
            description: "text-xs text-cl-text-secondary"
          }),
                      control: "inline-flex items-center justify-center border-2 transition-colors cursor-pointer bg-cl-accent-bg border-cl-accent text-cl-accent",
                      label: "text-sm font-medium text-cl-accent"
                    }
        }
        size="md"
        shape="circle"
      />
    </>
  );
}
