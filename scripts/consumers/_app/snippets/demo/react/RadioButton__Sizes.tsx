import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
                  <div key={s} className="text-center">
                    <RadioGroup
                      name={`size-${s}`}
                      defaultValue="selected"
                      size={s}
                      classes={({
          root: "",
          label: `text-sm font-medium text-cl-text`,
          description: `text-xs text-cl-text-secondary`
        })}
                    >
                      <RadioButton value="selected" classes={({
          root: "flex items-center gap-2",
          label: `text-sm font-medium text-cl-text`,
          description: `text-xs text-cl-text-secondary`
        })} />
                    </RadioGroup>
                    <p className={`text-xs mt-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>{s}</p>
                  </div>
                ))}
      <div className="text-center">
                  <RadioGroup
                    name="size-custom"
                    defaultValue="selected"
                    size={28}
                    classes={({
          root: "",
          label: `text-sm font-medium text-cl-text`,
          description: `text-xs text-cl-text-secondary`
        })}
                  >
                    <RadioButton value="selected" classes={({
          root: "flex items-center gap-2",
          label: `text-sm font-medium text-cl-text`,
          description: `text-xs text-cl-text-secondary`
        })} />
                  </RadioGroup>
                  <p className={`text-xs mt-2 ${"text-xs font-medium text-cl-text-tertiary"}`}>28px</p>
                </div>
    </>
  );
}
