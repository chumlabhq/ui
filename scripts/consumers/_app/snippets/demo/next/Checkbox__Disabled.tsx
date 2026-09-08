import { Checkbox } from "@chumlab/ui/checkbox";

export default function CheckboxExample() {
  return (
    <>
      <Checkbox
                  label="Disabled unchecked"
                  disabled
                  size="md"
                  shape="rounded"
                  classes={({
          root: "",
          label: `text-sm font-medium text-cl-text`,
          description: `text-xs text-cl-text-secondary`
        })}
                />
      <Checkbox
                  label="Disabled checked"
                  disabled
                  checked
                  size="md"
                  shape="rounded"
                  classes={({
          root: "",
          label: `text-sm font-medium text-cl-text`,
          description: `text-xs text-cl-text-secondary`
        })}
                />
    </>
  );
}
