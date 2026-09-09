import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <>
      <div className="space-y-1.5 text-center">
        <RadioGroup
          name="color-green"
          defaultValue="a"
          size="lg"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        >
          <RadioButton
            value="a"
            label="Green"
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
        </RadioGroup>
      </div>
      <div className="space-y-1.5 text-center">
        <RadioGroup
          name="color-amber"
          defaultValue="a"
          size="lg"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        >
          <RadioButton
            value="a"
            label="Amber"
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
        </RadioGroup>
      </div>
      <div className="space-y-1.5 text-center">
        <RadioGroup
          name="color-rose"
          defaultValue="a"
          size="lg"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        >
          <RadioButton
            value="a"
            label="Rose"
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
        </RadioGroup>
      </div>
      <div className="space-y-1.5 text-center">
        <RadioGroup
          name="color-purple"
          defaultValue="a"
          size="lg"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        >
          <RadioButton
            value="a"
            label="Purple"
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
        </RadioGroup>
      </div>
      <div className="space-y-1.5 text-center">
        <RadioGroup
          name="color-default"
          defaultValue="a"
          size="lg"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        >
          <RadioButton
            value="a"
            label="Indigo"
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
    </>
  );
}
