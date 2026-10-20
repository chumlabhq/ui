import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

export default function RadioButtonExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="space-y-1.5">
        <span id="radio-classes-card" className="text-xs font-medium text-cl-text-secondary">
          Card-style selection
        </span>
        <RadioGroup
          name="classes-card"
          aria-labelledby="radio-classes-card"
          defaultValue="monthly"
          size="md"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        >
          {
            [
              { value: "monthly", label: "Monthly", desc: "$9/mo" },
              { value: "yearly", label: "Yearly", desc: "$89/yr — save 17%" }
            ].map((opt) => (
              <RadioButton
                key={opt.value}
                value={opt.value}
                label={opt.label}
                description={opt.desc}
                classes={
                  {
                    root: "flex items-center gap-3 px-4 py-3 rounded-cl-lg border-2 transition-colors border-cl-border",
                    label: "text-sm font-semibold text-cl-text",
                    description: "text-xs text-cl-text-secondary",
                    control: "inline-flex items-center justify-center rounded-full border-2 transition-colors",
                    itemIndicator: ""
                  }
                }
              />
            ))
          }
        </RadioGroup>
      </div>
      <div className="space-y-1.5">
        <span id="radio-classes-minimal" className="text-xs font-medium text-cl-text-secondary">
          Minimal / underline
        </span>
        <RadioGroup
          name="classes-minimal"
          aria-labelledby="radio-classes-minimal"
          defaultValue="light"
          size="sm"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        >
          {
            ["Light", "Dark", "System"].map((t) => (
              <RadioButton
                key={t}
                value={t.toLowerCase()}
                label={t}
                classes={
                  {
                    root: "flex items-center gap-2 pb-2 border-b border-cl-border",
                    label: "text-sm text-cl-text-secondary",
                    description: "",
                    control: "inline-flex items-center justify-center rounded-full border-2 transition-colors",
                    itemIndicator: ""
                  }
                }
              />
            ))
          }
        </RadioGroup>
      </div>
    </div>
  );
}
