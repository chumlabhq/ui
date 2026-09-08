import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className={"text-xs font-medium text-cl-text-secondary"}>Filled (default)</span>
                  <RadioGroup
                    name="filled"
                    defaultValue="a"
                    size="lg"
                    classes={({
        root: "",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })}
                  >
                    <RadioButton value="a" label="Option A" classes={({
        root: "flex items-center gap-2",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })} />
                    <RadioButton value="b" label="Option B" classes={({
        root: "flex items-center gap-2",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })} />
                  </RadioGroup>
                </div>
                <div className="space-y-1.5">
                  <span className={"text-xs font-medium text-cl-text-secondary"}>Outlined</span>
                  <RadioGroup
                    name="outlined"
                    defaultValue="a"
                    size="lg"
                    classes={({
        root: "",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })}
                  >
                    <RadioButton
                      value="a"
                      label="Option A"
                      classes={({
        root: "flex items-center gap-2",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })}
                      checkedIcon={
                        <span
                          style={{ width: 10, height: 10, borderRadius: "50%", display: "block" }}
                          className={false ? "bg-cl-accent" : "bg-cl-accent"}
                        />
                      }
                    />
                    <RadioButton
                      value="b"
                      label="Option B"
                      classes={({
        root: "flex items-center gap-2",
        label: `text-sm font-medium text-cl-text`,
        description: `text-xs text-cl-text-secondary`
      })}
                      checkedIcon={
                        <span
                          style={{ width: 10, height: 10, borderRadius: "50%", display: "block" }}
                          className={false ? "bg-cl-accent" : "bg-cl-accent"}
                        />
                      }
                    />
                  </RadioGroup>
                </div>
              </div>
  );
}
